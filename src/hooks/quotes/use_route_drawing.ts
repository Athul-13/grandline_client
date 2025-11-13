import { useEffect, useRef } from 'react';
import type { Map } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import type { RouteResponse } from '../../services/api/mapbox_directions_service';

interface UseRouteDrawingOptions {
  map: Map | null;
  isMapLoaded: boolean;
  route: RouteResponse | null;
  routeId: string; // Unique ID for this route (e.g., 'outbound' or 'return')
}

/**
 * Hook for drawing routes on the map
 * Handles adding, updating, and removing route layers
 */
export const useRouteDrawing = ({
  map,
  isMapLoaded,
  route,
  routeId,
}: UseRouteDrawingOptions) => {
  const routeSourceRef = useRef<string | null>(null);

  useEffect(() => {
    if (!map || !isMapLoaded) return;

    const sourceId = `route-${routeId}`;

    // Remove existing route source and layer
    if (routeSourceRef.current) {
      try {
        if (map.getLayer(routeSourceRef.current)) {
          map.removeLayer(routeSourceRef.current);
        }
        if (map.getSource(routeSourceRef.current)) {
          map.removeSource(routeSourceRef.current);
        }
      } catch (error) {
        console.warn('Error removing route:', error);
      }
      routeSourceRef.current = null;
    }

    // Add new route if available
    if (route && route.geometry) {
      routeSourceRef.current = sourceId;

      try {
        // Add source
        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: route.geometry,
            properties: {},
          },
        });

        // Add layer
        map.addLayer({
          id: sourceId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': 'var(--color-primary)',
            'line-width': 4,
          },
        });

        // Fit map to route bounds
        const coordinates = route.geometry.coordinates;
        if (coordinates.length > 0) {
          const bounds = coordinates.reduce(
            (bounds, coord) => {
              return bounds.extend(coord as [number, number]);
            },
            new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number])
          );

          map.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            duration: 1000,
          });
        }
      } catch (error) {
        console.warn('Error adding route to map:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (map && routeSourceRef.current) {
        try {
          if (map.getLayer(routeSourceRef.current)) {
            map.removeLayer(routeSourceRef.current);
          }
          if (map.getSource(routeSourceRef.current)) {
            map.removeSource(routeSourceRef.current);
          }
        } catch (error) {
          console.warn('Error cleaning up route:', error);
        }
      }
    };
  }, [map, isMapLoaded, route, routeId]);
};

