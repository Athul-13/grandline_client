import { useEffect, useRef } from 'react';
import type MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import type { GeocodeResult } from '../../../services/api/mapbox_service';

interface LocationSearchProps {
  geocoder: MapboxGeocoder | null;
  onLocationSelect?: (result: GeocodeResult) => void;
  className?: string;
}

/**
 * Location Search Component
 * Wrapper for Mapbox Geocoder search input
 * Note: The geocoder is added to the map container, this component just handles events
 */
export const LocationSearch: React.FC<LocationSearchProps> = ({
  geocoder,
  onLocationSelect,
  className,
}) => {
  const geocoderRef = useRef<MapboxGeocoder | null>(null);

  useEffect(() => {
    if (!geocoder) return;

    geocoderRef.current = geocoder;

    const handleResult = (e: { result: GeocodeResult }) => {
      if (onLocationSelect) {
        onLocationSelect(e.result);
      }
    };

    geocoder.on('result', handleResult);

    return () => {
      if (geocoderRef.current) {
        geocoderRef.current.off('result', handleResult);
      }
    };
  }, [geocoder, onLocationSelect]);

  return (
    <div className={className}>
      {/* Geocoder input is rendered by MapboxGeocoder component */}
      {/* This div is just a placeholder for styling if needed */}
    </div>
  );
};

