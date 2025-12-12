import { Sparkles } from 'lucide-react';
import type { ReservationResponse } from '../../../types/reservations/reservation';

interface Amenity {
  amenityId: string;
  name: string;
  icon?: string;
}

interface AmenitiesBentoCardProps {
  reservationDetails: ReservationResponse;
  amenities: Amenity[];
  isLoading: boolean;
}

/**
 * Amenities Bento Card Component
 * Displays selected amenities for the reservation
 */
export const AmenitiesBentoCard: React.FC<AmenitiesBentoCardProps> = ({
  reservationDetails,
  amenities,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Amenities</h3>
        </div>
        <div className="text-sm text-[var(--color-text-secondary)]">Loading...</div>
      </div>
    );
  }

  if (!reservationDetails.selectedAmenities || reservationDetails.selectedAmenities.length === 0) {
    return (
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Amenities</h3>
        </div>
        <div className="text-sm text-[var(--color-text-secondary)]">No amenities selected</div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Amenities</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {reservationDetails.selectedAmenities.map((amenityId, index) => {
          const amenity = amenities.find((a) => a.amenityId === amenityId);
          return (
            <span
              key={amenityId || `amenity-${index}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)]"
            >
              {amenity?.name || amenityId}
            </span>
          );
        })}
      </div>
    </div>
  );
};

