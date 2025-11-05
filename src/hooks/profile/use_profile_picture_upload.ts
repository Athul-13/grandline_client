import { useState, useCallback } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { userService } from '../../services/api/user_service';
import { updateUserProfileAsync } from '../../store/slices/profile_slice';
import { uploadImageToCloudinary, CloudinaryUploadError } from '../../utils/cloudinary_uploader';

interface UseProfilePictureUploadReturn {
  isUploading: boolean;
  error: string | null;
  uploadProfilePicture: (file: File | Blob, fileName?: string) => Promise<string | null>;
  clearError: () => void;
}

/**
 * Custom hook for uploading profile pictures to Cloudinary
 */
export const useProfilePictureUpload = (): UseProfilePictureUploadReturn => {
  const dispatch = useAppDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadProfilePicture = useCallback(async (file: File | Blob, fileName?: string): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // Step 1: Get signed upload URL from server
      const uploadData = await userService.getUploadUrl();

      // Step 2: Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(
        file,
        uploadData.uploadUrl,
        uploadData.params,
        fileName
      );

      // Step 3: Update profile with image URL
      await dispatch(
        updateUserProfileAsync({ profilePicture: imageUrl })
      ).unwrap();

      setIsUploading(false);
      return imageUrl;
    } catch (err) {
      setIsUploading(false);
      
      let errorMessage = 'Failed to upload profile picture';
      
      if (err instanceof CloudinaryUploadError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
      return null;
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isUploading,
    error,
    uploadProfilePicture,
    clearError,
  };
};

