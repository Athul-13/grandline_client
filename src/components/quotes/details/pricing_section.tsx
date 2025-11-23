import { FilterSection } from '../../common/filters/filter_section';
import { formatPrice } from '../../../utils/quote_formatters';
import type { AdminQuoteDetails } from '../../../types/quotes/admin_quote';

interface PricingSectionProps {
  quoteDetails: AdminQuoteDetails;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Pricing Section Component
 * Displays pricing breakdown and configuration
 */
export const PricingSection: React.FC<PricingSectionProps> = ({
  quoteDetails,
  isExpanded,
  onToggle,
}) => {
  return (
    <FilterSection
      title="Pricing Breakdown"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {quoteDetails.pricing ? (
        <div className="space-y-4">
          {/* Pricing Configuration at Time */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Pricing Configuration (at time of quote)
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Fuel Price:</span>
                <span className="text-[var(--color-text-primary)] font-medium">
                  {formatPrice(quoteDetails.pricing.fuelPriceAtTime)}/L
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Driver Rate:</span>
                <span className="text-[var(--color-text-primary)] font-medium">
                  {formatPrice(quoteDetails.pricing.averageDriverRateAtTime)}/hr
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Tax Percentage:</span>
                <span className="text-[var(--color-text-primary)] font-medium">
                  {quoteDetails.pricing.taxPercentageAtTime.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-[var(--color-border)] pt-4">
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Cost Breakdown
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Base Fare:</span>
                <span className="text-[var(--color-text-primary)] font-medium">
                  {formatPrice(quoteDetails.pricing.baseFare)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Distance Fare:</span>
                <span className="text-[var(--color-text-primary)] font-medium">
                  {formatPrice(quoteDetails.pricing.distanceFare)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Driver Charge:</span>
                <span className="text-[var(--color-text-primary)] font-medium">
                  {formatPrice(quoteDetails.pricing.driverCharge)}
                </span>
              </div>
              {quoteDetails.pricing.fuelMaintenance > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Fuel & Maintenance:</span>
                  <span className="text-[var(--color-text-primary)] font-medium">
                    {formatPrice(quoteDetails.pricing.fuelMaintenance)}
                  </span>
                </div>
              )}
              {quoteDetails.pricing.nightCharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Night Charge:</span>
                  <span className="text-[var(--color-text-primary)] font-medium">
                    {formatPrice(quoteDetails.pricing.nightCharge)}
                  </span>
                </div>
              )}
              {quoteDetails.pricing.amenitiesTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Amenities:</span>
                  <span className="text-[var(--color-text-primary)] font-medium">
                    {formatPrice(quoteDetails.pricing.amenitiesTotal)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-[var(--color-border)] pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Subtotal:</span>
                <span className="text-[var(--color-text-primary)] font-medium">
                  {formatPrice(quoteDetails.pricing.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Tax ({quoteDetails.pricing.taxPercentageAtTime.toFixed(2)}%):</span>
                <span className="text-[var(--color-text-primary)] font-medium">
                  {formatPrice(quoteDetails.pricing.tax)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[var(--color-border)]">
                <span className="text-base font-semibold text-[var(--color-text-primary)]">Total:</span>
                <span className="text-base font-bold text-[var(--color-primary)]">
                  {formatPrice(quoteDetails.pricing.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">Pricing not calculated yet</p>
      )}
    </FilterSection>
  );
};

