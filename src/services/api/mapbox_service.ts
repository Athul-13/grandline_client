/**
 * Mapbox Service
 * Client-side Mapbox API integration for geocoding and route preview
 * Note: This is client-side only. Server-side route calculation is handled by backend.
 */

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

/**
 * Geocode result from Mapbox
 */
export interface GeocodeResult {
  placeName: string;
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
   * @param accessToken Mapbox access token
   * @param mapboxglNamespace Mapbox GL namespace (from mapbox-gl import)
   * @returns Geocoder instance
   */
  initializeGeocoder: (accessToken: string, mapboxglNamespace: unknown): MapboxGeocoder => {
    const geocoder = new MapboxGeocoder({
      accessToken,
      mapboxgl: mapboxglNamespace as never, // Type assertion needed for MapboxGeocoder typing
      placeholder: 'Search for a location...',
      countries: undefined,
      types: 'address,poi',
    });
    return geocoder;
  },

  /**
   * Format geocode result to location data
   * @param result Geocode result from Mapbox
   * @returns Formatted location data
   */
  formatGeocodeResult: (result: GeocodeResult) => {
    return {
      locationName: result.placeName,
      latitude: result.center[1],
      longitude: result.center[0],
    };
  },
};

