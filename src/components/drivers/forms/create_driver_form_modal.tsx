import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../common/ui/button';
import { FormInput } from '../../common/forms/form_input';
import { PasswordInput } from '../../common/forms/password_input';
import { ConfirmationModal } from '../../common/modals/confirmation_modal';
import { X, Copy, Check } from 'lucide-react';
import { useCreateDriver } from '../../../hooks/drivers/use_create_driver';
import { createDriverFormSchema, type CreateDriverFormData } from '../../../types/drivers/driver_form';
import { cn } from '../../../utils/cn';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage } from '../../../utils/error_sanitizer';

interface CreateDriverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Create Driver Form Modal
 * Admin creates driver account with credentials
 */
export const CreateDriverFormModal: React.FC<CreateDriverFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createDriver, isLoading } = useCreateDriver();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [createdDriver, setCreatedDriver] = useState<{ email: string; password: string } | null>(null);
  const [passwordCopied, setPasswordCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateDriverFormData>({
    resolver: zodResolver(createDriverFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      licenseNumber: '',
      salary: 0,
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Track unsaved changes
  useEffect(() => {
    if (isOpen && !createdDriver) {
      const hasChanges = Object.values(watchedValues).some(
        (value) => value !== '' && value !== 0 && value !== undefined
      );
      setHasUnsavedChanges(hasChanges);
    }
  }, [watchedValues, isOpen, createdDriver]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        licenseNumber: '',
        salary: 0,
      });
      setHasUnsavedChanges(false);
      setCreatedDriver(null);
      setPasswordCopied(false);
    }
  }, [isOpen, reset]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (hasUnsavedChanges && !createdDriver) {
        setShowCloseWarning(true);
      } else {
        onClose();
      }
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges && !createdDriver) {
      setShowCloseWarning(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowCloseWarning(false);
    onClose();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setPasswordCopied(true);
      toast.success('Password copied to clipboard');
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch {
      toast.error('Failed to copy password');
    }
  };

  const onSubmit = async (data: CreateDriverFormData) => {
    try {
      const response = await createDriver({
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        phoneNumber: data.phoneNumber?.trim() || undefined,
        licenseNumber: data.licenseNumber.trim(),
        salary: data.salary,
      });

      setCreatedDriver({
        email: response.driver.email,
        password: response.password,
      });

      toast.success('Driver created successfully');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = sanitizeErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 border border-[var(--color-border)] max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              {createdDriver ? 'Driver Created Successfully' : 'Create New Driver'}
            </h2>
            <button
              onClick={handleClose}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {createdDriver ? (
            // Success view with credentials
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200 text-sm mb-4">
                  Driver account has been created successfully. Please provide these credentials to the driver.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-[var(--color-text-secondary)] block mb-1">
                      Email
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={createdDriver.email}
                        readOnly
                        className="flex-1 px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)]"
                      />
                      <button
                        onClick={() => copyToClipboard(createdDriver.email)}
                        className="p-2 hover:bg-[var(--color-bg-hover)] rounded-lg transition-colors"
                        title="Copy email"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[var(--color-text-secondary)] block mb-1">
                      Password
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={createdDriver.password}
                        readOnly
                        className="flex-1 px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(createdDriver.password)}
                        className={cn(
                          "p-2 hover:bg-[var(--color-bg-hover)] rounded-lg transition-colors",
                          passwordCopied && "text-green-600 dark:text-green-400"
                        )}
                        title="Copy password"
                      >
                        {passwordCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[var(--color-text-secondary)] mt-4">
                  Note: This password will not be shown again. Please save it securely.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  onClick={handleClose}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            // Form view
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Full Name"
                  {...register('fullName')}
                  error={errors.fullName?.message}
                  required
                />

                <FormInput
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  required
                />

                <PasswordInput
                  label="Password"
                  {...register('password')}
                  error={errors.password?.message}
                  required
                />

                <FormInput
                  label="Phone Number (Optional)"
                  type="tel"
                  {...register('phoneNumber')}
                  error={errors.phoneNumber?.message}
                  placeholder="10 digits"
                />

                <FormInput
                  label="License Number"
                  {...register('licenseNumber')}
                  error={errors.licenseNumber?.message}
                  required
                />

                <FormInput
                  label="Salary (Per Hour)"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('salary', { valueAsNumber: true })}
                  error={errors.salary?.message}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Driver'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Close Warning Modal */}
      <ConfirmationModal
        isOpen={showCloseWarning}
        onClose={() => setShowCloseWarning(false)}
        onConfirm={handleConfirmClose}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to close?"
        confirmText="Close"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
};

