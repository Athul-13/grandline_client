import { useEffect, useRef } from 'react';
import type { Map } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
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
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!map || !isMapLoaded) return;

    // Ensure map container is ready
    try {
      const container = map.getContainer();
      if (!container || !container.parentElement) {
        return;
      }
    } catch {
      return;
    }

    // Clear existing markers
    removeMarkers(markersRef.current);
    markersRef.current = [];

    // Add markers for valid stops
    const validStops = getValidStops(stops);
    validStops.forEach((stop) => {
      const color =
        stop.stopType === StopType.PICKUP
          ? MARKER_COLORS.pickup
          : stop.stopType === StopType.DROPOFF
            ? MARKER_COLORS.dropoff
            : MARKER_COLORS.stop;

      const marker = createMapMarker(map, stop.longitude, stop.latitude, color);
      if (marker) {
        markersRef.current.push(marker);
      }
    });
  }, [map, isMapLoaded, stops]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      removeMarkers(markersRef.current);
      markersRef.current = [];
    };
  }, []);

  return markersRef.current;
};

