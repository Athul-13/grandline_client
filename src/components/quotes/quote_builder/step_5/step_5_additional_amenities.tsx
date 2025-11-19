import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../../components/common/button';
import { usePaidAmenities } from '../../../../hooks/quotes/use_paid_amenities';
import { useVehicleRecommendations } from '../../../../hooks/quotes/use_vehicle_recommendations';
import { Check } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import type { ItineraryStopDto } from '../../../../types/quotes/itinerary';
import type { TripTypeType, SelectedVehicle } from '../../../../types/quotes/quote';
import type { AvailableVehicle } from '../../../../types/quotes/vehicle_recommendation';

interface Step5AdditionalAmenitiesProps {
  passengerCount: number;
  itinerary: {
    outbound: ItineraryStopDto[];
    return?: ItineraryStopDto[];
  } | null;
  tripType: TripTypeType | null;
  selectedVehicles: SelectedVehicle[];
  selectedAmenities: string[];
  quoteId: string | null;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  onStepValidationChange?: (isValid: boolean) => void;
  onSelectedAmenitiesChange: (amenities: string[]) => void;
  onSubmitQuote: () => Promise<void>;
  isLoading?: boolean;
}

/**
 * Step 5: Additional Amenities
 * User selects additional paid amenities
 */
export const Step5AdditionalAmenities: React.FC<Step5AdditionalAmenitiesProps> = ({
  passengerCount,
  itinerary,
  tripType,
  selectedVehicles,
  selectedAmenities,
  quoteId,
  onNext,
  onPrevious,
  onStepValidationChange,
  onSelectedAmenitiesChange,
  onSubmitQuote,
  isLoading = false,
}) => {
  // Fetch paid amenities
  const { amenities: paidAmenities, isLoading: isLoadingAmenities, error: amenitiesError, refetch: refetchAmenities } = usePaidAmenities(true);

  // Fetch vehicle recommendations to get availableVehicles with includedAmenities
  const { recommendations } = useVehicleRecommendations({
    passengerCount,
    itinerary,
    tripType,
    enabled: true,
  });

  // Get included amenities from selected vehicles
  const includedAmenityIds = useMemo(() => {
    if (!recommendations || !recommendations.availableVehicles || selectedVehicles.length === 0) {
      return new Set<string>();
    }

    const includedIds = new Set<string>();

    // For each selected vehicle, find it in availableVehicles and get its includedAmenities
    selectedVehicles.forEach((selectedVehicle) => {
      const availableVehicle = recommendations.availableVehicles.find(
        (av) => av.vehicleId === selectedVehicle.vehicleId
      );

      if (availableVehicle && availableVehicle.includedAmenities) {
        availableVehicle.includedAmenities.forEach((amenity) => {
          includedIds.add(amenity.amenityId);
        });
      }
    });

    return includedIds;
  }, [recommendations, selectedVehicles]);

  // Filter out already included amenities
  const selectableAmenities = useMemo(() => {
    return paidAmenities.filter((amenity) => !includedAmenityIds.has(amenity.amenityId));
  }, [paidAmenities, includedAmenityIds]);

  // Handle amenity selection toggle
  const handleToggleAmenity = (amenityId: string) => {
    const newSelection = selectedAmenities.includes(amenityId)
      ? selectedAmenities.filter((id) => id !== amenityId)
      : [...selectedAmenities, amenityId];

    onSelectedAmenitiesChange(newSelection);
  };

  // Format price as currency in INR
  const formatPrice = (price: number | null): string => {
    if (price === null || price === 0) {
      return 'Free';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Step validation (always valid - amenities are optional)
  useEffect(() => {
    if (onStepValidationChange) {
      onStepValidationChange(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    // Save selected amenities before submitting
    // (They should already be saved via auto-save, but ensure they're saved)
    await onSubmitQuote();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-2">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
          Additional Amenities
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Select any additional amenities you'd like to add to your trip
        </p>
      </div>

      {/* Content Area - Flex grow to fill available space */}
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        {/* Amenities Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Available Amenities
            </h3>
            {selectedAmenities.length > 0 && (
              <span className="text-sm text-[var(--color-text-secondary)]">
                {selectedAmenities.length} selected
              </span>
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {isLoadingAmenities ? (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto mb-2"></div>
                <p>Loading amenities...</p>
              </div>
            ) : amenitiesError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-2">{amenitiesError}</p>
                <Button onClick={refetchAmenities} variant="outline" size="sm">
                  Retry
                </Button>
              </div>
            ) : selectableAmenities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
                {selectableAmenities.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity.amenityId);
                  return (
                    <div
                      key={amenity.amenityId}
                      className={cn(
                        'bg-[var(--color-bg-secondary)] rounded-lg p-4 border-2 transition-all cursor-pointer',
                        isSelected
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                          : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:shadow-md'
                      )}
                      onClick={() => handleToggleAmenity(amenity.amenityId)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-base font-semibold text-[var(--color-text-primary)]">
                              {amenity.name}
                            </h4>
                            {isSelected && (
                              <div className="flex-shrink-0">
                                <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {formatPrice(amenity.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                <p>No additional amenities available. All amenities are already included in your selected vehicles.</p>
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
          onClick={handleSubmit}
          disabled={isLoading || !quoteId}
          loading={isLoading}
          size="sm"
        >
          Complete Quote
        </Button>
      </div>
    </div>
  );
};

