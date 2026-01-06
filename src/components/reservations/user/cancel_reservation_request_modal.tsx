import { X } from 'lucide-react';
import { Button } from '../../common/ui/button';

interface CancelReservationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

/**
 * Cancel Reservation Request Modal Component
 * Displays cancellation policy and allows user to request cancellation
 */
export const CancelReservationRequestModal: React.FC<CancelReservationRequestModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-xl w-full max-w-2xl flex flex-col border border-[var(--color-border)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            Request Cancellation
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-bg-hover)] rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-3">
                Cancellation Policy
              </h3>
              <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 space-y-3 text-sm text-[var(--color-text-secondary)]">
                <p>
                  Please review our cancellation policy before proceeding:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    Cancellations made at least 3 days before the trip date are eligible for a full refund.
                  </li>
                  <li>
                    Cancellations made between 1-3 days before the trip date may be eligible for a partial refund, subject to review.
                  </li>
                  <li>
                    Cancellations made less than 24 hours before the trip date are not eligible for a refund.
                  </li>
                  <li>
                    All cancellation requests are subject to administrative review and approval.
                  </li>
                  <li>
                    Refunds, if approved, will be processed within 5-7 business days to your original payment method.
                  </li>
                </ul>
                <p className="pt-2 text-[var(--color-text-primary)] font-medium">
                  By confirming, you acknowledge that you have read and understood the cancellation policy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--color-border)] flex justify-end gap-3 bg-[var(--color-bg-hover)]/30">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} loading={isLoading}>
            Confirm Cancellation Request
          </Button>
        </div>
      </div>
    </div>
  );
};

