/**
 * Itinerary Types
 * Types for itinerary stops and route calculations
 */

/**
 * Stop Type Constants
 */
export const StopType = {
  PICKUP: 'pickup',
  STOP: 'stop',
  DROPOFF: 'dropoff',
} as const;

/**
 * Stop Type
 */
export type StopTypeType = typeof StopType[keyof typeof StopType];

/**
 * Itinerary Stop DTO
 * Matches backend ItineraryStopDto
 */
export interface ItineraryStopDto {
  locationName: string;
  latitude: number;
  longitude: number;
  arrivalTime: string; // ISO date string
  departureTime?: string | null; // ISO date string (optional, for driver stay)
  isDriverStaying: boolean;
  stayingDuration?: number | null; // Duration in minutes (if driver staying)
  stopType: StopTypeType;
}

/**
 * Calculate Routes Request
 * POST /api/v1/quotes/:id/calculate-routes
 */
export interface CalculateRoutesRequest {
  itinerary: {
    outbound: ItineraryStopDto[];
    return?: ItineraryStopDto[];
  };
}

/**
 * Route Calculation Response
 * POST /api/v1/quotes/:id/calculate-routes
 */
export interface RouteCalculationResponse {
  outbound: RouteCalculationInfo;
  return?: RouteCalculationInfo;
}

/**
 * Route Calculation Info
 */
export interface RouteCalculationInfo {
  totalDistance: number; // km
  totalDuration: number; // hours
  routeGeometry: string; // GeoJSON string
  segments: RouteSegment[];
}

/**
 * Route Segment
 */
export interface RouteSegment {
  from: {
    latitude: number;
    longitude: number;
  };
  to: {
    latitude: number;
    longitude: number;
  };
  distance: number; // km
  duration: number; // hours
  hasNightTravel: boolean;
}

