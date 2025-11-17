import { useEffect, useRef, useMemo } from 'react';
import type { Map as MapboxMap, Marker } from 'mapbox-gl';
import { createMapMarker, removeMarkers, MARKER_COLORS } from '../../utils/marker_utils';
import type { ItineraryStopDto } from '../../types/quotes/itinerary';
import { StopType } from '../../types/quotes/itinerary';
import { getValidStops } from '../../utils/stop_utils';

interface UseMarkerManagementOptions {
  map: MapboxMap | null;
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

  const validStops = useMemo(() => {
    const allStops = getValidStops(stops);
    return allStops.filter((stop) => {
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
  }, [stops]);

  useEffect(() => {
    if (!map || !isMapLoaded) {
      return;
    }

    try {
      const container = map.getContainer();
      if (!container || !container.parentElement) {
        return;
      }
    } catch {
      return;
    }

    function updateMarkers(): boolean {
      if (!map) return false;

      const existingMarkersMap = new globalThis.Map<string, Marker>();
      markersRef.current.forEach((marker) => {
        const lngLat = marker.getLngLat();
        const key = `${lngLat.lng.toFixed(6)},${lngLat.lat.toFixed(6)}`;
        existingMarkersMap.set(key, marker);
      });

      const newStopsMap = new globalThis.Map<string, (typeof validStops)[0]>();
      validStops.forEach((stop) => {
        const key = `${stop.longitude.toFixed(6)},${stop.latitude.toFixed(6)}`;
        newStopsMap.set(key, stop);
      });

      const markersToRemove: Marker[] = [];
      existingMarkersMap.forEach((marker, key) => {
        if (!newStopsMap.has(key)) {
          markersToRemove.push(marker);
        }
      });
      removeMarkers(markersToRemove);
      markersToRemove.forEach((marker) => {
        const index = markersRef.current.indexOf(marker);
        if (index > -1) {
          markersRef.current.splice(index, 1);
        }
      });

      let allMarkersCreated = true;

      validStops.forEach((stop) => {
        const key = `${stop.longitude.toFixed(6)},${stop.latitude.toFixed(6)}`;
        
        if (!existingMarkersMap.has(key)) {
          const color =
            stop.stopType === StopType.PICKUP
              ? MARKER_COLORS.pickup
              : stop.stopType === StopType.DROPOFF
                ? MARKER_COLORS.dropoff
                : MARKER_COLORS.stop;

          const marker = createMapMarker(map, stop.longitude, stop.latitude, color);
          if (marker) {
            markersRef.current.push(marker);
          } else {
            allMarkersCreated = false;
          }
        }
      });

      return allMarkersCreated;
    }

    updateMarkers();

    if (styleLoadListenerRef.current) {
      map.off('style.load', styleLoadListenerRef.current);
      styleLoadListenerRef.current = null;
    }

    const handleStyleLoad = () => {
      updateMarkers();
    };

    styleLoadListenerRef.current = handleStyleLoad;
    map.on('style.load', handleStyleLoad);

    return () => {
      if (map && styleLoadListenerRef.current) {
        map.off('style.load', styleLoadListenerRef.current);
        styleLoadListenerRef.current = null;
      }
    };
  }, [map, isMapLoaded, validStops]);

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

