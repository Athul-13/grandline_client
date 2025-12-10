import { ArrowLeft } from 'lucide-react';
import { ReservationStatusBadge } from './reservation_status_badge';
import { formatDate, getTripTypeLabel } from '../../utils/quote_formatters';
import type { ReservationResponse } from '../../types/reservations/reservation';

interface UserReservationDetailsHeaderProps {
  reservationDetails: ReservationResponse;
  onBack: () => void;
}

/**
 * User Reservation Details Header Component
 * Displays reservation header with trip name, status, and back button
 */
export const UserReservationDetailsHeader: React.FC<UserReservationDetailsHeaderProps> = ({
  reservationDetails,
  onBack,
}) => {
  return (
    <div className="flex-shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onBack}
            className="flex-shrink-0 p-2 hover:bg-[var(--color-bg-hover)] rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-[var(--color-text-primary)] truncate">
              {reservationDetails.tripName || 'Reservation Details'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-[var(--color-text-secondary)]">
                {getTripTypeLabel(reservationDetails.tripType)}
              </span>
              <span className="text-sm text-[var(--color-text-secondary)]">•</span>
              <span className="text-sm text-[var(--color-text-secondary)]">
                {formatDate(reservationDetails.reservationDate)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <ReservationStatusBadge status={reservationDetails.status} />
        </div>
      </div>
    </div>
  );
};

