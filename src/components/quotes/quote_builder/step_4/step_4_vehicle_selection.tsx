import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../../components/common/button';
import { useVehicleRecommendations } from '../../../../hooks/quotes/use_vehicle_recommendations';
import { VehicleCard } from './vehicle_card';
import { convertRecommendationToSelectedVehicles, findMatchingRecommendationOptionId } from '../../../../utils/vehicle_conversion';
import type { ItineraryStopDto } from '../../../../types/quotes/itinerary';
import type { TripTypeType, SelectedVehicle } from '../../../../types/quotes/quote';

interface Step4VehicleSelectionProps {
  passengerCount: number;
  itinerary: {
    outbound: ItineraryStopDto[];
    return?: ItineraryStopDto[];
  } | null;
  tripType: TripTypeType | null;
  selectedVehicles: SelectedVehicle[];
  isStep5Completed: boolean;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  onStepValidationChange?: (isValid: boolean) => void;
  onSelectedVehiclesChange: (vehicles: SelectedVehicle[]) => void;
  isLoading?: boolean;
}

/**
 * Step 4: Vehicle Selection
 * User selects vehicles from recommendations or custom selection
 */
export const Step4VehicleSelection: React.FC<Step4VehicleSelectionProps> = ({
  passengerCount,
  itinerary,
  tripType,
  selectedVehicles,
  isStep5Completed,
  onNext,
  onPrevious,
  onStepValidationChange,
  onSelectedVehiclesChange,
  isLoading = false,
}) => {
  // Fetch vehicle recommendations
  const { recommendations, isLoading: isLoadingRecommendations, error: recommendationsError, refetch } = useVehicleRecommendations({
    passengerCount,
    itinerary,
    tripType,
    enabled: true,
  });

  // Track selected recommendation (only one at a time)
  const [selectedRecommendationId, setSelectedRecommendationId] = useState<string | null>(null);
  const [showUnavailableMessage, setShowUnavailableMessage] = useState(false);

  // Check and pre-select recommendation when recommendations load
  useEffect(() => {
    if (
      recommendations &&
      recommendations.recommendations.length > 0 &&
      selectedVehicles.length > 0
    ) {
      const matchingOptionId = findMatchingRecommendationOptionId(
        selectedVehicles,
        recommendations.recommendations
      );

      if (matchingOptionId) {
        // Pre-select the matching recommendation
        setSelectedRecommendationId(matchingOptionId);
        setShowUnavailableMessage(false);
      } else {
        // Vehicle no longer available
        setSelectedRecommendationId(null);
        setShowUnavailableMessage(true);
        // Clear the selected vehicles from draft
        onSelectedVehiclesChange([]);
      }
    } else if (selectedVehicles.length === 0) {
      // No vehicles in draft, clear selection
      setSelectedRecommendationId(null);
      setShowUnavailableMessage(false);
    }
  }, [recommendations, selectedVehicles, onSelectedVehiclesChange]);

  // Handle recommendation selection (only one can be selected)
  const handleSelectRecommendation = (optionId: string) => {
    setSelectedRecommendationId(optionId);
    setShowUnavailableMessage(false);
  };

  // Handle recommendation deselection
  const handleDeselectRecommendation = () => {
    setSelectedRecommendationId(null);
  };

  // Step validation
  const isStepValid = useMemo(() => {
    // If Step 5 is completed, allow proceeding even without selection
    if (isStep5Completed) {
      return true;
    }
    // Otherwise, require selection
    return selectedRecommendationId !== null;
  }, [selectedRecommendationId, isStep5Completed]);

  // Update step validation when it changes
  useEffect(() => {
    if (onStepValidationChange) {
      onStepValidationChange(isStepValid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStepValid]);

  const handleNext = async () => {
    // Save selected vehicles before navigating
    if (selectedRecommendationId && recommendations) {
      const selectedRecommendation = recommendations.recommendations.find(
        (rec) => rec.optionId === selectedRecommendationId
      );

      if (selectedRecommendation) {
        const convertedVehicles = convertRecommendationToSelectedVehicles(selectedRecommendation);
        onSelectedVehiclesChange(convertedVehicles);
      }
    } else {
      // Clear selection if nothing selected
      onSelectedVehiclesChange([]);
    }

    await onNext();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-2">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
          Vehicle Selection
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Choose a vehicle recommendation for your trip
        </p>
      </div>

      {/* Warning Message - Vehicle Unavailable */}
      {showUnavailableMessage && (
        <div className="flex-shrink-0 mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Previously selected vehicle is no longer available. Please select a new vehicle.
          </p>
        </div>
      )}

      {/* Content Area - Flex grow to fill available space */}
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        {/* Recommended Vehicles Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Recommended Vehicles
            </h3>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {isLoadingRecommendations ? (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto mb-2"></div>
                <p>Loading vehicle recommendations...</p>
              </div>
            ) : recommendationsError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-2">{recommendationsError}</p>
                <Button onClick={refetch} variant="outline" size="sm">
                  Retry
                </Button>
              </div>
            ) : recommendations && recommendations.recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                {recommendations.recommendations.map((recommendation) => (
                  <VehicleCard
                    key={recommendation.optionId}
                    recommendation={recommendation}
                    isSelected={selectedRecommendationId === recommendation.optionId}
                    onSelect={() => handleSelectRecommendation(recommendation.optionId)}
                    onDeselect={handleDeselectRecommendation}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                <p>No recommendations available at this time.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Fixed at bottom */}
      <div className="flex-shrink-0 flex justify-end gap-3 pt-3 mt-3 border-t border-[var(--color-border)]">
        <Button
          onClick={onPrevious}
          variant="outline"
          disabled={isLoading}
          size="sm"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={isLoading || (!isStep5Completed && !isStepValid)}
          loading={isLoading}
          size="sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

