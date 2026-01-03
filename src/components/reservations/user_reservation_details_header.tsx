import { ArrowLeft, MessageCircle } from 'lucide-react';
import { ReservationStatusBadge } from './reservation_status_badge';
import { Button } from '../common/ui/button';
import type { ReservationResponse } from '../../types/reservations/reservation';

interface UserReservationDetailsHeaderProps {
  reservationDetails: ReservationResponse;
  onBack: () => void;
  onChatWithAdmin: () => void;
  onChatWithDriver: () => void;
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
}) => {
  const chatEnabled = reservationDetails.chatEnabled ?? false;

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

