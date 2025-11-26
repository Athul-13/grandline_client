import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../common/ui/button';
import { FormInput } from '../../common/forms/form_input';
import { ConfirmationModal } from '../../common/modals/confirmation_modal';
import { X } from 'lucide-react';
import { useVehicleTypeMutations } from '../../../hooks/fleet/use_vehicle_type_mutations';
import type { VehicleType } from '../../../types/fleet/vehicle_type';
import { vehicleTypeFormSchema, type VehicleTypeFormData } from '../../../types/fleet/vehicle_type_form';
import { cn } from '../../../utils/cn';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage } from '../../../utils/error_sanitizer';

interface VehicleTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  vehicleType?: VehicleType;
}

/**
 * Vehicle Type Form Modal
 * Handles both adding and editing vehicle types
 */
export const VehicleTypeFormModal: React.FC<VehicleTypeFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  vehicleType,
}) => {
  const { createVehicleType, updateVehicleType } = useVehicleTypeMutations();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<VehicleTypeFormData>({
    resolver: zodResolver(vehicleTypeFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'onChange',
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [showCloseWarning, setShowCloseWarning] = React.useState(false);

  const watchedName = watch('name');
  const watchedDescription = watch('description');

  // Initialize form when modal opens or vehicleType changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && vehicleType) {
        reset({
          name: vehicleType.name,
          description: vehicleType.description || '',
        });
      } else {
        reset({
          name: '',
          description: '',
        });
      }
      setHasUnsavedChanges(false);
    }
  }, [isOpen, mode, vehicleType, reset]);

  // Track unsaved changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && vehicleType) {
        const nameChanged = (watchedName?.trim() || '') !== (vehicleType.name.trim() || '');
        const descChanged = (watchedDescription?.trim() || '') !== (vehicleType.description?.trim() || '');
        setHasUnsavedChanges(nameChanged || descChanged);
      } else {
        setHasUnsavedChanges((watchedName?.trim() || '') !== '' || (watchedDescription?.trim() || '') !== '');
      }
    }
  }, [watchedName, watchedDescription, mode, vehicleType, isOpen]);


  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (hasUnsavedChanges) {
        setShowCloseWarning(true);
      } else {
        onClose();
      }
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowCloseWarning(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowCloseWarning(false);
    onClose();
  };

  const onSubmit = async (data: VehicleTypeFormData) => {
    const trimmedName = data.name.trim();
    const trimmedDescription = data.description?.trim() || '';

    try {
      if (mode === 'add') {
        await createVehicleType.mutateAsync({
          name: trimmedName,
          description: trimmedDescription,
        });
        toast.success('Category created successfully');
      } else {
        await updateVehicleType.mutateAsync({
          id: vehicleType!.vehicleTypeId,
          data: {
            name: trimmedName,
            description: trimmedDescription,
          },
        });
        toast.success('Category updated successfully');
      }
      
      onClose();
    } catch (error) {
      const errorMessage = sanitizeErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const isPending = createVehicleType.isPending || updateVehicleType.isPending;
  const isDisabled = isPending;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow-xl w-full max-w-md mx-4 p-6 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              {mode === 'add' ? 'Add Category' : 'Edit Category'}
            </h2>
            <button
              onClick={handleClose}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              disabled={isDisabled}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 mb-6">
              <FormInput
                label="Name"
                {...register('name')}
                error={errors.name?.message}
                disabled={isDisabled}
                placeholder="Enter category name"
                maxLength={100}
              />

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  disabled={isDisabled}
                  placeholder="Enter category description (optional)"
                  rows={4}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg',
                    'border',
                    'bg-[var(--color-bg-card)]',
                    'text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
                    'transition-colors',
                    errors.description
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-[var(--color-border)] focus:border-[var(--color-primary)]',
                    isDisabled && 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]'
                  )}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isDisabled}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isPending}
                disabled={isDisabled}
              >
                {mode === 'add' ? 'Create Category' : 'Update Category'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Close Warning Modal */}
      <ConfirmationModal
        isOpen={showCloseWarning}
        onClose={() => setShowCloseWarning(false)}
        onConfirm={handleConfirmClose}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to close?"
        cancelText="Continue Editing"
        confirmText="Discard Changes"
        variant="warning"
      />
    </>
  );
};

