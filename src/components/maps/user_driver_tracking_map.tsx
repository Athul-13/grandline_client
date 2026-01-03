/**
 * User Driver Tracking Map Component
 * Displays driver location for a specific reservation with real-time updates
 * Features: Smooth interpolation, camera auto-follow, status indicators
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapContainer } from '../quotes/quote_builder/step_2/map_container';
import { useLocationUpdates } from '../../hooks/location/use_location_updates';
import { locationSocketService, type LocationUpdateEvent } from '../../services/socket/location_socket_service';
import { Wifi, WifiOff, Clock, Car, Pause, Locate } from 'lucide-react';
import { isSocketConnected, getSocketClient } from '../../services/socket/socket_client';
import { lerp, lerpAngle, easeOutCubic, calculateDistance } from '../../utils/interpolation';
import { formatTimeAgo } from '../../utils/time_format';

interface UserDriverTrackingMapProps {
  reservationId: string;
  /**
   * Initial driver location (optional)
   * Used to center map before first update
   */
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
  /**
   * User location (optional)
   * If provided, shows user marker alongside driver
   */
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  className?: string;
}

type TrackingState = 'waiting_trip_start' | 'waiting_first_location' | 'active' | 'paused' | 'ended';

interface InterpolationState {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  startHeading?: number;
  endHeading?: number;
  startTime: number;
  duration: number;
  animationId?: number;
}

interface TrackingStatus {
  state: TrackingState;
  lastUpdateTime: number | null;
  tripStartedAt: string | null;
  hasReceivedLocation: boolean;
}

/**
 * User Driver Tracking Map
 * Shows driver location for a specific reservation with real-time updates
 */
