import type { SelectedVehicle } from '../types/quotes/quote';
import type { VehicleRecommendationOption } from '../types/quotes/vehicle_recommendation';

/**
 * Convert VehicleRecommendationOption to SelectedVehicle[]
 */
export const convertRecommendationToSelectedVehicles = (
  recommendation: VehicleRecommendationOption
): SelectedVehicle[] => {
  return recommendation.vehicles.map((vehicle) => ({
    vehicleId: vehicle.vehicleId,
    quantity: vehicle.quantity,
  }));
};

/**
 * Find matching recommendation optionId by comparing vehicle composition
 * Returns the optionId if a match is found, null otherwise
 */
export const findMatchingRecommendationOptionId = (
  selectedVehicles: SelectedVehicle[],
  recommendations: VehicleRecommendationOption[]
): string | null => {
  if (selectedVehicles.length === 0 || recommendations.length === 0) {
    return null;
  }

  // Sort selected vehicles by vehicleId for consistent comparison
  const sortedSelected = [...selectedVehicles].sort((a, b) => 
    a.vehicleId.localeCompare(b.vehicleId)
  );

  // Check each recommendation option
  for (const recommendation of recommendations) {
    // Convert recommendation vehicles to SelectedVehicle format
    const recommendationVehicles: SelectedVehicle[] = recommendation.vehicles.map((v) => ({
      vehicleId: v.vehicleId,
      quantity: v.quantity,
    }));

    // Sort by vehicleId for consistent comparison
    const sortedRecommendation = [...recommendationVehicles].sort((a, b) =>
      a.vehicleId.localeCompare(b.vehicleId)
    );

    // Compare lengths first
    if (sortedSelected.length !== sortedRecommendation.length) {
      continue;
    }

    // Compare each vehicle ID and quantity
    let isMatch = true;
    for (let i = 0; i < sortedSelected.length; i++) {
      if (
        sortedSelected[i].vehicleId !== sortedRecommendation[i].vehicleId ||
        sortedSelected[i].quantity !== sortedRecommendation[i].quantity
      ) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      return recommendation.optionId;
    }
  }

  return null;
};

