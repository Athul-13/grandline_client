import { useEffect, useRef } from 'react';
import type { Map } from 'mapbox-gl';
import type MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useMapboxMap } from '../../../hooks/quotes/use_mapbox_map';

interface MapContainerProps {
  className?: string;
  onMapReady?: (map: Map | null) => void;
  onGeocoderReady?: (geocoder: MapboxGeocoder | null) => void;
  initialCenter?: [number, number]; // [longitude, latitude]
  initialZoom?: number;
}

/**
 * Map Container Component
 * Wrapper component for Mapbox map
 */
export const MapContainer: React.FC<MapContainerProps> = ({
  className,
  onMapReady,
  onGeocoderReady,
  initialCenter,
  initialZoom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = 'quote-builder-map';
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

  const { map, geocoder, isMapLoaded, mapError } = useMapboxMap(
    containerId,
    accessToken,
    initialCenter,
    initialZoom
  );

  useEffect(() => {
    if (containerRef.current && !containerRef.current.id) {
      containerRef.current.id = containerId;
    }
  }, [containerId]);

  // Track if we've already called onMapReady to prevent infinite loops
  const hasCalledMapReadyRef = useRef(false);

  useEffect(() => {
    if (isMapLoaded && map && onMapReady && !hasCalledMapReadyRef.current) {
      hasCalledMapReadyRef.current = true;
      onMapReady(map);
    }
  }, [isMapLoaded, map, onMapReady]);

  useEffect(() => {
    if (geocoder && onGeocoderReady) {
      onGeocoderReady(geocoder);
    }
  }, [geocoder, onGeocoderReady]);

  if (mapError) {
    return (
      <div className={`flex items-center justify-center h-full ${className || ''}`}>
        <div className="text-center">
          <p className="text-red-600 mb-2">Map Error</p>
          <p className="text-sm text-gray-600">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id={containerId}
      className={`w-full h-full ${className || ''}`}
      style={{ minHeight: '400px' }}
    />
  );
};