export const UserDriverTrackingMap: React.FC<UserDriverTrackingMapProps> = ({
  reservationId,
  initialLocation,
  userLocation,
  className,
  }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const driverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const interpolationRef = useRef<InterpolationState | null>(null);
  const lastUpdateTimeRef = useRef<number | null>(null);
  const currentZoomRef = useRef<number>(15);

  // Camera state
  const [isFollowing, setIsFollowing] = useState(true);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  // Connection and tracking state
  const [isConnected, setIsConnected] = useState(isSocketConnected());
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>({
    state: 'waiting_trip_start',
    lastUpdateTime: null,
    tripStartedAt: null,
    hasReceivedLocation: false,
  });
  const [driverSpeed, setDriverSpeed] = useState<number | null>(null);

  // Animate marker interpolation
  const animateMarker = useCallback((state: InterpolationState, marker: mapboxgl.Marker) => {
    const now = Date.now();
    const elapsed = now - state.startTime;
    const progress = Math.min(1, elapsed / state.duration);
    const eased = easeOutCubic(progress);

    // Interpolate position
    const lat = lerp(state.startLat, state.endLat, eased);
    const lng = lerp(state.startLng, state.endLng, eased);

    // Update marker position
    marker.setLngLat([lng, lat]);

    // Interpolate rotation if heading is available
    if (state.startHeading !== undefined && state.endHeading !== undefined) {
      const heading = lerpAngle(state.startHeading, state.endHeading, eased);
      const element = marker.getElement();
      if (element) {
        element.style.transform = `rotate(${heading}deg)`;
      }
    }

    if (progress < 1) {
      // Continue animation
      state.animationId = requestAnimationFrame(() => animateMarker(state, marker));
    } else {
      // Animation complete - sync final position
      marker.setLngLat([state.endLng, state.endLat]);
      if (state.endHeading !== undefined) {
        const element = marker.getElement();
        if (element) {
          element.style.transform = `rotate(${state.endHeading}deg)`;
        }
      }
      interpolationRef.current = null;
    }
  }, []);

  // Handle location updates with smooth interpolation
  const handleLocationUpdate = useCallback((data: LocationUpdateEvent) => {
    if (!mapRef.current || data.reservationId !== reservationId) {
      return;
    }

    const now = Date.now();
    const lastUpdate = lastUpdateTimeRef.current;
    const timeSinceLastUpdate = lastUpdate ? now - lastUpdate : 5000;
    lastUpdateTimeRef.current = now;

    // Update tracking status
    const timeSinceLastUpdateSeconds = timeSinceLastUpdate / 1000;
    setTrackingStatus((prev) => ({
      state: timeSinceLastUpdateSeconds > 10 ? 'paused' : 'active',
      lastUpdateTime: now,
      tripStartedAt: prev.tripStartedAt,
      hasReceivedLocation: true,
    }));

    // Update driver speed if available
    if (data.speed !== undefined && data.speed !== null) {
      // Convert m/s to km/h
      setDriverSpeed(data.speed * 3.6);
    }

    // Get or create marker
    if (!driverMarkerRef.current) {
      // Create new marker
      const el = document.createElement('div');
      el.className = 'driver-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#C5630C';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';
      el.style.cursor = 'pointer';
      el.style.transition = 'none';
      el.title = 'Driver Location';

      driverMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat([data.longitude, data.latitude])
        .addTo(mapRef.current);

      // Set initial rotation if heading available
      if (data.heading !== undefined && data.heading !== null) {
        const element = driverMarkerRef.current.getElement();
        if (element) {
          element.style.transform = `rotate(${data.heading}deg)`;
        }
      }
    } else {
      // Cancel existing interpolation if any
      if (interpolationRef.current?.animationId) {
        cancelAnimationFrame(interpolationRef.current.animationId);
      }

      // Get current marker position
      const currentLngLat = driverMarkerRef.current.getLngLat();
      const currentLat = currentLngLat.lat;
      const currentLng = currentLngLat.lng;

      // Get current heading from element transform
      let currentHeading: number | undefined;
      const element = driverMarkerRef.current.getElement();
      if (element) {
        const transform = element.style.transform;
        const match = transform.match(/rotate\(([^)]+)\)/);
        if (match) {
          currentHeading = parseFloat(match[1]);
        }
      }

      // Create interpolation state
      const duration = Math.min(5000, Math.max(1000, timeSinceLastUpdate));
      const interpolationState: InterpolationState = {
        startLat: currentLat,
        startLng: currentLng,
        endLat: data.latitude,
        endLng: data.longitude,
        startHeading: currentHeading,
        endHeading: data.heading,
        startTime: now,
        duration,
      };

      interpolationRef.current = interpolationState;

      // Start animation
      interpolationState.animationId = requestAnimationFrame(() =>
        animateMarker(interpolationState, driverMarkerRef.current!)
      );
    }

    // Handle camera auto-follow
    if (isFollowing && !userHasInteracted && mapRef.current) {
      const currentCenter = mapRef.current.getCenter();
      const distance = calculateDistance(
        currentCenter.lat,
        currentCenter.lng,
        data.latitude,
        data.longitude
      );

      // Only move camera if driver moved significantly (>50m)
      if (distance > 0.05) {
        mapRef.current.easeTo({
          center: [data.longitude, data.latitude],
          zoom: currentZoomRef.current, // Maintain zoom
          duration: 1000,
          easing: (t) => easeOutCubic(t),
        });
      }
    }
  }, [reservationId, isFollowing, userHasInteracted, animateMarker]);

  // Handle trip started
  const handleTripStarted = useCallback((data: { reservationId: string; driverId: string; userId?: string; startedAt: string }) => {
    if (data.reservationId === reservationId) {
      setTrackingStatus({
        state: 'waiting_first_location',
        lastUpdateTime: null,
        tripStartedAt: data.startedAt,
        hasReceivedLocation: false,
      });
    }
  }, [reservationId]);

  // Handle trip ended
  const handleTripEnded = useCallback((endedReservationId: string) => {
    if (endedReservationId === reservationId) {
      setTrackingStatus((prev) => ({ ...prev, state: 'ended' }));
      
      // Remove driver marker when trip ends
      if (driverMarkerRef.current) {
        driverMarkerRef.current.remove();
        driverMarkerRef.current = null;
      }
      
      // Cancel interpolation
      if (interpolationRef.current?.animationId) {
        cancelAnimationFrame(interpolationRef.current.animationId);
        interpolationRef.current = null;
      }
    }
  }, [reservationId]);

  // Subscribe to location updates
  useLocationUpdates({
    reservationId,
    onLocationUpdate: handleLocationUpdate,
    onTripEnded: handleTripEnded,
    enabled: !!reservationId,
  });

  // Subscribe to trip started events
  useEffect(() => {
    const unsubscribe = locationSocketService.onTripStarted(handleTripStarted);
    return unsubscribe;
  }, [handleTripStarted]);

  // Monitor socket connection
  useEffect(() => {
    const socket = getSocketClient();
    const checkConnection = () => {
      setIsConnected(isSocketConnected());
    };

    socket.on('connect', checkConnection);
    socket.on('disconnect', checkConnection);
    socket.on('reconnect_attempt', () => {
      setIsConnected(false); // Show reconnecting state
    });

    return () => {
      socket.off('connect', checkConnection);
      socket.off('disconnect', checkConnection);
      socket.off('reconnect_attempt', checkConnection);
    };
  }, []);

  // Check for stale updates
  useEffect(() => {
    if (trackingStatus.state === 'active' && trackingStatus.lastUpdateTime) {
      const interval = setInterval(() => {
        const timeSinceLastUpdate = Date.now() - trackingStatus.lastUpdateTime!;
        if (timeSinceLastUpdate > 10000) {
          setTrackingStatus((prev) => ({ ...prev, state: 'paused' }));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [trackingStatus.state, trackingStatus.lastUpdateTime]);

  // Handle map interactions (stop auto-follow)
  const handleMapInteraction = useCallback(() => {
    setUserHasInteracted(true);
    setIsFollowing(false);
    if (mapRef.current) {
      currentZoomRef.current = mapRef.current.getZoom();
    }
  }, []);

  // Handle re-center button
  const handleReCenter = useCallback(() => {
    if (!mapRef.current || !trackingStatus.lastUpdateTime) return;

    setIsFollowing(true);
    setUserHasInteracted(false);

    // Get current driver location from marker
    if (driverMarkerRef.current) {
      const lngLat = driverMarkerRef.current.getLngLat();
      mapRef.current.easeTo({
        center: [lngLat.lng, lngLat.lat],
        zoom: currentZoomRef.current,
        duration: 1000,
        easing: (t) => easeOutCubic(t),
      });
    }
  }, [trackingStatus.lastUpdateTime]);

  // Create user marker if location provided
  useEffect(() => {
    if (!mapRef.current || !userLocation) {
      return;
    }

    if (!userMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'user-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#3B82F6';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';
      el.style.cursor = 'pointer';
      el.title = 'Your Location';

      userMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(mapRef.current);
    } else {
      userMarkerRef.current.setLngLat([userLocation.longitude, userLocation.latitude]);
    }
  }, [userLocation]);

  // Initial map centering
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    // If we have both driver and user locations, fit bounds
    if (trackingStatus.hasReceivedLocation && userLocation && driverMarkerRef.current) {
      const driverLngLat = driverMarkerRef.current.getLngLat();
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([driverLngLat.lng, driverLngLat.lat]);
      bounds.extend([userLocation.longitude, userLocation.latitude]);
      mapRef.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
      currentZoomRef.current = mapRef.current.getZoom();
    } else if (trackingStatus.hasReceivedLocation && driverMarkerRef.current) {
      // Center on driver location
      const driverLngLat = driverMarkerRef.current.getLngLat();
      mapRef.current.easeTo({
        center: [driverLngLat.lng, driverLngLat.lat],
        zoom: 15,
        duration: 0,
      });
      currentZoomRef.current = 15;
    } else if (userLocation) {
      // Center on user location
      mapRef.current.easeTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 15,
        duration: 0,
      });
      currentZoomRef.current = 15;
    }
  }, [trackingStatus.hasReceivedLocation, userLocation]);

  // Cleanup markers and animations on unmount
  useEffect(() => {
    return () => {
      // Cancel animation
      if (interpolationRef.current?.animationId) {
        cancelAnimationFrame(interpolationRef.current.animationId);
      }

      // Remove markers
      if (driverMarkerRef.current) {
        driverMarkerRef.current.remove();
        driverMarkerRef.current = null;
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
    };
  }, []);

  const isMoving = driverSpeed !== null && driverSpeed > 5; // km/h threshold

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      {/* Status Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center gap-2">
        {/* Connection Status */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-md border ${
          isConnected
            ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        }`}>
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Live Tracking</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-yellow-500 animate-pulse" />
              <span className="text-sm text-yellow-700 dark:text-yellow-300">Reconnecting...</span>
            </>
          )}
        </div>

        {/* Last Update Time */}
        {trackingStatus.lastUpdateTime && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-md border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {formatTimeAgo(trackingStatus.lastUpdateTime)}
            </span>
          </div>
        )}

        {/* Driver Movement Status */}
        {driverSpeed !== null && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-md border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            {isMoving ? (
              <>
                <Car className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Moving ({Math.round(driverSpeed)} km/h)
                </span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Stopped</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Waiting State */}
      {trackingStatus.state === 'waiting_first_location' && isConnected && (
        <div className="absolute top-20 left-4 z-10 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-lg shadow-md border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Waiting for driver location...
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Driver has started the trip
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Paused State */}
      {trackingStatus.state === 'paused' && trackingStatus.lastUpdateTime && (
        <div className="absolute top-20 left-4 z-10 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-3 rounded-lg shadow-md border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Last update: {formatTimeAgo(trackingStatus.lastUpdateTime)}
          </p>
        </div>
      )}

      {/* Re-center Button */}
      {!isFollowing && trackingStatus.hasReceivedLocation && (
        <button
          onClick={handleReCenter}
          className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Locate className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Re-center</span>
        </button>
      )}

      {/* Map Container */}
      <MapContainer
        className={className}
        initialCenter={
          initialLocation
            ? [initialLocation.longitude, initialLocation.latitude]
            : userLocation
            ? [userLocation.longitude, userLocation.latitude]
            : undefined
        }
        initialZoom={15}
        onMapReady={(map) => {
          mapRef.current = map;
          currentZoomRef.current = map.getZoom();

          // Listen for user interactions
          map.on('dragstart', handleMapInteraction);
          map.on('zoomstart', handleMapInteraction);
          map.on('pitchstart', handleMapInteraction);
        }}
      />
    </div>
  );
};
