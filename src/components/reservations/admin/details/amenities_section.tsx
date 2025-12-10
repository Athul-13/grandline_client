import { FilterSection } from '../../../common/filters/filter_section';
import { useReservationAmenities } from '../../../../hooks/reservations/use_reservation_amenities';
import type { AdminReservationDetailsResponse } from '../../../../types/reservations/admin_reservation';

interface AmenitiesSectionProps {
  reservationDetails: AdminReservationDetailsResponse;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Amenities Section Component
 * Displays selected amenities
 */
export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({
  reservationDetails,
  isExpanded,
  onToggle,
}) => {
  const { amenities, isLoading } = useReservationAmenities(reservationDetails.selectedAmenities);

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
      ) : amenities && amenities.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity) => (
            <div
              key={amenity.amenityId}
              className="px-3 py-1.5 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-primary)]"
            >
              {amenity.icon && <span className="mr-2">{amenity.icon}</span>}
              {amenity.name}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">No amenities selected</p>
      )}
    </FilterSection>
  );
};

