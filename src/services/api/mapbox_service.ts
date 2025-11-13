/**
 * Mapbox Service
 * Client-side Mapbox API integration for geocoding and route preview
 */

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

/**
 * Geocode result from Mapbox
 * Matches the structure returned by Mapbox Geocoder
 */
export interface GeocodeResult {
  place_name?: string;
  text?: string;
  center: [number, number]; // [longitude, latitude]
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  context?: Array<{
    id: string;
    text: string;
  }>;
}

/**
 * Mapbox Service
 * Provides client-side geocoding and route preview functionality
 */
export const mapboxService = {
  /**
   * Initialize geocoder
   */
  initializeGeocoder: (accessToken: string, mapboxglNamespace: unknown): MapboxGeocoder => {
    const geocoder = new MapboxGeocoder({
      accessToken,
      mapboxgl: mapboxglNamespace as never, // Type assertion needed for MapboxGeocoder typing
      placeholder: 'Search for a location...',
    });
    return geocoder;
  },

  /**
   * Format geocode result to location data
   */
  formatGeocodeResult: (result: GeocodeResult) => {
    return {
      locationName: result.place_name || result.text || 'Unknown Location',
      latitude: result.center[1],
      longitude: result.center[0],
    };
  },
};

