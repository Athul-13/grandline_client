import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../common/ui/button';

interface CancelReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: (reason: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Cancel Reservation Modal Component
 * Allows admin to cancel a reservation
 */
export const CancelReservationModal: React.FC<CancelReservationModalProps> = ({
  isOpen,
  onClose,
  onCancel,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      return;
    }

    await onCancel(reason.trim());
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-lg w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Cancel Reservation
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
        <form onSubmit={handleSubmit} className="p-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Cancellation Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for cancellation..."
              required
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
              rows={4}
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
            disabled={isLoading || !reason.trim()}
            variant="danger"
          >
            {isLoading ? 'Cancelling...' : 'Cancel Reservation'}
          </Button>
        </div>
      </div>
    </div>
  );
};

