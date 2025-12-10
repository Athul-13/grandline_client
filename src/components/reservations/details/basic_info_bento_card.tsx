import { Info } from 'lucide-react';
import { formatDateTime } from '../../../utils/quote_formatters';
import type { ReservationResponse } from '../../../types/reservations/reservation';

interface BasicInfoBentoCardProps {
  reservationDetails: ReservationResponse;
}

/**
 * Basic Info Bento Card Component
 * Displays basic reservation information in a bento card
 */
export const BasicInfoBentoCard: React.FC<BasicInfoBentoCardProps> = ({ reservationDetails }) => {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Basic Information</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Reservation ID:</span>
          <span className="ml-2 text-[var(--color-text-primary)] font-mono text-xs">
            {reservationDetails.reservationId}
          </span>
        </div>
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Trip Type:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {reservationDetails.tripType === 'one_way' ? 'One Way' : 'Two Way'}
          </span>
        </div>
        {reservationDetails.eventType && (
          <div>
            <span className="font-medium text-[var(--color-text-secondary)]">Event Type:</span>
            <span className="ml-2 text-[var(--color-text-primary)]">
              {reservationDetails.eventType}
            </span>
          </div>
        )}
        {reservationDetails.customEventType && (
          <div className="sm:col-span-2">
            <span className="font-medium text-[var(--color-text-secondary)]">Custom Event Type:</span>
            <span className="ml-2 text-[var(--color-text-primary)]">
              {reservationDetails.customEventType}
            </span>
          </div>
        )}
        {reservationDetails.passengerCount && (
          <div>
            <span className="font-medium text-[var(--color-text-secondary)]">Passenger Count:</span>
            <span className="ml-2 text-[var(--color-text-primary)] font-medium">
              {reservationDetails.passengerCount}
            </span>
          </div>
        )}
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Reservation Date:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {formatDateTime(reservationDetails.reservationDate)}
          </span>
        </div>
        {reservationDetails.confirmedAt && (
          <div>
            <span className="font-medium text-[var(--color-text-secondary)]">Confirmed:</span>
            <span className="ml-2 text-[var(--color-text-primary)]">
              {formatDateTime(reservationDetails.confirmedAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

