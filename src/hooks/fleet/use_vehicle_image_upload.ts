import { useState, useCallback, useRef } from 'react';
import { vehicleService } from '../../services/api/vehicle_service';
import { uploadImageToCloudinary, CloudinaryUploadError } from '../../utils/cloudinary_uploader';
import type { VehicleCloudinaryUploadParams } from '../../types/fleet/vehicle';
import type { CloudinaryUploadParams } from '../../types/profile/user_profile';

export interface ImageUploadState {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

interface UseVehicleImageUploadReturn {
  images: ImageUploadState[];
  isUploading: boolean;
  uploadSignature: VehicleCloudinaryUploadParams | null;
  uploadUrl: string | null;
  signatureExpiresAt: number | null;
  addImages: (files: File[]) => Promise<void>;
  removeImage: (id: string) => Promise<void>;
  retryUpload: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  getSuccessfullyUploadedUrls: () => string[];
}

/**
 * Custom hook for uploading vehicle images to Cloudinary
 * Handles multiple images, signature management, and cleanup
 */
export const useVehicleImageUpload = (): UseVehicleImageUploadReturn => {
  const [images, setImages] = useState<ImageUploadState[]>([]);
  const [uploadSignature, setUploadSignature] = useState<VehicleCloudinaryUploadParams | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [signatureExpiresAt, setSignatureExpiresAt] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  // Get or refresh upload signature
  const getUploadSignature = useCallback(async (): Promise<{
    uploadUrl: string;
    params: VehicleCloudinaryUploadParams;
  }> => {
    // Check if current signature is still valid (with 30 second buffer)
    const now = Date.now();
    if (
      uploadSignature &&
      uploadUrl &&
      signatureExpiresAt &&
      now < signatureExpiresAt - 30000
    ) {
      return { uploadUrl, params: uploadSignature };
    }

    // Get new signature
    const response = await vehicleService.getUploadSignature();
    const expiresAt = now + response.expiresIn * 1000;
    
    setUploadSignature(response.params);
    setUploadUrl(response.uploadUrl);
    setSignatureExpiresAt(expiresAt);

    return {
      uploadUrl: response.uploadUrl,
      params: response.params,
    };
  }, [uploadSignature, uploadUrl, signatureExpiresAt]);

  // Upload a single image
  const uploadImage = useCallback(
    async (imageState: ImageUploadState): Promise<string> => {
      const { uploadUrl: url, params } = await getUploadSignature();
      
      // Convert VehicleCloudinaryUploadParams to CloudinaryUploadParams
      const cloudinaryParams: CloudinaryUploadParams = {
        timestamp: params.timestamp,
        signature: params.signature,
        api_key: params.api_key,
        folder: params.folder,
      };
      
      const imageUrl = await uploadImageToCloudinary(
        imageState.file,
        url,
        cloudinaryParams,
        `vehicle-image-${imageState.id}.jpg`
      );

      return imageUrl;
    },
    [getUploadSignature]
  );

  // Add images and start uploading
  const addImages = useCallback(
    async (files: File[]) => {
      // Validate file count (max 5 total)
      const currentCount = images.filter(img => img.status !== 'error').length;
      if (currentCount + files.length > 5) {
        throw new Error('Maximum 5 images allowed');
      }

      // Create image states
      const newImages: ImageUploadState[] = files.map((file) => {
        const id = `${Date.now()}-${Math.random()}`;
        const preview = URL.createObjectURL(file);
        return {
          id,
          file,
          preview,
          status: 'pending',
        };
      });

      setImages((prev) => [...prev, ...newImages]);

      // Start uploading all new images
      setIsUploading(true);
      const uploadPromises = newImages.map(async (imageState) => {
        try {
          // Update status to uploading
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageState.id ? { ...img, status: 'uploading' } : img
            )
          );

          // Create abort controller for this upload
          const abortController = new AbortController();
          abortControllersRef.current.set(imageState.id, abortController);

          const imageUrl = await uploadImage(imageState);

          // Check if upload was aborted
          if (abortController.signal.aborted) {
            return;
          }

          // Update status to success
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageState.id
                ? { ...img, status: 'success', url: imageUrl }
                : img
            )
          );
        } catch (error) {
          // Check if upload was aborted
          const controller = abortControllersRef.current.get(imageState.id);
          if (controller?.signal.aborted) {
            return;
          }

          // Update status to error
          const errorMessage =
            error instanceof CloudinaryUploadError
              ? error.message
              : error instanceof Error
              ? error.message
              : 'Failed to upload image';

          setImages((prev) =>
            prev.map((img) =>
              img.id === imageState.id
                ? { ...img, status: 'error', error: errorMessage }
                : img
            )
          );

          // Stop all remaining uploads if one fails
          abortControllersRef.current.forEach((controller, imgId) => {
            if (imgId !== imageState.id && !controller.signal.aborted) {
              controller.abort();
            }
          });

          throw error;
        } finally {
          abortControllersRef.current.delete(imageState.id);
        }
      });

      try {
        await Promise.all(uploadPromises);
      } finally {
        setIsUploading(false);
      }
    },
    [images, uploadImage]
  );

  // Remove image and delete from Cloudinary if uploaded
  const removeImage = useCallback(
    async (id: string) => {
      const image = images.find((img) => img.id === id);
      if (!image) return;

      // Abort upload if in progress
      const controller = abortControllersRef.current.get(id);
      if (controller) {
        controller.abort();
        abortControllersRef.current.delete(id);
      }

      // Delete from Cloudinary if successfully uploaded
      if (image.status === 'success' && image.url) {
        try {
          await vehicleService.deleteImages({ urls: [image.url] });
        } catch (error) {
          console.error('Failed to delete image from Cloudinary:', error);
          // Continue with removal even if delete fails
        }
      }

      // Remove from state
      setImages((prev) => {
        const updated = prev.filter((img) => img.id !== id);
        // Clean up preview URL
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
        return updated;
      });
    },
    [images]
  );

  // Retry upload for failed image
  const retryUpload = useCallback(
    async (id: string) => {
      const image = images.find((img) => img.id === id);
      if (!image || image.status !== 'error') return;

      setIsUploading(true);
      try {
        setImages((prev) =>
          prev.map((img) =>
            img.id === id ? { ...img, status: 'uploading', error: undefined } : img
          )
        );

        const controller = new AbortController();
        abortControllersRef.current.set(id, controller);

        const imageUrl = await uploadImage(image);

        if (controller.signal.aborted) {
          return;
        }

        setImages((prev) =>
          prev.map((img) =>
            img.id === id ? { ...img, status: 'success', url: imageUrl } : img
          )
        );
      } catch (error) {
        const controller = abortControllersRef.current.get(id);
        if (controller?.signal.aborted) {
          return;
        }

        const errorMessage =
          error instanceof CloudinaryUploadError
            ? error.message
            : error instanceof Error
            ? error.message
            : 'Failed to upload image';

        setImages((prev) =>
          prev.map((img) =>
            img.id === id ? { ...img, status: 'error', error: errorMessage } : img
          )
        );
      } finally {
        abortControllersRef.current.delete(id);
        setIsUploading(false);
      }
    },
    [images, uploadImage]
  );

  // Clear all images and delete from Cloudinary
  const clearAll = useCallback(async () => {
    // Abort all ongoing uploads
    abortControllersRef.current.forEach((controller) => {
      controller.abort();
    });
    abortControllersRef.current.clear();

    // Get all successfully uploaded URLs
    const uploadedUrls = images
      .filter((img) => img.status === 'success' && img.url)
      .map((img) => img.url!);

    // Delete from Cloudinary if any
    if (uploadedUrls.length > 0) {
      try {
        await vehicleService.deleteImages({ urls: uploadedUrls });
      } catch (error) {
        console.error('Failed to delete images from Cloudinary:', error);
        // Continue with cleanup even if delete fails
      }
    }

    // Clean up preview URLs
    images.forEach((img) => {
      if (img.preview) {
        URL.revokeObjectURL(img.preview);
      }
    });

    // Clear state
    setImages([]);
    setIsUploading(false);
  }, [images]);

  // Get successfully uploaded URLs
  const getSuccessfullyUploadedUrls = useCallback((): string[] => {
    return images.filter((img) => img.status === 'success' && img.url).map((img) => img.url!);
  }, [images]);

  return {
    images,
    isUploading,
    uploadSignature,
    uploadUrl,
    signatureExpiresAt,
    addImages,
    removeImage,
    retryUpload,
    clearAll,
    getSuccessfullyUploadedUrls,
  };
};

