import { ArrowLeft, MessageCircle, X } from 'lucide-react';
import { ReservationStatusBadge } from './reservation_status_badge';
import { Button } from '../common/ui/button';
import type { ReservationResponse } from '../../types/reservations/reservation';
import { canUserCancelReservation } from '../../utils/reservation_utils';

interface UserReservationDetailsHeaderProps {
  reservationDetails: ReservationResponse;
  onBack: () => void;
  onChatWithAdmin: () => void;
  onChatWithDriver: () => void;
  onCancelRequest?: () => void;
}

/**
 * User Reservation Details Header Component
 * Displays reservation header with trip name, status, back button, and chat buttons
 */
export const UserReservationDetailsHeader: React.FC<UserReservationDetailsHeaderProps> = ({
  reservationDetails,
  onBack,
  onChatWithAdmin,
  onChatWithDriver,
  onCancelRequest,
}) => {
  const chatEnabled = reservationDetails.chatEnabled ?? false;
  const canCancel = canUserCancelReservation(reservationDetails);

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
        <div className="flex items-center gap-2">
          {/* Cancel Button - Only if conditions are met */}
          {canCancel && onCancelRequest && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelRequest}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          )}

          {/* Chat with Admin Button - Always visible */}
          <Button
            variant="outline"
            size="sm"
            onClick={onChatWithAdmin}
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with Admin
          </Button>

          {/* Chat with Driver Button - Only if chatEnabled */}
          {chatEnabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={onChatWithDriver}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with Driver
            </Button>
          )}

          <ReservationStatusBadge status={reservationDetails.status} />
        </div>
      </div>
    </div>
  );
};

