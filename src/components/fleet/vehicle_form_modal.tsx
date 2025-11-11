import React, { useState, useEffect, useRef } from 'react';
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

  // Form state
  const [vehicleTypeId, setVehicleTypeId] = useState('');
  const [capacity, setCapacity] = useState('');
  const [baseFare, setBaseFare] = useState('');
  const [maintenance, setMaintenance] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [year, setYear] = useState('');
  const [fuelConsumption, setFuelConsumption] = useState('');
  const [status, setStatus] = useState<string>(VehicleStatus.AVAILABLE);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Error states
  const [vehicleTypeIdError, setVehicleTypeIdError] = useState('');
  const [capacityError, setCapacityError] = useState('');
  const [baseFareError, setBaseFareError] = useState('');
  const [maintenanceError, setMaintenanceError] = useState('');
  const [plateNumberError, setPlateNumberError] = useState('');
  const [vehicleModelError, setVehicleModelError] = useState('');
  const [yearError, setYearError] = useState('');
  const [fuelConsumptionError, setFuelConsumptionError] = useState('');
  const [imagesError, setImagesError] = useState('');

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

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
        setVehicleTypeId(vehicleTypeIdValue);
        setCapacity(vehicle.capacity?.toString() || '');
        setBaseFare(vehicle.baseFare?.toString() || '');
        setMaintenance(vehicle.maintenance?.toString() || '');
        setPlateNumber(formatPlateNumber(vehicle.plateNumber || ''));
        setVehicleModel(vehicle.vehicleModel || '');
        setYear(vehicle.year?.toString() || '');
        setFuelConsumption(vehicle.fuelConsumption?.toString() || '');
        setExistingImages(vehicle.imageUrls && vehicle.imageUrls.length > 0 ? vehicle.imageUrls : []);
        setStatus(vehicle.status || VehicleStatus.AVAILABLE);
        setSelectedAmenities(vehicle.amenityIds && vehicle.amenityIds.length > 0 ? vehicle.amenityIds : []);
      } else {
        setVehicleTypeId('');
        setCapacity('');
        setBaseFare('');
        setMaintenance('');
        setPlateNumber('');
        setVehicleModel('');
        setYear('');
        setFuelConsumption('');
        setExistingImages([]);
        setStatus(VehicleStatus.AVAILABLE);
        setSelectedAmenities([]);
      }
      // Clear all errors
      setVehicleTypeIdError('');
      setCapacityError('');
      setBaseFareError('');
      setMaintenanceError('');
      setPlateNumberError('');
      setVehicleModelError('');
      setYearError('');
      setFuelConsumptionError('');
      setImagesError('');
      setHasUnsavedChanges(false);
    }
  }, [isOpen, mode, vehicle]);

  // Clear uploaded images when modal closes
  useEffect(() => {
    if (!isOpen) {
      clearAllImages().catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Track unsaved changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && vehicle) {
        // Get the original vehicleTypeId from either vehicleTypeId or vehicleType.vehicleTypeId
        const originalVehicleTypeId = vehicle.vehicleTypeId || vehicle.vehicleType?.vehicleTypeId || '';
        const hasChanges =
          vehicleTypeId !== originalVehicleTypeId ||
          capacity !== (vehicle.capacity?.toString() || '') ||
          baseFare !== (vehicle.baseFare?.toString() || '') ||
          maintenance !== (vehicle.maintenance?.toString() || '') ||
          cleanPlateNumber(plateNumber) !== (vehicle.plateNumber || '') ||
          vehicleModel !== (vehicle.vehicleModel || '') ||
          year !== (vehicle.year?.toString() || '') ||
          fuelConsumption !== (vehicle.fuelConsumption?.toString() || '') ||
          JSON.stringify([...existingImages, ...getSuccessfullyUploadedUrls()].sort()) !== JSON.stringify((vehicle.imageUrls || []).sort()) ||
          status !== (vehicle.status || VehicleStatus.AVAILABLE) ||
          JSON.stringify(selectedAmenities.sort()) !== JSON.stringify((vehicle.amenityIds || []).sort());
        setHasUnsavedChanges(hasChanges);
      } else {
        const hasChanges =
          vehicleTypeId.trim() !== '' ||
          capacity.trim() !== '' ||
          baseFare.trim() !== '' ||
          maintenance.trim() !== '' ||
          plateNumber.trim() !== '' ||
          vehicleModel.trim() !== '' ||
          year.trim() !== '' ||
          fuelConsumption.trim() !== '' ||
          uploadedImages.length > 0 ||
          existingImages.length > 0 ||
          selectedAmenities.length > 0;
        setHasUnsavedChanges(hasChanges);
      }
    }
  }, [
    isOpen,
    mode,
    vehicle,
    vehicleTypeId,
    capacity,
    baseFare,
    maintenance,
    plateNumber,
    vehicleModel,
    year,
    fuelConsumption,
    uploadedImages,
    existingImages,
    status,
    selectedAmenities,
    getSuccessfullyUploadedUrls,
  ]);

  // Validation functions
  const validateVehicleTypeId = (value: string): string => {
    if (!value.trim()) {
      return 'Vehicle type is required';
    }
    return '';
  };

  const validateCapacity = (value: string): string => {
    const num = Number(value);
    if (!value.trim()) {
      return 'Capacity is required';
    }
    if (isNaN(num) || num < 5) {
      return 'Capacity must be at least 5';
    }
    if (num > 100) {
      return 'Capacity must be at most 100';
    }
    if (!Number.isInteger(num)) {
      return 'Capacity must be a whole number';
    }
    return '';
  };

  const validateBaseFare = (value: string): string => {
    const num = Number(value);
    if (!value.trim()) {
      return 'Base fare is required';
    }
    if (isNaN(num) || num < 0) {
      return 'Base fare must be a positive number';
    }
    return '';
  };

  const validateMaintenance = (value: string): string => {
    const num = Number(value);
    if (!value.trim()) {
      return 'Maintenance cost is required';
    }
    if (isNaN(num) || num < 0) {
      return 'Maintenance cost must be a positive number';
    }
    return '';
  };

  const validatePlateNumber = (value: string): string => {
    const cleaned = cleanPlateNumber(value);
    if (!cleaned.trim()) {
      return 'Plate number is required';
    }
    // Pattern: 2-3 letters, 1-2 digits, 2-3 letters, 3-4 digits
    const pattern = /^[A-Z]{2,3}\d{1,2}[A-Z]{2,3}\d{3,4}$/;
    if (!pattern.test(cleaned)) {
      return 'Invalid plate number format (e.g., KL07CE6987)';
    }
    return '';
  };

  const validateVehicleModel = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Vehicle model is required';
    }
    if (trimmed.length < 2) {
      return 'Vehicle model must be at least 2 characters';
    }
    if (trimmed.length > 100) {
      return 'Vehicle model must be at most 100 characters';
    }
    return '';
  };

  const validateYear = (value: string): string => {
    const num = Number(value);
    const currentYear = new Date().getFullYear();
    if (!value.trim()) {
      return 'Year is required';
    }
    if (isNaN(num) || !Number.isInteger(num)) {
      return 'Year must be a valid number';
    }
    if (num < 1900) {
      return 'Year must be at least 1900';
    }
    if (num > currentYear) {
      return `Year must be at most ${currentYear}`;
    }
    return '';
  };

  const validateFuelConsumption = (value: string): string => {
    const num = Number(value);
    if (!value.trim()) {
      return 'Fuel consumption is required';
    }
    if (isNaN(num) || num < 0) {
      return 'Fuel consumption must be a positive number';
    }
    return '';
  };

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

  const handlePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPlateNumber(value);
    setPlateNumber(formatted);
    setPlateNumberError(validatePlateNumber(formatted));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const vehicleTypeIdErr = validateVehicleTypeId(vehicleTypeId);
    const capacityErr = validateCapacity(capacity);
    const baseFareErr = validateBaseFare(baseFare);
    const maintenanceErr = validateMaintenance(maintenance);
    const plateNumberErr = validatePlateNumber(plateNumber);
    const vehicleModelErr = validateVehicleModel(vehicleModel);
    const yearErr = validateYear(year);
    const fuelConsumptionErr = validateFuelConsumption(fuelConsumption);
    const imagesErr = validateImages();

    setVehicleTypeIdError(vehicleTypeIdErr);
    setCapacityError(capacityErr);
    setBaseFareError(baseFareErr);
    setMaintenanceError(maintenanceErr);
    setPlateNumberError(plateNumberErr);
    setVehicleModelError(vehicleModelErr);
    setYearError(yearErr);
    setFuelConsumptionError(fuelConsumptionErr);
    setImagesError(imagesErr);

    if (
      vehicleTypeIdErr ||
      capacityErr ||
      baseFareErr ||
      maintenanceErr ||
      plateNumberErr ||
      vehicleModelErr ||
      yearErr ||
      fuelConsumptionErr ||
      imagesErr
    ) {
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
      vehicleTypeId: vehicleTypeId.trim(),
      capacity: Number(capacity),
      baseFare: Number(baseFare),
      maintenance: Number(maintenance),
      plateNumber: cleanPlateNumber(plateNumber),
      vehicleModel: vehicleModel.trim(),
      year: Number(year),
      fuelConsumption: Number(fuelConsumption),
      imageUrls: allImageUrls,
      status: status,
      amenityIds: selectedAmenities,
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
    setSelectedAmenities(prev => 
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
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

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2 ps-1">
              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={vehicleTypeId}
                  onChange={(e) => {
                    setVehicleTypeId(e.target.value);
                    setVehicleTypeIdError(validateVehicleTypeId(e.target.value));
                  }}
                  disabled={isDisabled}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg',
                    'border',
                    'bg-[var(--color-bg-card)]',
                    'text-[var(--color-text-primary)]',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
                    'transition-colors',
                    vehicleTypeIdError
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
                {vehicleTypeIdError && (
                  <p className="mt-1 text-sm text-red-500">{vehicleTypeIdError}</p>
                )}
              </div>

              {/* Vehicle Model */}
              <FormInput
                label="Vehicle Model"
                value={vehicleModel}
                onChange={(e) => {
                  setVehicleModel(e.target.value);
                  setVehicleModelError(validateVehicleModel(e.target.value));
                }}
                error={vehicleModelError}
                disabled={isDisabled}
                placeholder="e.g., Toyota Camry"
                maxLength={100}
              />

              {/* Year and Capacity Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Year"
                  type="number"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setYearError(validateYear(e.target.value));
                  }}
                  error={yearError}
                  disabled={isDisabled}
                  placeholder="e.g., 2023"
                  min={1900}
                  max={new Date().getFullYear()}
                />
                <FormInput
                  label="Capacity (Seats)"
                  type="number"
                  value={capacity}
                  onChange={(e) => {
                    setCapacity(e.target.value);
                    setCapacityError(validateCapacity(e.target.value));
                  }}
                  error={capacityError}
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
                  value={baseFare}
                  onChange={(e) => {
                    setBaseFare(e.target.value);
                    setBaseFareError(validateBaseFare(e.target.value));
                  }}
                  error={baseFareError}
                  disabled={isDisabled}
                  placeholder="e.g., 150.00"
                  min={0}
                />
                <FormInput
                  label="Maintenance Cost (₹)"
                  type="number"
                  step="0.01"
                  value={maintenance}
                  onChange={(e) => {
                    setMaintenance(e.target.value);
                    setMaintenanceError(validateMaintenance(e.target.value));
                  }}
                  error={maintenanceError}
                  disabled={isDisabled}
                  placeholder="e.g., 500.00"
                  min={0}
                />
              </div>

              {/* Plate Number and Fuel Consumption Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Plate Number"
                  value={plateNumber}
                  onChange={handlePlateNumberChange}
                  error={plateNumberError}
                  disabled={isDisabled}
                  placeholder="e.g., KL 07 CE 6987"
                  style={{ textTransform: 'uppercase' }}
                />
                <FormInput
                  label="Fuel Consumption (L/100km)"
                  type="number"
                  step="0.1"
                  value={fuelConsumption}
                  onChange={(e) => {
                    setFuelConsumption(e.target.value);
                    setFuelConsumptionError(validateFuelConsumption(e.target.value));
                  }}
                  error={fuelConsumptionError}
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
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
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
                            checked={selectedAmenities.includes(amenity.amenityId)}
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

