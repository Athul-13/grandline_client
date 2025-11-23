import { FilterSection } from '../../common/filters/filter_section';
import { formatPrice } from '../../../utils/quote_formatters';
import type { AdminQuoteDetails } from '../../../types/quotes/admin_quote';
import type { Amenity } from '../../../types/fleet/amenity';

interface AmenitiesSectionProps {
  quoteDetails: AdminQuoteDetails;
  amenities: Record<string, Amenity>;
  isLoading: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Amenities Section Component
 * Displays selected amenities
 */
export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  quoteDetails,
  amenities,
  isLoading,
  isExpanded,
  onToggle,
}) => {
  return (
    <FilterSection
      title="Selected Amenities"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      ) : quoteDetails.selectedAmenities && quoteDetails.selectedAmenities.length > 0 ? (
        <div className="space-y-3">
          {quoteDetails.selectedAmenities.map((amenityId) => {
            const amenity = amenities[amenityId];
            return (
              <div
                key={amenityId}
                className="p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      {amenity ? amenity.name : `Amenity ID: ${amenityId}`}
                    </p>
                    {amenity && amenity.price !== null && (
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                        Price: {formatPrice(amenity.price)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">No amenities selected</p>
      )}
    </FilterSection>
  );
};

