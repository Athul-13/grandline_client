/**
 * Mapbox Geocoding Service
 * Direct API calls to Mapbox Geocoding API for autocomplete
 */

export interface GeocodeSuggestion {
  id: string;
  place_name: string;
  text: string;
  center: [number, number]; // [longitude, latitude]
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  place_type?: string[]; // e.g., ['poi'], ['address'], ['street'], ['place']
  context?: Array<{
    id: string;
    text: string;
  }>;
}

export interface GeocodeResponse {
  type: string;
  query: string[];
  features: GeocodeSuggestion[];
  attribution: string;
}

/**
 * Search for location suggestions using Mapbox Geocoding API
 */
export const searchLocations = async (
  query: string,
  accessToken: string,
  options: {
    proximity?: [number, number]; // [longitude, latitude]
    limit?: number;
  } = {}
): Promise<GeocodeSuggestion[]> => {
  if (!query || query.length < 4) {
    return [];
  }

  const { proximity, limit = 15 } = options;

  // Kerala bounding box (approximate): [minLon, minLat, maxLon, maxLat]
  // Kerala: 74.5°E to 77.5°E longitude, 8.0°N to 12.8°N latitude
  const keralaBbox = '74.5,8.0,77.5,12.8';

  // Build URL with parameters
  const baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
  const encodedQuery = encodeURIComponent(query);
  const params = new URLSearchParams({
    access_token: accessToken,
    types: 'poi,address,place', // Prioritize POIs, addresses, and places (exclude streets)
    bbox: keralaBbox, // Limit to Kerala region
    limit: limit.toString(),
    language: 'en',
  });

  if (proximity) {
    params.append('proximity', `${proximity[0]},${proximity[1]}`);
  }

  const url = `${baseUrl}/${encodedQuery}.json?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }

    const data: GeocodeResponse = await response.json();
    
    // Filter out streets and prioritize POIs, addresses, and places
    const filteredFeatures = (data.features || []).filter((feature) => {
      const placeTypes = feature.place_type || [];
      // Exclude streets, but include POIs, addresses, and places
      return (
        !placeTypes.includes('street') &&
        (placeTypes.includes('poi') ||
          placeTypes.includes('address') ||
          placeTypes.includes('place'))
      );
    });

    // Sort: POIs first, then addresses, then places
    filteredFeatures.sort((a, b) => {
      const aTypes = a.place_type || [];
      const bTypes = b.place_type || [];
      
      const aIsPOI = aTypes.includes('poi');
      const bIsPOI = bTypes.includes('poi');
      const aIsAddress = aTypes.includes('address');
      const bIsAddress = bTypes.includes('address');
      
      if (aIsPOI && !bIsPOI) return -1;
      if (!aIsPOI && bIsPOI) return 1;
      if (aIsAddress && !bIsAddress) return -1;
      if (!aIsAddress && bIsAddress) return 1;
      return 0;
    });

    // Return top results (limit to original limit)
    return filteredFeatures.slice(0, limit);
  } catch (error) {
    console.error('Error fetching geocoding suggestions:', error);
    return [];
  }
};

