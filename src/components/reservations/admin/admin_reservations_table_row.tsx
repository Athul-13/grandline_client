import { Copy, Check } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { highlightSearchTerm } from '../../../utils/highlight_search';
import { formatDate, getTripTypeLabel } from '../../../utils/quote_formatters';
import { ReservationStatusBadge } from '../reservation_status_badge';
import type { AdminReservationListItem } from '../../../types/reservations/admin_reservation';

interface AdminReservationsTableRowProps {
  reservation: AdminReservationListItem;
  searchQuery: string;
  copiedReservationNumber: string | null;
  onCopyReservationNumber: (reservationNumber: string, e: React.MouseEvent) => void;
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
  copiedReservationNumber,
  onCopyReservationNumber,
  isSelected,
  onSelectChange,
  onRowClick,
}) => {
  return (
    <tr
      className={cn(
        'flex hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer relative',
        isSelected && 'bg-[var(--color-bg-secondary)]'
      )}
      onClick={onRowClick}
    >
      {/* Checkbox */}
      <td
        className="px-4 py-3 flex-[0_0_40px] flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
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

      {/* Reservation Number */}
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] font-mono flex-[0_0_12%] relative group min-w-0 overflow-hidden">
        <div className="flex items-center">
          <span>{highlightSearchTerm(reservation.reservationNumber || '-', searchQuery)}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopyReservationNumber(reservation.reservationNumber || '-', e);
            }}
            className={cn(
              'opacity-0 group-hover:opacity-100 transition-opacity',
              'p-1 rounded hover:bg-[var(--color-bg-secondary)]',
              'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
              'flex-shrink-0'
            )}
            title="Copy reservation Number"
          >
            {copiedReservationNumber === (reservation.reservationNumber || '-') ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </td>

      {/* Trip Name */}
      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] flex-1 min-w-0 overflow-hidden">
        {reservation.tripName ? highlightSearchTerm(reservation.tripName, searchQuery) : '-'}
      </td>

      {/* Trip Type */}
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_8%]">
        {getTripTypeLabel(reservation.tripType)}
      </td>

      {/* Status */}
      <td className="px-4 py-3 flex-[0_0_10%]">
        <ReservationStatusBadge status={reservation.status} />
      </td>

      {/* Trip Date */}
      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] flex-[0_0_12%]">
        {reservation.tripDate ? formatDate(reservation.tripDate) : formatDate(reservation.reservationDate)}
      </td>

      {/* User */}
      <td className="px-4 py-3 text-sm flex-[0_0_15%] min-w-0 overflow-hidden">
        <div className="flex flex-col">
          <span className="text-[var(--color-text-primary)] font-medium">
            {highlightSearchTerm(reservation.user.fullName, searchQuery)}
          </span>
          <span className="text-[var(--color-text-secondary)] text-xs mt-0.5 break-all">
            {highlightSearchTerm(reservation.user.email, searchQuery)}
          </span>
        </div>
      </td>

      {/* Locations */}
      <td className="px-4 py-3 text-sm flex-[0_0_18%] min-w-0 overflow-hidden">
        <div className="flex flex-col">
          {reservation.startLocation && (
            <span className="text-[var(--color-text-secondary)] text-xs truncate" title={reservation.startLocation}>
              {reservation.startLocation}
            </span>
          )}
          {reservation.endLocation && (
            <span className="text-[var(--color-text-secondary)] text-xs mt-0.5 truncate" title={reservation.endLocation}>
              → {reservation.endLocation}
            </span>
          )}
        </div>
      </td>

      {/* Created Date */}
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_12%]">
        {formatDate(reservation.createdAt)}
      </td>
    </tr>
  );
};

