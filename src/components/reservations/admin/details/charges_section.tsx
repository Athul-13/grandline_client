import { FilterSection } from '../../../common/filters/filter_section';
import { formatDate, formatPrice } from '../../../../utils/quote_formatters';
import type { AdminReservationDetailsResponse } from '../../../../types/reservations/admin_reservation';

interface ChargesSectionProps {
  reservationDetails: AdminReservationDetailsResponse;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Additional Charges Section Component
 * Displays additional charges for the reservation
 */
export const ChargesSection: React.FC<ChargesSectionProps> = ({
  reservationDetails,
  isExpanded,
  onToggle,
}) => {
  if (!reservationDetails.charges || reservationDetails.charges.length === 0) {
    return null;
  }

  return (
    <FilterSection
      title={`Additional Charges (${reservationDetails.charges.length})`}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-3">
        <div className="space-y-2">
          {reservationDetails.charges.map((charge) => (
            <div key={charge.chargeId} className="p-3 bg-[var(--color-bg-secondary)] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">{charge.description}</span>
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {formatPrice(charge.amount)} {charge.currency}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                <span className="capitalize">{charge.chargeType.replace('_', ' ')}</span>
                <span>{charge.isPaid ? 'Paid' : 'Unpaid'}</span>
                {charge.paidAt && <span>{formatDate(charge.paidAt)}</span>}
              </div>
            </div>
          ))}
        </div>
        {reservationDetails.totalCharges !== undefined && (
          <div className="pt-2 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">Total Charges</span>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {formatPrice(reservationDetails.totalCharges)}
              </span>
            </div>
            {reservationDetails.unpaidCharges !== undefined && reservationDetails.unpaidCharges > 0 && (
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-[var(--color-text-secondary)]">Unpaid</span>
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {formatPrice(reservationDetails.unpaidCharges)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </FilterSection>
  );
};

