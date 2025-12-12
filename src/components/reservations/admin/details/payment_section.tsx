import { FilterSection } from '../../../common/filters/filter_section';
import { formatDate, formatPrice } from '../../../../utils/quote_formatters';
import type { AdminReservationDetailsResponse } from '../../../../types/reservations/admin_reservation';

interface PaymentSectionProps {
  reservationDetails: AdminReservationDetailsResponse;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Payment Information Section Component
 * Displays payment and refund information
 */
export const PaymentSection: React.FC<PaymentSectionProps> = ({
  reservationDetails,
  isExpanded,
  onToggle,
}) => {
  return (
    <FilterSection
      title="Payment Information"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-3 text-sm">
        {reservationDetails.originalPricing && (
          <>
            <div>
              <span className="font-medium text-[var(--color-text-secondary)]">Original Amount:</span>
              <span className="ml-2 text-[var(--color-text-primary)] font-medium">
                {formatPrice(reservationDetails.originalPricing.total)}
              </span>
            </div>
            {reservationDetails.originalPricing.paidAt && (
              <div>
                <span className="font-medium text-[var(--color-text-secondary)]">Paid At:</span>
                <span className="ml-2 text-[var(--color-text-primary)]">
                  {formatDate(reservationDetails.originalPricing.paidAt)}
                </span>
              </div>
            )}
          </>
        )}
        {reservationDetails.refundStatus && reservationDetails.refundStatus !== 'none' && (
          <>
            <div>
              <span className="font-medium text-[var(--color-text-secondary)]">Refund Status:</span>
              <span className="ml-2 text-[var(--color-text-primary)] capitalize">
                {reservationDetails.refundStatus}
              </span>
            </div>
            {reservationDetails.refundedAmount && (
              <div>
                <span className="font-medium text-[var(--color-text-secondary)]">Refunded Amount:</span>
                <span className="ml-2 text-[var(--color-text-primary)] font-medium">
                  {formatPrice(reservationDetails.refundedAmount)}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </FilterSection>
  );
};

