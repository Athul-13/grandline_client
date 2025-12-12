import { Receipt } from 'lucide-react';
import { formatPrice } from '../../utils/quote_formatters';

interface IPricingBreakdown {
  baseFare?: number;
  distanceFare?: number;
  driverCharge?: number;
  fuelMaintenance?: number;
  nightCharge?: number;
  amenitiesTotal?: number;
  subtotal?: number;
  tax?: number;
  taxPercentageAtTime?: number;
  total?: number;
}

interface PricingDetailsSidebarProps {
  pricing?: IPricingBreakdown;
  quoteId: string;
}

export const PricingDetailsSidebar: React.FC<PricingDetailsSidebarProps> = ({ pricing, quoteId }) => {
  if (!pricing) {
    return null;
  }

  const pricingItems = [
    { label: 'Base Fare', value: pricing.baseFare },
    { label: 'Distance Fare', value: pricing.distanceFare },
    { label: 'Driver Charge', value: pricing.driverCharge },
    { label: 'Fuel & Maintenance', value: pricing.fuelMaintenance },
    { label: 'Night Charge', value: pricing.nightCharge },
    { label: 'Amenities', value: pricing.amenitiesTotal },
  ].filter((item) => item.value !== undefined && item.value !== null && item.value > 0);

  const hasSubtotal = pricing.subtotal !== undefined && pricing.subtotal !== null;
  const hasTax = pricing.tax !== undefined && pricing.tax !== null;

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] p-6 shadow-lg sticky top-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
          <Receipt className="w-5 h-5 text-[var(--color-primary)]" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Pricing Details</h2>
      </div>

      <div className="space-y-4 mb-6">
        <div className="text-xs text-[var(--color-text-secondary)] mb-2">Quote ID</div>
        <div className="text-sm font-mono text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] p-2 rounded border border-[var(--color-border)]">
          {quoteId}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {pricingItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-[var(--color-border)] last:border-0">
            <span className="text-sm text-[var(--color-text-secondary)]">{item.label}</span>
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              {formatPrice(item.value!)}
            </span>
          </div>
        ))}
      </div>

      {hasSubtotal && (
        <div className="flex justify-between items-center py-3 border-t border-[var(--color-border)] mb-2">
          <span className="text-base font-semibold text-[var(--color-text-primary)]">Subtotal</span>
          <span className="text-base font-semibold text-[var(--color-text-primary)]">
            {formatPrice(pricing.subtotal!)}
          </span>
        </div>
      )}

      {hasTax && (
        <div className="flex justify-between items-center py-2 mb-3">
          <div>
            <span className="text-sm font-medium text-[var(--color-text-primary)]">Tax</span>
            {pricing.taxPercentageAtTime && (
              <span className="text-xs text-[var(--color-text-secondary)] ml-2">
                ({pricing.taxPercentageAtTime}%)
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {formatPrice(pricing.tax!)}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t-2 border-[var(--color-primary)]">
        <span className="text-lg font-bold text-[var(--color-text-primary)]">Total</span>
        <span className="text-2xl font-bold text-[var(--color-primary)]">
          {formatPrice(pricing.total ?? 0)}
        </span>
      </div>
    </div>
  );
};
