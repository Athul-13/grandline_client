import React, { useState, useEffect } from 'react';
import { Button } from '../common/button';
import { FormInput } from '../common/form_input';
import { ConfirmationModal } from '../common/confirmation_modal';
import { X } from 'lucide-react';
import { useAmenityMutations } from '../../hooks/fleet/use_amenity_mutations';
import type { Amenity } from '../../types/fleet/amenity';
import toast from 'react-hot-toast';

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
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

  // Initialize form when modal opens or amenity changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && amenity) {
        setName(amenity.name);
        setPrice(amenity.price !== null && amenity.price !== undefined ? amenity.price.toString() : '');
      } else {
        setName('');
        setPrice('');
      }
      setNameError('');
      setPriceError('');
      setHasUnsavedChanges(false);
    }
  }, [isOpen, mode, amenity]);

  // Track unsaved changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && amenity) {
        const nameChanged = name.trim() !== amenity.name.trim();
        const currentPrice = price.trim() === '' ? null : Number(price);
        const priceChanged = currentPrice !== amenity.price;
        setHasUnsavedChanges(nameChanged || priceChanged);
      } else {
        setHasUnsavedChanges(name.trim() !== '' || price.trim() !== '');
      }
    }
  }, [name, price, mode, amenity, isOpen]);

  const validateName = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Name is required';
    }
    if (trimmed.length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (trimmed.length > 100) {
      return 'Name must be at most 100 characters';
    }
    if (!trimmed.replace(/\s/g, '').length) {
      return 'Name must contain non-whitespace characters';
    }
    return '';
  };

  const validatePrice = (value: string): string => {
    const trimmed = value.trim();
    // Price is optional, so empty string is valid
    if (trimmed === '') {
      return '';
    }
    const num = Number(trimmed);
    if (isNaN(num)) {
      return 'Price must be a valid number';
    }
    if (num < 0) {
      return 'Price must be at least 0';
    }
    if (num > 10000) {
      return 'Price must be at most 10000';
    }
    return '';
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setNameError(validateName(value));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrice(value);
    setPriceError(validatePrice(value));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const nameErr = validateName(name);
    const priceErr = validatePrice(price);
    
    setNameError(nameErr);
    setPriceError(priceErr);

    if (nameErr || priceErr) {
      return;
    }

    const trimmedName = name.trim();
    const priceValue = price.trim() === '' ? null : Number(price);

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
      toast.error(error instanceof Error ? error.message : 'Failed to save amenity');
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

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              <FormInput
                label="Name"
                value={name}
                onChange={handleNameChange}
                error={nameError}
                disabled={isDisabled}
                placeholder="Enter amenity name"
                maxLength={100}
              />

              <FormInput
                label="Price (₹)"
                type="number"
                step="0.01"
                value={price}
                onChange={handlePriceChange}
                error={priceError}
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

