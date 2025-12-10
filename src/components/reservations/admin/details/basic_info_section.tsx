import { FilterSection } from '../../../common/filters/filter_section';
import { ReservationStatusBadge } from '../../reservation_status_badge';
import { formatDate, getTripTypeLabel } from '../../../../utils/quote_formatters';
import type { AdminReservationDetailsResponse } from '../../../../types/reservations/admin_reservation';

interface BasicInfoSectionProps {
  reservationDetails: AdminReservationDetailsResponse;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Basic Information Section Component
 * Displays basic reservation information
 */
export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  reservationDetails,
  isExpanded,
  onToggle,
}) => {
  return (
    <FilterSection
      title="Basic Information"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Reservation ID:</span>
          <span className="ml-2 text-[var(--color-text-primary)] font-mono">
            {reservationDetails.reservationId}
          </span>
        </div>
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Status:</span>
          <span className="ml-2">
            <ReservationStatusBadge status={reservationDetails.status} />
          </span>
        </div>
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Trip Type:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {getTripTypeLabel(reservationDetails.tripType)}
          </span>
        </div>
        {reservationDetails.tripName && (
          <div>
            <span className="font-medium text-[var(--color-text-secondary)]">Trip Name:</span>
            <span className="ml-2 text-[var(--color-text-primary)]">
              {reservationDetails.tripName}
            </span>
          </div>
        )}
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Reservation Date:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {formatDate(reservationDetails.reservationDate)}
          </span>
        </div>
      </div>
    </FilterSection>
  );
};

