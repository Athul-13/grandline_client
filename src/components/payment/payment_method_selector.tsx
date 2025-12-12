import { ChevronDown, ChevronUp } from 'lucide-react';

type PaymentMethod = 'stripe' | 'paypal' | null;

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  children?: React.ReactNode;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelect,
  children,
}) => {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
        Select Payment Method
      </h2>

      {/* Stripe Option */}
      <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
        <label
          className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
            selectedMethod === 'stripe'
              ? 'bg-[var(--color-primary)]/10 border-l-4 border-l-[var(--color-primary)]'
              : 'bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-hover)]'
          }`}
        >
          <div className="flex items-center gap-3 flex-1">
            <input
              type="radio"
              name="paymentMethod"
              value="stripe"
              checked={selectedMethod === 'stripe'}
              onChange={() => onSelect(selectedMethod === 'stripe' ? null : 'stripe')}
              className="w-5 h-5 text-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-2"
            />
            <div className="flex items-center gap-3 flex-1">
              <div>
                <div className="font-semibold text-[var(--color-text-primary)]">Stripe</div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  Credit & Debit Cards
                </div>
              </div>
            </div>
          </div>
          {selectedMethod === 'stripe' && (
            <ChevronUp className="w-5 h-5 text-[var(--color-text-secondary)]" />
          )}
          {selectedMethod !== 'stripe' && (
            <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
          )}
        </label>

        {/* Expanded Content for Stripe */}
        {selectedMethod === 'stripe' && (
          <div className="border-t border-[var(--color-border)] p-6 bg-[var(--color-bg-card)]">
            {children}
          </div>
        )}
      </div>

      {/* PayPal Option */}
      <div className="border border-[var(--color-border)] rounded-lg overflow-hidden opacity-50">
        <label className="flex items-center justify-between p-4 cursor-not-allowed bg-[var(--color-bg-card)]">
          <div className="flex items-center gap-3 flex-1">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              disabled
              className="w-5 h-5 text-[var(--color-primary)] opacity-50"
            />
            <div className="flex items-center gap-3 flex-1">
              <div>
                <div className="font-semibold text-[var(--color-text-primary)]">PayPal</div>
                <div className="text-sm text-[var(--color-text-secondary)]">Coming Soon</div>
              </div>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)] opacity-50" />
        </label>
      </div>
    </div>
  );
};
