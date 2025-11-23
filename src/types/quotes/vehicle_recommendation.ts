/**
 * Vehicle Recommendation Types
 * Types for vehicle recommendations and selection
 */

/**
 * Vehicle Recommendation Option
 */
export interface VehicleRecommendationOption {
  optionId: string;
  vehicles: RecommendationVehicle[];
  totalCapacity: number;
  estimatedPrice: number;
  isExactMatch: boolean;
}

/**
 * Recommendation Vehicle
 */
export interface RecommendationVehicle {
  vehicleId: string;
  vehicleTypeId: string;
  name: string;
  capacity: number;
  quantity: number;
}

/**
 * Available Vehicle (for custom selection)
 */
export interface AvailableVehicle {
  vehicleId: string;
  vehicleTypeId: string;
  name: string;
  capacity: number;
  baseFare: number;
  isAvailable: boolean;
  availableQuantity: number;
  includedAmenities: {
    amenityId: string;
    name: string;
  }[];
}

/**
 * Get Recommendations Request
 * POST /api/v1/quotes/recommendations
 */
export interface GetRecommendationsRequest {
  passengerCount: number;
  tripStartDate: string; // ISO date string
  tripEndDate: string; // ISO date string
  tripType: 'one_way' | 'two_way';
}

/**
 * Get Recommendations Response
 * POST /api/v1/quotes/recommendations
 */
export interface GetRecommendationsResponse {
  recommendations: VehicleRecommendationOption[];
  availableVehicles: AvailableVehicle[];
}

