/**
 * Admin Live Trips Map Component
 * Displays all active trips on a map with real-time location updates
 */

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapContainer } from '../quotes/quote_builder/step_2/map_container';
import { useLocationUpdates } from '../../hooks/location/use_location_updates';
import { locationSocketService, type LocationUpdateEvent } from '../../services/socket/location_socket_service';
import { Wifi, WifiOff } from 'lucide-react';
import { isSocketConnected, getSocketClient } from '../../services/socket/socket_client';
import { lerp, lerpAngle, easeOutCubic } from '../../utils/interpolation';
import { adminTripService } from '../../services/api/admin_trip_service';

interface ActiveTrip {
  reservationId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  timestamp: string;
}

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

interface AdminLiveTripsMapProps {
  className?: string;
  /**
   * Initial active trips to display (optional)
   * If not provided, map will only show trips that send location updates
   */
  initialTrips?: ActiveTrip[];
}

/**
 * Admin Live Trips Map
 * Shows all active trips with real-time location updates
 */
export const AdminLiveTripsMap: React.FC<AdminLiveTripsMapProps> = ({
  className,
  initialTrips = [],
}) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const tripsRef = useRef<Map<string, ActiveTrip>>(new Map());
  const startedTripsRef = useRef<Set<string>>(new Set()); // Track trips that have started but haven't received location yet
  const interpolationRef = useRef<Map<string, InterpolationState>>(new Map());
  const lastUpdateTimeRef = useRef<Map<string, number>>(new Map());
  const [isConnected, setIsConnected] = useState(isSocketConnected());
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const locationsLoadedRef = useRef(false);

  // Initialize trips from props
  useEffect(() => {
    initialTrips.forEach((trip) => {
      tripsRef.current.set(trip.reservationId, trip);
    });
  }, [initialTrips]);

  // Fetch active trip locations when map is ready (before socket subscription)
  const fetchActiveLocations = async () => {
    if (locationsLoadedRef.current) {
      return; // Only fetch once
    }

    try {
      setIsLoadingLocations(true);
      const response = await adminTripService.getActiveTripLocations();
      
      // Render markers for all returned locations
      if (mapRef.current && response.locations.length > 0) {
        response.locations.forEach((location) => {
          // Only add if not already present (avoid duplicates)
          if (!tripsRef.current.has(location.reservationId)) {
            const trip: ActiveTrip = {
              reservationId: location.reservationId,
              driverId: location.driverId,
              latitude: location.latitude,
              longitude: location.longitude,
              heading: location.heading,
              timestamp: location.timestamp,
            };
            
            tripsRef.current.set(location.reservationId, trip);
            
            // Create marker immediately
            const el = document.createElement('div');
            el.className = 'driver-marker';
            el.style.width = '20px';
            el.style.height = '20px';
            el.style.borderRadius = '50%';
            el.style.backgroundColor = '#C5630C';
            el.style.border = '2px solid white';
            el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
            el.style.cursor = 'pointer';
            el.style.transition = 'none';
            el.title = `Reservation: ${location.reservationId}`;

            const marker = new mapboxgl.Marker({ element: el })
              .setLngLat([location.longitude, location.latitude])
              .addTo(mapRef.current!);

            if (location.heading !== undefined && location.heading !== null) {
              const element = marker.getElement();
              if (element) {
                element.style.transform = `rotate(${location.heading}deg)`;
              }
            }

            markersRef.current.set(location.reservationId, marker);
          }
        });

        // Fit bounds to show all active trips
        setTimeout(() => {
          if (mapRef.current && tripsRef.current.size > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            tripsRef.current.forEach((trip) => {
              bounds.extend([trip.longitude, trip.latitude]);
            });
            mapRef.current.fitBounds(bounds, {
              padding: 50,
              maxZoom: 15,
            });
          }
        }, 100);
      }
      
      locationsLoadedRef.current = true;
    } catch (error) {
      console.error('Error fetching active trip locations:', error);
      // Continue even if fetch fails - socket updates will still work
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Animate marker interpolation
  const animateMarker = (reservationId: string, state: InterpolationState, marker: mapboxgl.Marker) => {
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
      state.animationId = requestAnimationFrame(() => animateMarker(reservationId, state, marker));
    } else {
      // Animation complete - sync final position
      marker.setLngLat([state.endLng, state.endLat]);
      if (state.endHeading !== undefined) {
        const element = marker.getElement();
        if (element) {
          element.style.transform = `rotate(${state.endHeading}deg)`;
        }
      }
      interpolationRef.current.delete(reservationId);
    }
  };

  // Handle location updates with smooth interpolation
  const handleLocationUpdate = (data: LocationUpdateEvent) => {
    if (!mapRef.current) {
      return;
    }

    const now = Date.now();
    const lastUpdate = lastUpdateTimeRef.current.get(data.reservationId);
    const timeSinceLastUpdate = lastUpdate ? now - lastUpdate : 5000; // Default 5s if first update
    lastUpdateTimeRef.current.set(data.reservationId, now);

    // Update trip data
    const trip: ActiveTrip = {
      reservationId: data.reservationId,
      driverId: data.driverId,
      latitude: data.latitude,
      longitude: data.longitude,
      heading: data.heading,
      timestamp: data.timestamp,
    };

    tripsRef.current.set(data.reservationId, trip);
    // Remove from started trips set since we now have location data
    startedTripsRef.current.delete(data.reservationId);

    // Get or create marker
    let marker = markersRef.current.get(data.reservationId);

    if (!marker) {
      // Create new marker
      const el = document.createElement('div');
      el.className = 'driver-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#C5630C';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.transition = 'none'; // Disable CSS transitions for smooth animation
      el.title = `Reservation: ${data.reservationId}`;

      marker = new mapboxgl.Marker({ element: el })
        .setLngLat([data.longitude, data.latitude])
        .addTo(mapRef.current);

      markersRef.current.set(data.reservationId, marker);

      // Set initial rotation if heading available
      if (data.heading !== undefined && data.heading !== null) {
        const element = marker.getElement();
        if (element) {
          element.style.transform = `rotate(${data.heading}deg)`;
        }
      }
    } else {
      // Cancel existing interpolation if any
      const existingInterpolation = interpolationRef.current.get(data.reservationId);
      if (existingInterpolation?.animationId) {
        cancelAnimationFrame(existingInterpolation.animationId);
      }

      // Get current marker position
      const currentLngLat = marker.getLngLat();
      const currentLat = currentLngLat.lat;
      const currentLng = currentLngLat.lng;

      // Get current heading from element transform
      let currentHeading: number | undefined;
      const element = marker.getElement();
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

      interpolationRef.current.set(data.reservationId, interpolationState);

      // Start animation
      interpolationState.animationId = requestAnimationFrame(() =>
        animateMarker(data.reservationId, interpolationState, marker!)
      );
    }
  };

  // Handle trip started - track trip (marker will be created on first location update)
  // This ensures trip count is accurate immediately, even before first GPS ping
  const handleTripStarted = (data: { reservationId: string; driverId: string; userId?: string; startedAt: string }) => {
    // Track trip as started (marker will be created when first location update arrives)
    if (!tripsRef.current.has(data.reservationId) && !startedTripsRef.current.has(data.reservationId)) {
      startedTripsRef.current.add(data.reservationId);
    }
  };

  // Handle trip ended - remove marker
  const handleTripEnded = (reservationId: string) => {
    const marker = markersRef.current.get(reservationId);
    if (marker) {
      marker.remove();
      markersRef.current.delete(reservationId);
      tripsRef.current.delete(reservationId);
    }
    // Also remove from started trips if it was there
    startedTripsRef.current.delete(reservationId);
  };

  // Subscribe to location updates (only after initial load)
  useLocationUpdates({
    onLocationUpdate: handleLocationUpdate,
    onTripEnded: handleTripEnded,
    enabled: !isLoadingLocations, // Wait for initial load before subscribing
  });

  // Subscribe to trip started events (only after initial load)
  useEffect(() => {
    if (isLoadingLocations) {
      return; // Wait for initial load
    }
    
    const unsubscribe = locationSocketService.onTripStarted(handleTripStarted);
    return unsubscribe;
  }, [isLoadingLocations]);

  // Monitor socket connection
  useEffect(() => {
    const socket = getSocketClient();
    const checkConnection = () => {
      setIsConnected(isSocketConnected());
    };

    socket.on('connect', checkConnection);
    socket.on('disconnect', checkConnection);

    return () => {
      socket.off('connect', checkConnection);
      socket.off('disconnect', checkConnection);
    };
  }, []);

  // Cleanup markers and animations on unmount
  useEffect(() => {
    const markers = markersRef.current;
    const trips = tripsRef.current;
    const startedTrips = startedTripsRef.current;
    const interpolations = interpolationRef.current;
    const lastUpdateTimes = lastUpdateTimeRef.current;

    return () => {
      // Cancel all animations
      interpolations.forEach((state) => {
        if (state.animationId) {
          cancelAnimationFrame(state.animationId);
        }
      });

      // Remove all markers
      markers.forEach((marker) => marker.remove());
      markers.clear();
      trips.clear();
      startedTrips.clear();
      interpolations.clear();
      lastUpdateTimes.clear();
    };
  }, []);

  // Fit bounds to show all active trips
  const fitBounds = () => {
    if (!mapRef.current || tripsRef.current.size === 0) {
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    tripsRef.current.forEach((trip) => {
      bounds.extend([trip.longitude, trip.latitude]);
    });

    mapRef.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15,
    });
  };

  // Auto-fit bounds when trips are added
  useEffect(() => {
    if (mapRef.current && tripsRef.current.size > 0) {
      // Small delay to ensure map is ready
      const timer = setTimeout(fitBounds, 100);
      return () => clearTimeout(timer);
    }
  }, [tripsRef.current.size]);

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      {/* Connection Status Indicator */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Live Updates</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Offline</span>
          </>
        )}
      </div>

      {/* Active Trips Count */}
      <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Active Trips: <strong>{tripsRef.current.size + startedTripsRef.current.size}</strong>
        </span>
      </div>

      {/* Map Container */}
      <MapContainer
        className={className}
        onMapReady={(map) => {
          mapRef.current = map;
          // Fetch active trip locations when map is ready
          fetchActiveLocations();
          // Fit bounds to initial trips if any
          if (initialTrips.length > 0) {
            setTimeout(fitBounds, 500);
          }
        }}
      />
    </div>
  );
};

