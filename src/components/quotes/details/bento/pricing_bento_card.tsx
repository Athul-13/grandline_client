import { DollarSign } from 'lucide-react';
import { formatPrice } from '../../../../utils/quote_formatters';
import type { QuoteResponse } from '../../../../types/quotes/quote';
import { QuoteStatus } from '../../../../types/quotes/quote';

interface PricingBentoCardProps {
  quoteDetails: QuoteResponse;
}

/**
 * Pricing Bento Card Component
 * Displays pricing breakdown and configuration
 */
export const PricingBentoCard: React.FC<PricingBentoCardProps> = ({ quoteDetails }) => {

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Pricing Breakdown</h3>
      </div>
      {quoteDetails.pricing ? (
        <div className="space-y-4">
          {/* Pricing Configuration at Time */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Pricing Configuration (at time of quote)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-[var(--color-text-secondary)]">Fuel Price:</span>
                <span className="ml-2 text-[var(--color-text-primary)] font-medium block">
                  {formatPrice(quoteDetails.pricing.fuelPriceAtTime)}/L
                </span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Driver Rate:</span>
                <span className="ml-2 text-[var(--color-text-primary)] font-medium block">
                  {quoteDetails.pricing.actualDriverRate
                    ? formatPrice(quoteDetails.pricing.actualDriverRate)
                    : formatPrice(quoteDetails.pricing.averageDriverRateAtTime)}
                  /hr
                  {quoteDetails.pricing.actualDriverRate && (
                    <span className="ml-1 text-xs text-[var(--color-text-secondary)]">
                      (actual)
                    </span>
                  )}
                </span>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Tax Percentage:</span>
                <span className="ml-2 text-[var(--color-text-primary)] font-medium block">
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

          {/* Payment Status Messages */}
          {quoteDetails.status === QuoteStatus.PAID && (
            <div className="border-t border-[var(--color-border)] pt-4 mt-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                  Payment Completed
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Your quote has been paid and converted to a reservation.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">Pricing not calculated yet</p>
      )}
    </div>
  );
};

