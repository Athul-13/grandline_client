import { Copy, Check } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { highlightSearchTerm } from '../../../utils/highlight_search';
import { formatDate, formatPrice, getTripTypeLabel } from '../../../utils/quote_formatters';
import { ReservationStatusBadge } from '../reservation_status_badge';
import type { AdminReservationListItem } from '../../../types/reservations/admin_reservation';

interface AdminReservationsTableRowProps {
  reservation: AdminReservationListItem;
  searchQuery: string;
  copiedReservationId: string | null;
  onCopyReservationId: (reservationId: string, e: React.MouseEvent) => void;
  isSelected: boolean;
  onSelectChange: (isSelected: boolean) => void;
  onRowClick: () => void;
}

/**
 * Admin Reservations Table Row Component
 * Displays a single reservation row in the desktop table view
 */
export const AdminReservationsTableRow: React.FC<AdminReservationsTableRowProps> = ({
  reservation,
  searchQuery,
  copiedReservationId,
  onCopyReservationId,
  isSelected,
  onSelectChange,
  onRowClick,
}) => {
  return (
    <tr
      className={cn(
          'border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer',
          isSelected && 'bg-[var(--color-bg-secondary)]'
        )}
        onClick={onRowClick}
      >
        {/* Checkbox */}
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelectChange(e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 cursor-pointer"
          />
        </td>

        {/* Reservation ID */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-[var(--color-text-primary)]">
              {highlightSearchTerm(reservation.reservationId.slice(0, 8) + '...', searchQuery)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyReservationId(reservation.reservationId, e);
              }}
              className={cn(
                'p-1 rounded hover:bg-[var(--color-bg-hover)] transition-colors',
                'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              )}
              title="Copy reservation ID"
            >
              {copiedReservationId === reservation.reservationId ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </td>

        {/* User */}
        <td className="px-4 py-3">
          <div className="text-sm text-[var(--color-text-primary)]">
            <div className="font-medium">{highlightSearchTerm(reservation.user.fullName, searchQuery)}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">{reservation.user.email}</div>
          </div>
        </td>

        {/* Trip Name */}
        <td className="px-4 py-3">
          <div className="text-sm text-[var(--color-text-primary)]">
            {reservation.tripName ? highlightSearchTerm(reservation.tripName, searchQuery) : 'Untitled Trip'}
          </div>
        </td>

        {/* Trip Type */}
        <td className="px-4 py-3">
          <span className="text-sm text-[var(--color-text-secondary)]">
            {getTripTypeLabel(reservation.tripType)}
          </span>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <ReservationStatusBadge status={reservation.status} />
        </td>

        {/* Reservation Date */}
        <td className="px-4 py-3">
          <span className="text-sm text-[var(--color-text-primary)]">
            {formatDate(reservation.reservationDate)}
          </span>
        </td>

        {/* Locations */}
        <td className="px-4 py-3">
          <div className="text-sm text-[var(--color-text-primary)]">
            {reservation.startLocation && (
              <div className="truncate max-w-[150px]" title={reservation.startLocation}>
                {reservation.startLocation}
              </div>
            )}
            {reservation.endLocation && (
              <div className="text-xs text-[var(--color-text-secondary)] truncate max-w-[150px]" title={reservation.endLocation}>
                → {reservation.endLocation}
              </div>
            )}
          </div>
        </td>

        {/* Original Price */}
        <td className="px-4 py-3">
          <span className="text-sm text-[var(--color-text-primary)] font-medium">
            {formatPrice(reservation.originalPrice)}
          </span>
        </td>

        {/* Created At */}
        <td className="px-4 py-3">
          <span className="text-sm text-[var(--color-text-secondary)]">
            {formatDate(reservation.createdAt)}
          </span>
        </td>
      </tr>
  );
};

