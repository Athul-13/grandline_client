import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../common/button';
import { FormInput } from '../common/form_input';
import { ConfirmationModal } from '../common/confirmation_modal';
import { X, Trash2, Upload, Loader2 } from 'lucide-react';
import { useVehicleMutations } from '../../hooks/fleet/use_vehicle_mutations';
import { useAllVehicleTypes } from '../../hooks/fleet/use_all_vehicle_types';
import { useAllAmenities } from '../../hooks/fleet/use_all_amenities';
import { useVehicleImageUpload } from '../../hooks/fleet/use_vehicle_image_upload';
import { vehicleService } from '../../services/api/vehicle_service';
import { VehicleStatus } from '../../types/fleet/vehicle';
import type { Vehicle } from '../../types/fleet/vehicle';
import { vehicleFormSchema, type VehicleFormData } from '../../types/fleet/vehicle_form';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  vehicle?: Vehicle;
  onSuccess?: () => void; // Callback after successful creation/update
}

/**
 * Vehicle Form Modal
 * Handles both adding and editing vehicles
 */
export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  vehicle,
  onSuccess,
}) => {
  const { createVehicle, updateVehicle } = useVehicleMutations();
  const { data: vehicleTypes = [], isLoading: isLoadingVehicleTypes } = useAllVehicleTypes();
  const { data: amenities = [], isLoading: isLoadingAmenities } = useAllAmenities();
  const {
    images: uploadedImages,
    isUploading: isUploadingImages,
    addImages: handleAddImages,
    removeImage: handleRemoveImage,
    retryUpload: handleRetryUpload,
    clearAll: clearAllImages,
    getSuccessfullyUploadedUrls,
  } = useVehicleImageUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]); // Images from vehicle in edit mode
  const [imagesError, setImagesError] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vehicleTypeId: '',
      vehicleModel: '',
      year: '',
      capacity: '',
      baseFare: '',
      maintenance: '',
      plateNumber: '',
      fuelConsumption: '',
      status: VehicleStatus.AVAILABLE,
      amenityIds: [],
      imageUrls: [],
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Format plate number with spacing for display
  const formatPlateNumber = (value: string): string => {
    // Remove all spaces and dashes, convert to uppercase
    const cleaned = value.replace(/[\s-]/g, '').toUpperCase();
    
    // Add spacing: 2-3 letters, space, 1-2 digits, space, 2-3 letters, space, 3-4 digits
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 10)}`;
  };

  // Remove spaces from plate number for API
  const cleanPlateNumber = (value: string): string => {
    return value.replace(/[\s-]/g, '').toUpperCase();
  };

  // Initialize form when modal opens or vehicle changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && vehicle) {
        // Handle vehicleTypeId - check both vehicleTypeId and vehicleType.vehicleTypeId
        const vehicleTypeIdValue = vehicle.vehicleTypeId || vehicle.vehicleType?.vehicleTypeId || '';
        reset({
          vehicleTypeId: vehicleTypeIdValue,
          vehicleModel: vehicle.vehicleModel || '',
          year: vehicle.year?.toString() || '',
          capacity: vehicle.capacity?.toString() || '',
          baseFare: vehicle.baseFare?.toString() || '',
          maintenance: vehicle.maintenance?.toString() || '',
          plateNumber: formatPlateNumber(vehicle.plateNumber || ''),
          fuelConsumption: vehicle.fuelConsumption?.toString() || '',
          status: (vehicle.status || VehicleStatus.AVAILABLE) as VehicleStatus,
          amenityIds: vehicle.amenityIds && vehicle.amenityIds.length > 0 ? vehicle.amenityIds : [],
          imageUrls: vehicle.imageUrls && vehicle.imageUrls.length > 0 ? vehicle.imageUrls : [],
        });
        setExistingImages(vehicle.imageUrls && vehicle.imageUrls.length > 0 ? vehicle.imageUrls : []);
      } else {
        reset({
          vehicleTypeId: '',
          vehicleModel: '',
          year: '',
          capacity: '',
          baseFare: '',
          maintenance: '',
          plateNumber: '',
          fuelConsumption: '',
          status: VehicleStatus.AVAILABLE,
          amenityIds: [],
          imageUrls: [],
        });
        setExistingImages([]);
      }
      setImagesError('');
      setHasUnsavedChanges(false);
    }
  }, [isOpen, mode, vehicle, reset]);

  // Clear uploaded images when modal closes
  useEffect(() => {
    if (!isOpen) {
      clearAllImages().catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Sync form's imageUrls field with actual uploaded images
  useEffect(() => {
    if (isOpen) {
      const allImageUrls = [...existingImages, ...getSuccessfullyUploadedUrls()];
      setValue('imageUrls', allImageUrls, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingImages, uploadedImages, isOpen, setValue]);

  // Track unsaved changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && vehicle) {
        // Get the original vehicleTypeId from either vehicleTypeId or vehicleType.vehicleTypeId
        const originalVehicleTypeId = vehicle.vehicleTypeId || vehicle.vehicleType?.vehicleTypeId || '';
        const hasChanges =
          watchedValues.vehicleTypeId !== originalVehicleTypeId ||
          watchedValues.capacity !== (vehicle.capacity?.toString() || '') ||
          watchedValues.baseFare !== (vehicle.baseFare?.toString() || '') ||
          watchedValues.maintenance !== (vehicle.maintenance?.toString() || '') ||
          cleanPlateNumber(watchedValues.plateNumber || '') !== (vehicle.plateNumber || '') ||
          watchedValues.vehicleModel !== (vehicle.vehicleModel || '') ||
          watchedValues.year !== (vehicle.year?.toString() || '') ||
          watchedValues.fuelConsumption !== (vehicle.fuelConsumption?.toString() || '') ||
          JSON.stringify([...existingImages, ...getSuccessfullyUploadedUrls()].sort()) !== JSON.stringify((vehicle.imageUrls || []).sort()) ||
          watchedValues.status !== (vehicle.status || VehicleStatus.AVAILABLE) ||
          JSON.stringify((watchedValues.amenityIds || []).sort()) !== JSON.stringify((vehicle.amenityIds || []).sort());
        setHasUnsavedChanges(hasChanges);
      } else {
        const hasChanges =
          (watchedValues.vehicleTypeId?.trim() || '') !== '' ||
          (watchedValues.capacity?.trim() || '') !== '' ||
          (watchedValues.baseFare?.trim() || '') !== '' ||
          (watchedValues.maintenance?.trim() || '') !== '' ||
          (watchedValues.plateNumber?.trim() || '') !== '' ||
          (watchedValues.vehicleModel?.trim() || '') !== '' ||
          (watchedValues.year?.trim() || '') !== '' ||
          (watchedValues.fuelConsumption?.trim() || '') !== '' ||
          uploadedImages.length > 0 ||
          existingImages.length > 0 ||
          (watchedValues.amenityIds?.length || 0) > 0;
        setHasUnsavedChanges(hasChanges);
      }
    }
  }, [
    isOpen,
    mode,
    vehicle,
    watchedValues,
    uploadedImages,
    existingImages,
    getSuccessfullyUploadedUrls,
  ]);

  const validateImages = (): string => {
    const totalImages = existingImages.length + getSuccessfullyUploadedUrls().length;
    if (totalImages === 0) {
      return 'At least one image is required';
    }
    // Check if any images are still uploading
    const hasUploading = uploadedImages.some(img => img.status === 'uploading' || img.status === 'pending');
    if (hasUploading) {
      return 'Please wait for all images to finish uploading';
    }
    // Check if any images failed
    const hasErrors = uploadedImages.some(img => img.status === 'error');
    if (hasErrors) {
      return 'Some images failed to upload. Please retry or remove them';
    }
    return '';
  };

  const handlePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const value = e.target.value;
    const formatted = formatPlateNumber(value);
    onChange(formatted);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast.error('Please select valid image files (JPG, PNG, or WebP)');
      return;
    }

    // Validate file count
    const currentCount = existingImages.length + uploadedImages.filter(img => img.status !== 'error').length;
    if (currentCount + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    try {
      await handleAddImages(files);
      toast.success(`${files.length} image(s) added. Uploading...`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add images';
      toast.error(errorMessage);
      setImagesError(errorMessage);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveExistingImage = async (url: string) => {
    try {
      await vehicleService.deleteImages({ urls: [url] });
      setExistingImages(prev => prev.filter(img => img !== url));
      toast.success('Image removed');
    } catch {
      toast.error('Failed to remove image');
    }
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

  const handleClose = async () => {
    if (hasUnsavedChanges) {
      setShowCloseWarning(true);
    } else {
      await clearAllImages();
      onClose();
    }
  };

  const handleConfirmClose = async () => {
    setShowCloseWarning(false);
    await clearAllImages();
    onClose();
  };

  const onSubmit = async (data: VehicleFormData) => {
    // Validate images separately
    const imagesErr = validateImages();
    if (imagesErr) {
      setImagesError(imagesErr);
      return;
    }

    // Wait for all uploads to complete
    if (isUploadingImages) {
      toast.error('Please wait for all images to finish uploading');
      return;
    }

    // Prepare data - combine existing images and newly uploaded images
    const allImageUrls = [...existingImages, ...getSuccessfullyUploadedUrls()];
    const requestData = {
      vehicleTypeId: data.vehicleTypeId.trim(),
      capacity: Number(data.capacity),
      baseFare: Number(data.baseFare),
      maintenance: Number(data.maintenance),
      plateNumber: cleanPlateNumber(data.plateNumber),
      vehicleModel: data.vehicleModel.trim(),
      year: Number(data.year),
      fuelConsumption: Number(data.fuelConsumption),
      imageUrls: allImageUrls,
      status: data.status,
      amenityIds: data.amenityIds || [],
    };

    try {
      if (mode === 'add') {
        await createVehicle.mutateAsync(requestData);
        toast.success('Vehicle created successfully');
      } else {
        await updateVehicle.mutateAsync({
          id: vehicle!.vehicleId,
          data: requestData,
        });
        toast.success('Vehicle updated successfully');
      }

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${mode === 'add' ? 'create' : 'update'} vehicle`);
    }
  };

  const isPending = createVehicle.isPending || updateVehicle.isPending;
  const isDisabled = isPending || isLoadingVehicleTypes || isLoadingAmenities || isUploadingImages;
  
  const handleAmenityToggle = (amenityId: string) => {
    const currentAmenities = watchedValues.amenityIds || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    setValue('amenityIds', newAmenities, { shouldValidate: true });
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow-xl w-full max-w-2xl mx-4 my-8 p-6 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              {mode === 'add' ? 'Add Vehicle' : 'Edit Vehicle'}
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
            <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2 ps-1">
              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="vehicleTypeId"
                  control={control}
                  render={({ field }) => (
                    <>
                      <select
                        {...field}
                        disabled={isDisabled}
                        className={cn(
                          'w-full px-4 py-3 rounded-lg',
                          'border',
                          'bg-[var(--color-bg-card)]',
                          'text-[var(--color-text-primary)]',
                          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
                          'transition-colors',
                          errors.vehicleTypeId
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-[var(--color-border)] focus:border-[var(--color-primary)]',
                          isDisabled && 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]'
                        )}
                      >
                        <option value="">Select vehicle type</option>
                        {vehicleTypes.map((type) => (
                          <option key={type.vehicleTypeId} value={type.vehicleTypeId}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      {errors.vehicleTypeId && (
                        <p className="mt-1 text-sm text-red-500">{errors.vehicleTypeId.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Vehicle Model */}
              <FormInput
                label="Vehicle Model"
                {...register('vehicleModel')}
                error={errors.vehicleModel?.message}
                disabled={isDisabled}
                placeholder="e.g., Toyota Camry"
                maxLength={100}
              />

              {/* Year and Capacity Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Year"
                  type="number"
                  {...register('year')}
                  error={errors.year?.message}
                  disabled={isDisabled}
                  placeholder="e.g., 2023"
                  min={1900}
                  max={new Date().getFullYear()}
                />
                <FormInput
                  label="Capacity (Seats)"
                  type="number"
                  {...register('capacity')}
                  error={errors.capacity?.message}
                  disabled={isDisabled}
                  placeholder="e.g., 7"
                  min={5}
                  max={100}
                />
              </div>

              {/* Base Fare and Maintenance Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Base Fare (₹)"
                  type="number"
                  step="0.01"
                  {...register('baseFare')}
                  error={errors.baseFare?.message}
                  disabled={isDisabled}
                  placeholder="e.g., 150.00"
                  min={0}
                />
                <FormInput
                  label="Maintenance Cost (₹)"
                  type="number"
                  step="0.01"
                  {...register('maintenance')}
                  error={errors.maintenance?.message}
                  disabled={isDisabled}
                  placeholder="e.g., 500.00"
                  min={0}
                />
              </div>

              {/* Plate Number and Fuel Consumption Row */}
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="plateNumber"
                  control={control}
                  render={({ field }) => (
                    <FormInput
                      label="Plate Number"
                      value={field.value}
                      onChange={(e) => handlePlateNumberChange(e, field.onChange)}
                      error={errors.plateNumber?.message}
                      disabled={isDisabled}
                      placeholder="e.g., KL 07 CE 6987"
                      style={{ textTransform: 'uppercase' }}
                    />
                  )}
                />
                <FormInput
                  label="Fuel Consumption (L/100km)"
                  type="number"
                  step="0.1"
                  {...register('fuelConsumption')}
                  error={errors.fuelConsumption?.message}
                  disabled={isDisabled}
                  placeholder="e.g., 8.5"
                  min={0}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      disabled={isDisabled}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'border border-[var(--color-border)]',
                        'bg-[var(--color-bg-card)]',
                        'text-[var(--color-text-primary)]',
                        'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
                        'transition-colors',
                        isDisabled && 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]'
                      )}
                    >
                      <option value={VehicleStatus.AVAILABLE}>Available</option>
                      <option value={VehicleStatus.IN_SERVICE}>In Service</option>
                      <option value={VehicleStatus.MAINTENANCE}>Maintenance</option>
                      <option value={VehicleStatus.RETIRED}>Retired</option>
                    </select>
                  )}
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Amenities
                </label>
                {isLoadingAmenities ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-[var(--color-text-secondary)]">Loading amenities...</p>
                  </div>
                ) : amenities.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-[var(--color-text-secondary)]">No amenities available</p>
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto border border-[var(--color-border)] rounded-lg p-3 bg-[var(--color-bg-card)]">
                    <div className="space-y-2">
                      {amenities.map((amenity) => (
                        <label
                          key={amenity.amenityId}
                          className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-bg-hover)] p-2 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={(watchedValues.amenityIds || []).includes(amenity.amenityId)}
                            onChange={() => handleAmenityToggle(amenity.amenityId)}
                            disabled={isDisabled}
                            className={cn(
                              'w-4 h-4 rounded border-[var(--color-border)]',
                              'text-[var(--color-primary)] focus:ring-[var(--color-primary)]',
                              'disabled:opacity-50 disabled:cursor-not-allowed'
                            )}
                          />
                          <span className="text-sm text-[var(--color-text-primary)]">
                            {amenity.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Images <span className="text-red-500">*</span>
                  <span className="text-xs text-[var(--color-text-secondary)] ml-2">
                    (Max 5 images, {existingImages.length + uploadedImages.filter(img => img.status !== 'error').length}/5)
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Existing Images (Edit Mode) */}
                  {existingImages.map((url, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={url}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-[var(--color-border)]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(url)}
                        disabled={isDisabled}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Uploaded/Uploading Images */}
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="relative w-full h-32 rounded-lg border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-secondary)]">
                        {image.status === 'uploading' || image.status === 'pending' ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
                          </div>
                        ) : image.status === 'success' && image.url ? (
                          <>
                            <img
                              src={image.url}
                              alt="Uploaded"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(image.id)}
                              disabled={isDisabled}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                              title="Remove image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-red-50">
                            <p className="text-xs text-red-500 text-center mb-2">{image.error}</p>
                            <button
                              type="button"
                              onClick={() => handleRetryUpload(image.id)}
                              disabled={isDisabled}
                              className="text-xs text-[var(--color-primary)] hover:underline disabled:opacity-50"
                            >
                              Retry
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Upload Box - Show when there's space and not all images are uploading */}
                  {existingImages.length + uploadedImages.filter(img => img.status !== 'error').length < 5 && (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        onChange={handleFileSelect}
                        disabled={isDisabled || isUploadingImages}
                        className="hidden"
                        id="vehicle-image-upload"
                      />
                      <label
                        htmlFor="vehicle-image-upload"
                        className={cn(
                          'flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed',
                          'border-[var(--color-border)] bg-[var(--color-bg-secondary)]',
                          'hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-hover)]',
                          'cursor-pointer transition-colors',
                          'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                      >
                        <Upload className="w-6 h-6 text-[var(--color-text-secondary)] mb-1" />
                        <span className="text-xs text-[var(--color-text-secondary)] text-center px-2">
                          Add Image
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {imagesError && (
                  <p className="mt-2 text-sm text-red-500">{imagesError}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
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
                {mode === 'add' ? 'Create Vehicle' : 'Update Vehicle'}
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

