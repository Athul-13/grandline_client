import { Sparkles } from 'lucide-react';
import { formatPrice } from '../../../../utils/quote_formatters';
import type { QuoteResponse } from '../../../../types/quotes/quote';
import type { Amenity } from '../../../../types/fleet/amenity';

interface AmenitiesBentoCardProps {
  quoteDetails: QuoteResponse;
  amenities: Record<string, Amenity>;
  isLoading: boolean;
}

/**
 * Amenities Bento Card Component
 * Displays selected amenities
 */
export const AmenitiesBentoCard: React.FC<AmenitiesBentoCardProps> = ({
  quoteDetails,
  amenities,
  isLoading,
}) => {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Amenities</h3>
      </div>
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
    </div>
  );
};

