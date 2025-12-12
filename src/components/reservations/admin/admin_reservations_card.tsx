import { Copy, Check } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { highlightSearchTerm } from '../../../utils/highlight_search';
import { formatDate, formatPrice, getTripTypeLabel } from '../../../utils/quote_formatters';
import { ReservationStatusBadge } from '../reservation_status_badge';
import type { AdminReservationListItem } from '../../../types/reservations/admin_reservation';

interface AdminReservationsCardProps {
  reservation: AdminReservationListItem;
  searchQuery: string;
  copiedReservationId: string | null;
  onCopyReservationId: (reservationId: string, e: React.MouseEvent) => void;
  isSelected: boolean;
  onSelectChange: (isSelected: boolean) => void;
  onCardClick: () => void;
}

/**
 * Admin Reservations Card Component
 * Displays a single reservation card in the mobile view
 */
export const AdminReservationsCard: React.FC<AdminReservationsCardProps> = ({
  reservation,
  searchQuery,
  copiedReservationId,
  onCopyReservationId,
  isSelected,
  onSelectChange,
  onCardClick,
}) => {
  return (
    <div
      className={cn(
        "bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 cursor-pointer hover:bg-[var(--color-bg-secondary)] transition-colors relative",
        isSelected && "bg-[var(--color-bg-secondary)] border-[var(--color-primary)]"
      )}
      onClick={onCardClick}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelectChange(e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 cursor-pointer mt-1 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-[var(--color-text-primary)] truncate mb-1">
              {reservation.tripName ? highlightSearchTerm(reservation.tripName, searchQuery) : 'Untitled Trip'}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <ReservationStatusBadge status={reservation.status} />
              <span className="text-xs text-[var(--color-text-secondary)]">
                {getTripTypeLabel(reservation.tripType)}
              </span>
            </div>
            <div className="flex items-center">
              <p className="text-xs text-[var(--color-text-secondary)] font-mono">
                ID: {highlightSearchTerm(reservation.reservationId.slice(0, 8) + '...', searchQuery)}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyReservationId(reservation.reservationId, e);
                }}
                className={cn(
                  'p-1 rounded hover:bg-[var(--color-bg-secondary)]',
                  'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                  'transition-colors flex-shrink-0'
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
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-secondary)]">User:</span>
          <span className="text-[var(--color-text-primary)] font-medium">
            {highlightSearchTerm(reservation.user.fullName, searchQuery)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-secondary)]">Email:</span>
          <span className="text-[var(--color-text-primary)] truncate ml-2">
            {reservation.user.email}
          </span>
        </div>
        {reservation.startLocation && (
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-text-secondary)]">From:</span>
            <span className="text-[var(--color-text-primary)] truncate ml-2">
              {reservation.startLocation}
            </span>
          </div>
        )}
        {reservation.endLocation && (
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-text-secondary)]">To:</span>
            <span className="text-[var(--color-text-primary)] truncate ml-2">
              {reservation.endLocation}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-secondary)]">Date:</span>
          <span className="text-[var(--color-text-primary)]">
            {formatDate(reservation.reservationDate)}
          </span>
        </div>
        {reservation.originalPrice && (
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-text-secondary)]">Price:</span>
            <span className="text-[var(--color-text-primary)] font-medium">
              {formatPrice(reservation.originalPrice)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

