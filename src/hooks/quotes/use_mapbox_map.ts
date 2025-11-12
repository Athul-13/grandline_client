import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { mapboxService } from '../../services/api/mapbox_service';
import type { Map } from 'mapbox-gl';

/**
 * Mapbox Map Hook
 * Manages Mapbox map initialization, markers, and geocoder
 */
export const useMapboxMap = (containerId: string, accessToken: string) => {
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

      const map = new mapboxgl.Map({
        container: containerId,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [0, 0], // Default center, will be updated when locations are added
        zoom: 2,
      });

      map.on('load', () => {
        setIsMapLoaded(true);
        setMapError(null);
      });

      map.on('error', (e) => {
        setMapError(e.error?.message || 'Map initialization failed');
      });

      // Initialize geocoder
      const geocoderInstance = mapboxService.initializeGeocoder(accessToken, mapboxgl);
      geocoderInstance.addTo(`#${containerId}`);

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
  }, [containerId, accessToken]);

  /**
   * Add marker to map
   */
  const addMarker = useCallback((latitude: number, longitude: number, color = '#C5630C') => {
    if (!mapRef.current) return null;

    const el = document.createElement('div');
    el.className = 'marker';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = color;
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

    const marker = new mapboxgl.Marker(el)
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);

    markersRef.current.push(marker);
    return marker;
  }, []);

  /**
   * Remove all markers
   */
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  }, []);

  /**
   * Center map on location
   */
  const centerMap = useCallback((latitude: number, longitude: number, zoom = 12) => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [longitude, latitude],
      zoom,
      duration: 1000,
    });
  }, []);

  /**
   * Get geocoder instance
   */
  const getGeocoder = useCallback(() => {
    return geocoderRef.current;
  }, []);

  return {
    map: mapRef.current,
    geocoder,
    isMapLoaded,
    mapError,
    addMarker,
    clearMarkers,
    centerMap,
    getGeocoder,
  };
};

