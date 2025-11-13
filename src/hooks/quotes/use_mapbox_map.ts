import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { mapboxService } from '../../services/api/mapbox_service';
import type { Map } from 'mapbox-gl';

/**
 * Mapbox Map Hook
 * Manages Mapbox map initialization, markers, and geocoder
 */
export const useMapboxMap = (
  containerId: string,
  accessToken: string,
  initialCenter?: [number, number], // [longitude, latitude]
  initialZoom?: number
) => {
  const mapRef = useRef<Map | null>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [geocoder, setGeocoder] = useState<MapboxGeocoder | null>(null);

  /**
   * Initialize map
   */
  useEffect(() => {
    if (!accessToken) {
      setMapError('Mapbox access token is required');
      return;
    }

    try {
      mapboxgl.accessToken = accessToken;

      // Default to Kochi, India if no initial center provided
      const defaultCenter: [number, number] = [76.2673, 9.9312]; // Kochi coordinates
      const defaultZoom = 10;

      const map = new mapboxgl.Map({
        container: containerId,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: initialCenter || defaultCenter,
        zoom: initialZoom || defaultZoom,
      });

      map.on('load', () => {
        setIsMapLoaded(true);
        setMapError(null);
      });

      map.on('error', (e) => {
        setMapError(e.error?.message || 'Map initialization failed');
      });

      // Initialize geocoder (but don't add to map - will be added to custom container)
      const geocoderInstance = mapboxService.initializeGeocoder(accessToken, mapboxgl);

      mapRef.current = map;
      geocoderRef.current = geocoderInstance;
      setGeocoder(geocoderInstance);

      return () => {
        // Cleanup
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];
        geocoderRef.current = null;
        setGeocoder(null);
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (error) {
      setMapError(error instanceof Error ? error.message : 'Failed to initialize map');
    }
  }, [containerId, accessToken, initialCenter, initialZoom]);

  return {
    map: mapRef.current,
    geocoder,
    isMapLoaded,
    mapError,
  };
};

