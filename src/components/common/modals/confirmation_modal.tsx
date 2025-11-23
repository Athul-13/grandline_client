import React from 'react';
import { Button } from './button';
import { X, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  warning?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

/**
 * Generic Confirmation Modal Component
 * Reusable confirmation dialog for delete, unsaved changes, etc.
 * 
 * @example
 * <ConfirmationModal
 *   isOpen={showDeleteModal}
 *   onClose={() => setShowDeleteModal(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Category"
 *   message="Are you sure you want to delete this category?"
 *   warning="This category has 5 vehicles. Deleting it may affect those vehicles."
 *   variant="danger"
 * />
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  warning,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const variantStyles = {
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  const confirmButtonVariant = variant === 'danger' ? 'primary' : 'primary';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-xl w-full max-w-md mx-4 p-6 border border-[var(--color-border)]">
        <div className="flex items-start justify-between mb-4">
          <h2 className={cn('text-xl font-bold text-[var(--color-text-primary)]', variantStyles[variant])}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-[var(--color-text-primary)] mb-4">{message}</p>
          
          {warning && (
            <div className={cn(
              'flex items-start gap-2 p-3 rounded-lg border',
              variant === 'danger' && 'bg-red-50 border-red-200 text-red-800',
              variant === 'warning' && 'bg-yellow-50 border-yellow-200 text-yellow-800',
              variant === 'info' && 'bg-blue-50 border-blue-200 text-blue-800'
            )}>
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{warning}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmButtonVariant}
            onClick={onConfirm}
            loading={isLoading}
            disabled={isLoading}
            className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

