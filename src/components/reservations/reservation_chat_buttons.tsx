import { MessageCircle } from 'lucide-react';
import type { ReservationResponse } from '../../types/reservations/reservation';

interface ReservationChatButtonsProps {
  reservationDetails: ReservationResponse;
  onChatWithAdmin: () => void;
  onChatWithDriver: () => void;
}

/**
 * Reservation Chat Buttons Component
 * Displays buttons for chatting with admin and driver
 */
export const ReservationChatButtons: React.FC<ReservationChatButtonsProps> = ({
  reservationDetails,
  onChatWithAdmin,
  onChatWithDriver,
}) => {
  // Check if chat with driver is enabled
  const chatEnabled = reservationDetails.chatEnabled ?? false;

  return (
    <div className="flex flex-col gap-3">
      {/* Chat with Admin - Always visible */}
      <button
        onClick={onChatWithAdmin}
        className="flex items-center gap-3 px-4 py-3 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-hover)] border border-[var(--color-border)] rounded-lg transition-colors text-left"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-[var(--color-primary)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">Chat with Admin</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Get support and ask questions
          </p>
        </div>
      </button>

      {/* Chat with Driver - Only if chatEnabled */}
      {chatEnabled && (
        <button
          onClick={onChatWithDriver}
          className="flex items-center gap-3 px-4 py-3 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-hover)] border border-[var(--color-border)] rounded-lg transition-colors text-left"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Chat with Driver</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Contact your assigned driver
            </p>
          </div>
        </button>
      )}
    </div>
  );
};

