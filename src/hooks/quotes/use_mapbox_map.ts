import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { mapboxService } from '../../services/api/mapbox_service';
import { useTheme } from '../use_theme';
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
  const { resolvedTheme } = useTheme();

  /**
   * Get map style based on theme
   */
  const getMapStyle = (theme: string | undefined): string => {
    return theme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v11'
      : 'mapbox://styles/mapbox/streets-v12';
  };

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

      const defaultCenter: [number, number] = [76.2673, 9.9312];
      const defaultZoom = 10;

      const map = new mapboxgl.Map({
        container: containerId,
        style: getMapStyle(resolvedTheme),
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

      const geocoderInstance = mapboxService.initializeGeocoder(accessToken, mapboxgl);

      mapRef.current = map;
      geocoderRef.current = geocoderInstance;
      setGeocoder(geocoderInstance);

      return () => {
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
  }, [containerId, accessToken, initialCenter, initialZoom, resolvedTheme]);

  /**
   * Update map style when theme changes
   */
  useEffect(() => {
    if (mapRef.current && isMapLoaded) {
      const newStyle = getMapStyle(resolvedTheme);
      // Preserve current view when switching styles
      const currentCenter = mapRef.current.getCenter();
      const currentZoom = mapRef.current.getZoom();
      const currentBearing = mapRef.current.getBearing();
      const currentPitch = mapRef.current.getPitch();

      mapRef.current.setStyle(newStyle);

      // Restore view after style loads
      mapRef.current.once('style.load', () => {
        if (mapRef.current) {
          mapRef.current.setCenter(currentCenter);
          mapRef.current.setZoom(currentZoom);
          mapRef.current.setBearing(currentBearing);
          mapRef.current.setPitch(currentPitch);
        }
      });
    }
  }, [resolvedTheme, isMapLoaded]);

  return {
    map: mapRef.current,
    geocoder,
    isMapLoaded,
    mapError,
  };
};

