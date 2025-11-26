import React, { useState, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../../common/ui/button';
import { ConfirmationModal } from '../../common/modals/confirmation_modal';
import { X } from 'lucide-react';
import { useVehicleMutations } from '../../../hooks/fleet/use_vehicle_mutations';
import { useAllVehicleTypes } from '../../../hooks/fleet/use_all_vehicle_types';
import { useAllAmenities } from '../../../hooks/fleet/use_all_amenities';
import { useVehicleImageUpload } from '../../../hooks/fleet/use_vehicle_image_upload';
import { useUnsavedChanges } from '../../../hooks/use_unsaved_changes';
import { vehicleService } from '../../../services/api/vehicle_service';
import { VehicleStatus } from '../../../types/fleet/vehicle';
import type { Vehicle } from '../../../types/fleet/vehicle';
import { vehicleFormSchema, type VehicleFormData } from '../../../types/fleet/vehicle_form';
import { formatPlateNumber, cleanPlateNumber } from '../../../utils/plate_number_formatter';
import { fleetQueryKeys } from '../../../utils/fleet_query_keys';
import { vehicleTypeService } from '../../../services/api/vehicle_type_service';
import { amenityService } from '../../../services/api/amenity_service';
import { VehicleFormFields } from './vehicle_form_fields';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage } from '../../../utils/error_sanitizer';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  vehicle?: Vehicle;
  onSuccess?: () => void;
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
  const queryClient = useQueryClient();
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

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesError, setImagesError] = useState('');

  const methods = useForm({
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

  const { handleSubmit, reset, watch, setValue } = methods;
  const watchedValues = watch();

  // Prefetch vehicle types and amenities when modal opens
  useEffect(() => {
    if (isOpen) {
      queryClient.prefetchQuery({
        queryKey: fleetQueryKeys.vehicleTypes.allList(),
        queryFn: async () => {
          const response = await vehicleTypeService.getVehicleTypes({ page: 1, limit: 1000 });
          return response.data;
        },
      });

      queryClient.prefetchQuery({
        queryKey: fleetQueryKeys.amenities.allList(),
        queryFn: async () => {
          const response = await amenityService.getAmenities({ page: 1, limit: 1000 });
          return response.data;
        },
      });
    }
  }, [isOpen, queryClient]);

  // Initialize form when modal opens or vehicle changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && vehicle) {
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
          status: (vehicle.status || VehicleStatus.AVAILABLE) as typeof VehicleStatus[keyof typeof VehicleStatus],
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
  const { hasUnsavedChanges, showCloseWarning, setShowCloseWarning } = useUnsavedChanges({
    watch: methods.watch,
    isOpen,
    mode,
    originalData: vehicle
      ? {
          vehicleTypeId: vehicle.vehicleTypeId || vehicle.vehicleType?.vehicleTypeId || '',
          vehicleModel: vehicle.vehicleModel || '',
          year: vehicle.year?.toString() || '',
          capacity: vehicle.capacity?.toString() || '',
          baseFare: vehicle.baseFare?.toString() || '',
          maintenance: vehicle.maintenance?.toString() || '',
          plateNumber: vehicle.plateNumber || '',
          fuelConsumption: vehicle.fuelConsumption?.toString() || '',
          status: (vehicle.status || VehicleStatus.AVAILABLE) as typeof VehicleStatus[keyof typeof VehicleStatus],
          amenityIds: vehicle.amenityIds || [],
          imageUrls: vehicle.imageUrls || [],
        }
      : undefined,
    getCurrentData: () => {
      const allImageUrls = [...existingImages, ...getSuccessfullyUploadedUrls()];
      return {
        ...watchedValues,
        plateNumber: cleanPlateNumber(watchedValues.plateNumber || ''),
        imageUrls: allImageUrls,
      };
    },
    hasChanges: (current, original) => {
      if (!original) return false;
      return (
        current.vehicleTypeId !== original.vehicleTypeId ||
        current.vehicleModel !== original.vehicleModel ||
        current.year !== original.year ||
        current.capacity !== original.capacity ||
        current.baseFare !== original.baseFare ||
        current.maintenance !== original.maintenance ||
        current.plateNumber !== original.plateNumber ||
        current.vehicleModel !== original.vehicleModel ||
        current.fuelConsumption !== original.fuelConsumption ||
        JSON.stringify((current.imageUrls || []).sort()) !== JSON.stringify((original.imageUrls || []).sort()) ||
        current.status !== original.status ||
        JSON.stringify((current.amenityIds || []).sort()) !== JSON.stringify((original.amenityIds || []).sort())
      );
    },
  });

  const validateImages = (): string => {
    const totalImages = existingImages.length + getSuccessfullyUploadedUrls().length;
    if (totalImages === 0) {
      return 'At least one image is required';
    }
    const hasUploading = uploadedImages.some((img) => img.status === 'uploading' || img.status === 'pending');
    if (hasUploading) {
      return 'Please wait for all images to finish uploading';
    }
    const hasErrors = uploadedImages.some((img) => img.status === 'error');
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast.error('Please select valid image files (JPG, PNG, or WebP)');
      return;
    }

    const currentCount = existingImages.length + uploadedImages.filter((img) => img.status !== 'error').length;
    if (currentCount + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    try {
      await handleAddImages(files);
      toast.success(`${files.length} image(s) added. Uploading...`);
    } catch (error) {
      const errorMessage = sanitizeErrorMessage(error);
      toast.error(errorMessage);
      setImagesError(errorMessage);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveExistingImage = async (url: string) => {
    try {
      await vehicleService.deleteImages({ urls: [url] });
      setExistingImages((prev) => prev.filter((img) => img !== url));
      toast.success('Image removed');
    } catch (error) {
      const errorMessage = sanitizeErrorMessage(error);
      toast.error(errorMessage);
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
    const imagesErr = validateImages();
    if (imagesErr) {
      setImagesError(imagesErr);
      return;
    }

    if (isUploadingImages) {
      toast.error('Please wait for all images to finish uploading');
      return;
    }

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
      const errorMessage = sanitizeErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const isPending = createVehicle.isPending || updateVehicle.isPending;
  const isDisabled = isPending || isLoadingVehicleTypes || isLoadingAmenities || isUploadingImages;

  const handleAmenityToggle = (amenityId: string) => {
    const currentAmenities = watchedValues.amenityIds || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter((id) => id !== amenityId)
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

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2 ps-1">
                <VehicleFormFields
                  vehicleTypes={vehicleTypes}
                  amenities={amenities}
                  isLoadingVehicleTypes={isLoadingVehicleTypes}
                  isLoadingAmenities={isLoadingAmenities}
                  existingImages={existingImages}
                  uploadedImages={uploadedImages}
                  isUploadingImages={isUploadingImages}
                  imagesError={imagesError}
                  disabled={isDisabled}
                  onPlateNumberChange={handlePlateNumberChange}
                  onFileSelect={handleFileSelect}
                  onRemoveExistingImage={handleRemoveExistingImage}
                  onRemoveUploadedImage={handleRemoveImage}
                  onRetryUpload={handleRetryUpload}
                  onAmenityToggle={handleAmenityToggle}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isDisabled}>
                  Cancel
                </Button>
                <Button type="submit" loading={isPending} disabled={isDisabled}>
                  {mode === 'add' ? 'Create Vehicle' : 'Update Vehicle'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

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
