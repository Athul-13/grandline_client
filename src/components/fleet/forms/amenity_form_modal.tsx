import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../common/ui/button';
import { FormInput } from '../../common/forms/form_input';
import { ConfirmationModal } from '../../common/modals/confirmation_modal';
import { X } from 'lucide-react';
import { useAmenityMutations } from '../../../hooks/fleet/use_amenity_mutations';
import type { Amenity } from '../../../types/fleet/amenity';
import { amenityFormSchema, type AmenityFormData } from '../../../types/fleet/amenity_form';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage } from '../../../utils/error_sanitizer';

interface AmenityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  amenity?: Amenity;
}

/**
 * Amenity Form Modal
 * Handles both adding and editing amenities
 */
export const AmenityFormModal: React.FC<AmenityFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  amenity,
}) => {
  const { createAmenity, updateAmenity } = useAmenityMutations();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AmenityFormData>({
    resolver: zodResolver(amenityFormSchema),
    defaultValues: {
      name: '',
      price: '',
    },
    mode: 'onChange',
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [showCloseWarning, setShowCloseWarning] = React.useState(false);

  const watchedName = watch('name');
  const watchedPrice = watch('price');

  // Initialize form when modal opens or amenity changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && amenity) {
        reset({
          name: amenity.name,
          price: amenity.price !== null && amenity.price !== undefined ? amenity.price.toString() : '',
        });
      } else {
        reset({
          name: '',
          price: '',
        });
      }
      setHasUnsavedChanges(false);
    }
  }, [isOpen, mode, amenity, reset]);

  // Track unsaved changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && amenity) {
        const nameChanged = (watchedName?.trim() || '') !== (amenity.name.trim() || '');
        const currentPrice = watchedPrice?.trim() === '' ? null : Number(watchedPrice);
        const priceChanged = currentPrice !== amenity.price;
        setHasUnsavedChanges(nameChanged || priceChanged);
      } else {
        setHasUnsavedChanges((watchedName?.trim() || '') !== '' || (watchedPrice?.trim() || '') !== '');
      }
    }
  }, [watchedName, watchedPrice, mode, amenity, isOpen]);

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

  const onSubmit = async (data: AmenityFormData) => {
    const trimmedName = data.name.trim();
    const priceValue = data.price === null || data.price === undefined || data.price === '' ? null : Number(data.price);

    try {
      if (mode === 'add') {
        await createAmenity.mutateAsync({
          name: trimmedName,
          price: priceValue,
        });
        toast.success('Amenity created successfully');
      } else {
        await updateAmenity.mutateAsync({
          id: amenity!.amenityId,
          data: {
            name: trimmedName,
            price: priceValue,
          },
        });
        toast.success('Amenity updated successfully');
      }
      
      onClose();
    } catch (error) {
      const errorMessage = sanitizeErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const isPending = createAmenity.isPending || updateAmenity.isPending;
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
              {mode === 'add' ? 'Add Amenity' : 'Edit Amenity'}
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
                placeholder="Enter amenity name"
                maxLength={100}
              />

              <FormInput
                label="Price (₹)"
                type="number"
                step="0.01"
                {...register('price')}
                error={errors.price?.message}
                disabled={isDisabled}
                placeholder="Enter price (optional)"
                min={0}
                max={10000}
              />
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
                {mode === 'add' ? 'Create Amenity' : 'Update Amenity'}
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

