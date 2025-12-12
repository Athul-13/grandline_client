import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../common/ui/button';
import { FormInput } from '../../../common/forms/form_input';
import { formatPrice } from '../../../../utils/quote_formatters';

interface ProcessRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefund: (amount: number, reason?: string) => Promise<void>;
  isLoading?: boolean;
  maxRefundAmount: number;
  currency?: string;
}

/**
 * Process Refund Modal Component
 * Allows admin to process refunds for a reservation
 */
export const ProcessRefundModal: React.FC<ProcessRefundModalProps> = ({
  isOpen,
  onClose,
  onRefund,
  isLoading = false,
  maxRefundAmount,
  currency = 'INR',
}) => {
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const refundAmount = parseFloat(amount);
    
    if (isNaN(refundAmount) || refundAmount <= 0 || refundAmount > maxRefundAmount) {
      return;
    }

    await onRefund(refundAmount, reason.trim() || undefined);
    setAmount('');
    setReason('');
  };

  const handleClose = () => {
    setAmount('');
    setReason('');
    onClose();
  };

  const refundAmount = parseFloat(amount) || 0;
  const isValid = refundAmount > 0 && refundAmount <= maxRefundAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-lg w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Process Refund
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Refund Amount ({currency})
            </label>
            <FormInput
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Max: ${formatPrice(maxRefundAmount)}`}
              required
              min={0}
              max={maxRefundAmount}
              step="0.01"
            />
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Maximum refundable: {formatPrice(maxRefundAmount)} {currency}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for refund..."
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-border)]">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isValid}
            variant="primary"
          >
            {isLoading ? 'Processing...' : 'Process Refund'}
          </Button>
        </div>
      </div>
    </div>
  );
};

