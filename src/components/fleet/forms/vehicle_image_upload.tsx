import React, { useRef } from 'react';
import { Trash2, Upload, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { ImageUploadState } from '../../hooks/fleet/use_vehicle_image_upload';

interface VehicleImageUploadProps {
  existingImages: string[];
  uploadedImages: ImageUploadState[];
  isUploading: boolean;
  disabled?: boolean;
  maxImages?: number;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveExisting: (url: string) => void;
  onRemoveUploaded: (id: string) => void;
  onRetryUpload: (id: string) => void;
  error?: string;
}

/**
 * Vehicle Image Upload Component
 * Reusable component for uploading and managing vehicle images
 */
export const VehicleImageUpload: React.FC<VehicleImageUploadProps> = ({
  existingImages,
  uploadedImages,
  isUploading,
  disabled = false,
  maxImages = 5,
  onFileSelect,
  onRemoveExisting,
  onRemoveUploaded,
  onRetryUpload,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalImages = existingImages.length + uploadedImages.filter((img) => img.status !== 'error').length;
  const canAddMore = totalImages < maxImages;

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
        Images <span className="text-red-500">*</span>
        <span className="text-xs text-[var(--color-text-secondary)] ml-2">
          (Max {maxImages} images, {totalImages}/{maxImages})
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
              onClick={() => onRemoveExisting(url)}
              disabled={disabled}
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
                    onClick={() => onRemoveUploaded(image.id)}
                    disabled={disabled}
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
                    onClick={() => onRetryUpload(image.id)}
                    disabled={disabled}
                    className="text-xs text-[var(--color-primary)] hover:underline disabled:opacity-50"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Upload Box */}
        {canAddMore && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={onFileSelect}
              disabled={disabled || isUploading}
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

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

