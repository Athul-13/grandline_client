import { cn } from '../../utils/cn';
import { ReservationStatusBadge } from './reservation_status_badge';
import { formatDate, getTripTypeLabel, formatPrice } from '../../utils/quote_formatters';
import type { ReservationListItem } from '../../types/reservations/reservation';

interface ReservationsCardProps {
  reservation: ReservationListItem;
  onCardClick?: () => void;
}

/**
 * Reservations Card Component
 * Displays a single reservation card in the mobile view
 */
export const ReservationsCard: React.FC<ReservationsCardProps> = ({
  reservation,
  onCardClick,
}) => {
  return (
    <div
      className={cn(
        'bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-4 shadow-sm',
        onCardClick && 'cursor-pointer hover:border-[var(--color-border-hover)] transition-colors'
      )}
      onClick={onCardClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] truncate">
            {reservation.tripName || 'Untitled Trip'}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {getTripTypeLabel(reservation.tripType)}
          </p>
        </div>
        <ReservationStatusBadge status={reservation.status} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--color-text-secondary)]">Reservation Date:</span>
          <span className="text-[var(--color-text-primary)] font-medium">
            {formatDate(reservation.reservationDate)}
          </span>
        </div>
        {reservation.originalPrice && (
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Amount:</span>
            <span className="text-[var(--color-text-primary)] font-medium">
              {formatPrice(reservation.originalPrice)}
            </span>
          </div>
        )}
        {reservation.startLocation && (
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">From:</span>
            <span className="text-[var(--color-text-primary)] truncate ml-2 text-right">
              {reservation.startLocation}
            </span>
          </div>
        )}
        {reservation.endLocation && (
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">To:</span>
            <span className="text-[var(--color-text-primary)] truncate ml-2 text-right">
              {reservation.endLocation}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

