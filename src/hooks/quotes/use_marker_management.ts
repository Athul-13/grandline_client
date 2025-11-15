import { useEffect, useRef, useMemo } from 'react';
import type { Map, Marker } from 'mapbox-gl';
import { createMapMarker, removeMarkers, MARKER_COLORS } from '../../utils/marker_utils';
import type { ItineraryStopDto } from '../../types/quotes/itinerary';
import { StopType } from '../../types/quotes/itinerary';
import { getValidStops } from '../../utils/stop_utils';

interface UseMarkerManagementOptions {
  map: Map | null;
  isMapLoaded: boolean;
  stops: ItineraryStopDto[];
}

/**
 * Hook for managing map markers
 * Handles creating, updating, and removing markers based on stops
 */
export const useMarkerManagement = ({
  map,
  isMapLoaded,
  stops,
}: UseMarkerManagementOptions) => {
  const markersRef = useRef<Marker[]>([]);
  const styleLoadListenerRef = useRef<(() => void) | null>(null);

  // Create a stable reference for valid stops to ensure effect triggers properly
  const validStops = useMemo(() => {
    const allStops = getValidStops(stops);
    const filtered = allStops.filter((stop) => {
      // Additional validation: ensure coordinates are valid numbers within reasonable ranges
      return (
        typeof stop.latitude === 'number' &&
        typeof stop.longitude === 'number' &&
        !isNaN(stop.latitude) &&
        !isNaN(stop.longitude) &&
        stop.latitude >= -90 &&
        stop.latitude <= 90 &&
        stop.longitude >= -180 &&
        stop.longitude <= 180 &&
        stop.latitude !== 0 &&
        stop.longitude !== 0
      );
    });
    console.log('🎯 useMarkerManagement: validStops updated', {
      allStopsCount: allStops.length,
      validStopsCount: filtered.length,
      validStops: filtered.map(s => ({
        locationName: s.locationName,
        lat: s.latitude,
        lng: s.longitude,
        stopType: s.stopType
      }))
    });
    return filtered;
  }, [stops]);

  useEffect(() => {
    console.log('🎯 useMarkerManagement: effect triggered', {
      hasMap: !!map,
      isMapLoaded,
      validStopsCount: validStops.length
    });

    if (!map || !isMapLoaded) {
      console.log('🎯 useMarkerManagement: early return - map not ready', {
        hasMap: !!map,
        isMapLoaded
      });
      return;
    }

    // Ensure map container is ready
    try {
      const container = map.getContainer();
      if (!container || !container.parentElement) {
        console.log('🎯 useMarkerManagement: container not ready');
        return;
      }
    } catch {
      console.log('🎯 useMarkerManagement: container check failed');
      return;
    }

    // Function to update markers (returns true if all markers created successfully)
    function updateMarkers(): boolean {
      if (!map) return false; // Type guard

      console.log('🎯 useMarkerManagement: updateMarkers called', {
        validStopsCount: validStops.length,
        existingMarkersCount: markersRef.current.length
      });

      // Clear existing markers
      removeMarkers(markersRef.current);
      markersRef.current = [];

      let allMarkersCreated = true;

      // Add markers for valid stops
      validStops.forEach((stop, index) => {
        const color =
          stop.stopType === StopType.PICKUP
            ? MARKER_COLORS.pickup
            : stop.stopType === StopType.DROPOFF
              ? MARKER_COLORS.dropoff
              : MARKER_COLORS.stop;

        console.log(`🎯 useMarkerManagement: Creating marker ${index + 1}/${validStops.length}`, {
          locationName: stop.locationName,
          lat: stop.latitude,
          lng: stop.longitude,
          color
        });

        const marker = createMapMarker(map, stop.longitude, stop.latitude, color);
        if (marker) {
          console.log(`✅ useMarkerManagement: Marker ${index + 1} created successfully`);
          markersRef.current.push(marker);
        } else {
          console.log(`❌ useMarkerManagement: Marker ${index + 1} creation failed`);
          allMarkersCreated = false;
        }
      });

      console.log('🎯 useMarkerManagement: updateMarkers complete', {
        totalMarkersCreated: markersRef.current.length,
        allMarkersCreated
      });

      return allMarkersCreated;
    }

    // Try to create markers immediately
    updateMarkers();

    // Set up style.load listener to retry marker creation when style loads
    // Remove old listener if it exists
    if (styleLoadListenerRef.current) {
      map.off('style.load', styleLoadListenerRef.current);
      styleLoadListenerRef.current = null;
    }

    // Set up new listener to retry marker creation when style loads
    const handleStyleLoad = () => {
      console.log('🎯 useMarkerManagement: style.load event fired, retrying marker creation');
      updateMarkers();
    };

    styleLoadListenerRef.current = handleStyleLoad;

    // Always set up listener - style might reload or might not be ready yet
    // If markers failed to create, we'll retry when style.load fires
    console.log('🎯 useMarkerManagement: Setting up style.load listener');
    map.on('style.load', handleStyleLoad);

    // Cleanup: remove style.load listener when effect re-runs or unmounts
    return () => {
      if (map && styleLoadListenerRef.current) {
        map.off('style.load', styleLoadListenerRef.current);
        styleLoadListenerRef.current = null;
      }
    };
  }, [map, isMapLoaded, validStops]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      removeMarkers(markersRef.current);
      markersRef.current = [];
      if (map && styleLoadListenerRef.current) {
        map.off('style.load', styleLoadListenerRef.current);
        styleLoadListenerRef.current = null;
      }
    };
  }, [map]);

  return markersRef.current;
};

