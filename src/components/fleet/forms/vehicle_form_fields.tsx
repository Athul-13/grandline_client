import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormInput } from '../../common/forms/form_input';
import { VehicleStatus } from '../../types/fleet/vehicle';
import { AmenitiesSelector } from './amenities_selector';
import { VehicleImageUpload } from './vehicle_image_upload';
import { cn } from '../../utils/cn';
import type { VehicleFormData } from '../../types/fleet/vehicle_form';
import type { VehicleType } from '../../types/fleet/vehicle_type';
import type { Amenity } from '../../types/fleet/amenity';
import type { ImageUploadState } from '../../hooks/fleet/use_vehicle_image_upload';

interface VehicleFormFieldsProps {
  vehicleTypes: VehicleType[];
  amenities: Amenity[];
  isLoadingVehicleTypes: boolean;
  isLoadingAmenities: boolean;
  existingImages: string[];
  uploadedImages: ImageUploadState[];
  isUploadingImages: boolean;
  imagesError: string;
  disabled?: boolean;
  onPlateNumberChange: (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveExistingImage: (url: string) => void;
  onRemoveUploadedImage: (id: string) => void;
  onRetryUpload: (id: string) => void;
  onAmenityToggle: (amenityId: string) => void;
}

/**
 * Vehicle Form Fields Component
 * Contains all form input fields for vehicle form
 */
export const VehicleFormFields: React.FC<VehicleFormFieldsProps> = ({
  vehicleTypes,
  amenities,
  isLoadingVehicleTypes,
  isLoadingAmenities,
  existingImages,
  uploadedImages,
  isUploadingImages,
  imagesError,
  disabled = false,
  onPlateNumberChange,
  onFileSelect,
  onRemoveExistingImage,
  onRemoveUploadedImage,
  onRetryUpload,
  onAmenityToggle,
}) => {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext<VehicleFormData>();

  const selectedAmenityIds = watch('amenityIds') || [];

  return (
    <div className="space-y-4">
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
                disabled={disabled || isLoadingVehicleTypes}
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
                  (disabled || isLoadingVehicleTypes) && 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]'
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
        disabled={disabled}
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
          disabled={disabled}
          placeholder="e.g., 2023"
          min={1900}
          max={new Date().getFullYear()}
        />
        <FormInput
          label="Capacity (Seats)"
          type="number"
          {...register('capacity')}
          error={errors.capacity?.message}
          disabled={disabled}
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
          disabled={disabled}
          placeholder="e.g., 150.00"
          min={0}
        />
        <FormInput
          label="Maintenance Cost (₹)"
          type="number"
          step="0.01"
          {...register('maintenance')}
          error={errors.maintenance?.message}
          disabled={disabled}
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
              onChange={(e) => onPlateNumberChange(e, field.onChange)}
              error={errors.plateNumber?.message}
              disabled={disabled}
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
          disabled={disabled}
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
              disabled={disabled}
              className={cn(
                'w-full px-4 py-3 rounded-lg',
                'border border-[var(--color-border)]',
                'bg-[var(--color-bg-card)]',
                'text-[var(--color-text-primary)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
                'transition-colors',
                disabled && 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]'
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
        <AmenitiesSelector
          amenities={amenities}
          selectedAmenityIds={selectedAmenityIds}
          onToggle={onAmenityToggle}
          isLoading={isLoadingAmenities}
          disabled={disabled}
        />
      </div>

      {/* Images */}
      <VehicleImageUpload
        existingImages={existingImages}
        uploadedImages={uploadedImages}
        isUploading={isUploadingImages}
        disabled={disabled}
        maxImages={5}
        onFileSelect={onFileSelect}
        onRemoveExisting={onRemoveExistingImage}
        onRemoveUploaded={onRemoveUploadedImage}
        onRetryUpload={onRetryUpload}
        error={imagesError}
      />
    </div>
  );
};

