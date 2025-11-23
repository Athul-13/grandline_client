/**
 * Mapbox Directions Service
 * Handles route calculation using Mapbox Directions API
 */

export interface RouteCoordinates {
  longitude: number;
  latitude: number;
}

export interface RouteResponse {
  distance: number; // in meters
  duration: number; // in seconds
  geometry: {
    type: 'LineString';
    coordinates: [number, number][]; // [longitude, latitude] pairs
  };
  legs?: Array<{
    distance: number; // in meters
    duration: number; // in seconds
  }>;
}

export interface CalculateRouteOptions {
  coordinates: RouteCoordinates[];
  profile?: 'driving' | 'walking' | 'cycling';
  alternatives?: boolean;
  geometries?: 'geojson' | 'polyline';
  overview?: 'full' | 'simplified' | 'false';
}

/**
 * Calculate route using Mapbox Directions API
 */
export const calculateRoute = async (
  coordinates: RouteCoordinates[],
  accessToken: string,
  options: Partial<CalculateRouteOptions> = {},
  signal?: AbortSignal
): Promise<RouteResponse> => {
  if (coordinates.length < 2) {
    throw new Error('At least 2 coordinates are required');
  }

  // Build coordinates string: "lng1,lat1;lng2,lat2;..."
  const coordinatesString = coordinates
    .map((coord) => `${coord.longitude},${coord.latitude}`)
    .join(';');

  // Default options
  const profile = options.profile || 'driving';
  const geometries = options.geometries || 'geojson';
  const overview = options.overview || 'full';

  // Build URL
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinatesString}?` +
    `access_token=${accessToken}&` +
    `geometries=${geometries}&` +
    `overview=${overview}&` +
    `steps=false&` +
    `alternatives=false`;

  try {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Route calculation failed: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    const geometry = route.geometry;

    return {
      distance: route.distance,
      duration: route.duration,
      geometry: {
        type: 'LineString',
        coordinates:
          geometry.type === 'LineString'
            ? geometry.coordinates
            : [], // Fallback - should not happen with GeoJSON format
      },
      legs: route.legs?.map((leg: { distance: number; duration: number }) => ({
        distance: leg.distance,
        duration: leg.duration,
      })),
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Route calculation was cancelled');
    }
    throw error;
  }
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in meters
 */
export const calculateDistance = (
  coord1: RouteCoordinates,
  coord2: RouteCoordinates
): number => {
  const R = 6371000; // Earth radius in meters
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.latitude * Math.PI) / 180) *
      Math.cos((coord2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Format distance for display
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
};

/**
 * Format duration for display
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

