import { CreditCard } from 'lucide-react';
import { formatPrice } from '../../utils/quote_formatters';

interface PaymentDetailsCardProps {
  quoteId: string;
  totalPrice: number;
}

export const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({ quoteId, totalPrice }) => {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
          <CreditCard className="w-6 h-6 text-[var(--color-primary)]" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Payment Details
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] truncate">
            Quote ID: {quoteId}
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-[var(--color-text-primary)]">
            Total Amount
          </span>
          <span className="text-3xl font-bold text-[var(--color-primary)]">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};
