import { ArrowLeft } from 'lucide-react';
import { ReservationStatusBadge } from './reservation_status_badge';
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
    <div className="flex-shrink-0 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
            title="Back to reservations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-base font-semibold text-[var(--color-text-primary)]">
              {reservationDetails.tripName || 'Reservation Details'}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <ReservationStatusBadge status={reservationDetails.status} />
        </div>
      </div>
    </div>
  );
};

