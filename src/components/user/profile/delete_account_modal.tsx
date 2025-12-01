import React, { useState } from 'react';
import { Button } from '../../../components/common/ui/button';
import { X, AlertTriangle, Lock } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Delete Account Modal Component
 * Requires password confirmation before deleting account
 */
export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || password.trim().length === 0) {
      setError('Password is required');
      return;
    }

    try {
      await onConfirm(password);
      // Reset form on success
      setPassword('');
      setError(null);
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Failed to delete account');
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setPassword('');
      setError(null);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-xl w-full max-w-md mx-4 p-6 border border-[var(--color-border)]">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
            Deactivate Account
          </h2>
          <button
            onClick={handleClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-[var(--color-text-primary)] mb-4">
            Are you sure you want to delete your account?
          </p>
          
          <div className="flex items-start gap-2 p-3 rounded-lg border bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 mb-4">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p>
                Your account will be deactivated and you will be logged out immediately.
              </p>
              <p className="font-medium">
                You can reactivate your account later by registering again with the same email address.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Enter your password to confirm</span>
                </div>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Enter your password"
                className={cn(
                  'w-full px-3 py-2 text-sm border rounded-lg bg-[var(--color-bg-card)] text-[var(--color-text-primary)]',
                  'focus:ring-2 focus:ring-red-500 focus:border-transparent',
                  error ? 'border-red-500' : 'border-[var(--color-border)]'
                )}
                disabled={isLoading}
                autoFocus
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
                disabled={isLoading || !password || password.trim().length === 0}
                className="bg-red-600 hover:bg-red-700"
              >
                Deactivate Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

