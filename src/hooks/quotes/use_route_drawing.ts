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
 * Includes style readiness check and retry mechanism
 */
export const useRouteDrawing = ({
  map,
  isMapLoaded,
  route,
  routeId,
}: UseRouteDrawingOptions) => {
  const routeSourceRef = useRef<string | null>(null);
  const styleLoadListenerRef = useRef<(() => void) | null>(null);
  const hasFittedBoundsRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!hasFittedBoundsRef.current[routeId]) {
      hasFittedBoundsRef.current[routeId] = false;
    }

    if (!map || !isMapLoaded) {
      return;
    }

    const sourceId = `route-${routeId}`;

    function updateRouteLayer(): boolean {
      if (!map) return false;

      const existingLayer = routeSourceRef.current ? map.getLayer(routeSourceRef.current) : null;
      const existingSource = routeSourceRef.current ? map.getSource(routeSourceRef.current) : null;
      
      if (existingLayer && existingSource && route && route.geometry) {
        try {
          (existingSource as mapboxgl.GeoJSONSource).setData({
            type: 'Feature',
            geometry: route.geometry,
            properties: {},
          });
          return true;
        } catch {
          // Fall through to remove and re-add
        }
      }

      if (routeSourceRef.current) {
        try {
          if (map.getLayer(routeSourceRef.current)) {
            map.removeLayer(routeSourceRef.current);
          }
          if (map.getSource(routeSourceRef.current)) {
            map.removeSource(routeSourceRef.current);
          }
        } catch {
          // Silently handle removal errors
        }
        routeSourceRef.current = null;
      }

      if (route && route.geometry) {
        routeSourceRef.current = sourceId;

        try {
          map.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: route.geometry,
              properties: {},
            },
          });

          // Find appropriate layer position to place route above roads
          let beforeId: string | undefined;
          try {
            const style = map.getStyle();
            if (style && style.layers) {
              let lastRoadLayerId: string | undefined;
              
              for (let i = style.layers.length - 1; i >= 0; i--) {
                const layer = style.layers[i];
                const layerId = layer.id;
                
                if (
                  (layerId.includes('road') || 
                   layerId.includes('street') || 
                   layerId.includes('highway') ||
                   (layer.type === 'line' && !layerId.includes('label'))) &&
                  map.getLayer(layerId)
                ) {
                  lastRoadLayerId = layerId;
                  break;
                }
              }
              
              if (lastRoadLayerId) {
                const roadLayerIndex = style.layers.findIndex(l => l.id === lastRoadLayerId);
                if (roadLayerIndex >= 0 && roadLayerIndex < style.layers.length - 1) {
                  for (let i = roadLayerIndex + 1; i < style.layers.length; i++) {
                    const nextLayer = style.layers[i];
                    if (map.getLayer(nextLayer.id) && 
                        (nextLayer.type === 'symbol' || nextLayer.id.includes('label'))) {
                      beforeId = nextLayer.id;
                      break;
                    }
                  }
                }
              } else {
                const symbolLayer = style.layers.find(
                  (layer) => layer.type === 'symbol' && map.getLayer(layer.id)
                );
                if (symbolLayer) {
                  beforeId = symbolLayer.id;
                }
              }
            }
          } catch {
            beforeId = undefined;
          }

          const layerConfig = {
            id: sourceId,
            type: 'line' as const,
            source: sourceId,
            layout: {
              'line-join': 'round' as const,
              'line-cap': 'round' as const,
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 6,
              'line-opacity': 0.9,
            },
          };

          if (beforeId) {
            map.addLayer(layerConfig, beforeId);
          } else {
            map.addLayer(layerConfig);
          }

          if (route.geometry.coordinates.length > 0) {
            const coordinates = route.geometry.coordinates;
            const bounds = coordinates.reduce(
              (bounds, coord) => {
                return bounds.extend(coord as [number, number]);
              },
              new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number])
            );

            if (!hasFittedBoundsRef.current[routeId]) {
              map.fitBounds(bounds, {
                padding: { top: 50, bottom: 50, left: 50, right: 50 },
                duration: 1500,
                essential: true,
              });
              hasFittedBoundsRef.current[routeId] = true;
            }
          }

          return true;
        } catch {
          routeSourceRef.current = null;
          return false;
        }
      } else {
        return true;
      }
    }

    updateRouteLayer();

    if (styleLoadListenerRef.current) {
      map.off('style.load', styleLoadListenerRef.current);
      styleLoadListenerRef.current = null;
    }

    const handleStyleLoad = () => {
      if (routeSourceRef.current && route && route.geometry) {
        const layerExists = map.getLayer(routeSourceRef.current);
        const sourceExists = map.getSource(routeSourceRef.current);
        if (!layerExists || !sourceExists) {
          routeSourceRef.current = null;
        }
      }
      updateRouteLayer();
    };

    styleLoadListenerRef.current = handleStyleLoad;
    map.on('style.load', handleStyleLoad);

    return () => {
      if (map && styleLoadListenerRef.current) {
        map.off('style.load', styleLoadListenerRef.current);
        styleLoadListenerRef.current = null;
      }
    };
  }, [map, isMapLoaded, route, routeId]);

  useEffect(() => {
    return () => {
      if (map && routeSourceRef.current) {
        try {
          if (map.getLayer(routeSourceRef.current)) {
            map.removeLayer(routeSourceRef.current);
          }
          if (map.getSource(routeSourceRef.current)) {
            map.removeSource(routeSourceRef.current);
          }
        } catch {
          // Silently handle cleanup errors
        }
      }
      if (map && styleLoadListenerRef.current) {
        map.off('style.load', styleLoadListenerRef.current);
        styleLoadListenerRef.current = null;
      }
    };
  }, [map]);
};

