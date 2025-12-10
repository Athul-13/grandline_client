import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../common/ui/button';
import { ReservationStatusBadge } from '../reservation_status_badge';
import { formatDate } from '../../../utils/quote_formatters';
import type { AdminReservationDetailsResponse } from '../../../types/reservations/admin_reservation';

interface AdminReservationDetailsHeaderProps {
  reservationDetails: AdminReservationDetailsResponse;
  isUpdatingStatus: boolean;
  onBack: () => void;
  onStatusChange: (newStatus: string) => Promise<void>;
  availableStatuses: Array<{ value: string; label: string }>;
}

/**
 * Admin Reservation Details Header Component
 * Displays reservation header with actions
 */
export const AdminReservationDetailsHeader: React.FC<AdminReservationDetailsHeaderProps> = ({
  reservationDetails,
  isUpdatingStatus,
  onBack,
  onStatusChange,
  availableStatuses,
}) => {
  const handleStatusChange = async (newStatus: string) => {
    await onStatusChange(newStatus);
  };

  return (
    <div className="flex-shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors flex-shrink-0"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] truncate">
                {reservationDetails.tripName || 'Reservation Details'}
              </h2>
              <ReservationStatusBadge status={reservationDetails.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
              <span>ID: {reservationDetails.reservationId.slice(0, 8)}...</span>
              <span>•</span>
              <span>{formatDate(reservationDetails.reservationDate)}</span>
              {reservationDetails.user && (
                <>
                  <span>•</span>
                  <span>{reservationDetails.user.fullName}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Change Actions */}
        {availableStatuses.length > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {availableStatuses.map((status) => (
              <Button
                key={status.value}
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(status.value)}
                disabled={isUpdatingStatus}
                className="text-sm"
              >
                {isUpdatingStatus ? 'Updating...' : `Mark as ${status.label}`}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

