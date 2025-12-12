import { cn } from '../../utils/cn';
import { ReservationStatusBadge } from './reservation_status_badge';
import { formatDate, getTripTypeLabel, formatPrice } from '../../utils/quote_formatters';
import type { ReservationListItem } from '../../types/reservations/reservation';

interface ReservationsTableRowProps {
  reservation: ReservationListItem;
  onRowClick?: () => void;
}

/**
 * Reservations Table Row Component
 * Displays a single reservation row in the desktop table view
 */
export const ReservationsTableRow: React.FC<ReservationsTableRowProps> = ({
  reservation,
  onRowClick,
}) => {
  return (
    <tr
      className={cn(
        'hover:bg-[var(--color-bg-secondary)] transition-colors',
        onRowClick && 'cursor-pointer'
      )}
      onClick={onRowClick}
    >
      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
        {reservation.tripName || 'Untitled Trip'}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
        {getTripTypeLabel(reservation.tripType)}
      </td>
      <td className="px-4 py-3">
        <ReservationStatusBadge status={reservation.status} />
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
        {formatDate(reservation.reservationDate)}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
        {reservation.originalPrice ? formatPrice(reservation.originalPrice) : '-'}
      </td>
      <td
        className="px-4 py-3 text-sm text-[var(--color-text-secondary)] max-w-[200px] truncate"
        title={reservation.startLocation || undefined}
      >
        {reservation.startLocation || '-'}
      </td>
      <td
        className="px-4 py-3 text-sm text-[var(--color-text-secondary)] max-w-[200px] truncate"
        title={reservation.endLocation || undefined}
      >
        {reservation.endLocation || '-'}
      </td>
    </tr>
  );
};

