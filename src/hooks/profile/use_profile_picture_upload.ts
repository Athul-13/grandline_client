import { useMutation } from '@tanstack/react-query';
import { userService } from '../../services/api/user_service';
import { useUpdateProfileMutation } from './use_update_profile_mutation';
import { uploadImageToCloudinary, CloudinaryUploadError } from '../../utils/cloudinary_uploader';

interface UseProfilePictureUploadReturn {
  isUploading: boolean;
  error: string | null;
  uploadProfilePicture: (file: File | Blob, fileName?: string) => Promise<string | null>;
  clearError: () => void;
}

interface UploadParams {
  file: File | Blob;
  fileName?: string;
}

/**
 * Custom hook for uploading profile pictures to Cloudinary
 * Uses TanStack Query mutations for automatic state management and cache updates
 */
export const useProfilePictureUpload = (): UseProfilePictureUploadReturn => {
  // Use the update profile mutation hook for step 3
  const updateProfile = useUpdateProfileMutation();

  // Main upload mutation that chains all three steps
  const uploadMutation = useMutation<string, Error, UploadParams>({
    mutationFn: async ({ file, fileName }: UploadParams) => {
      // Get signed upload URL from server
      const uploadData = await userService.getUploadUrl();

      // Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(
        file,
        uploadData.uploadUrl,
        uploadData.params,
        fileName
      );

      // Update profile with image URL using TanStack Query mutation
      await updateProfile.mutateAsync({ profilePicture: imageUrl });

      return imageUrl;
    },
  });

  // Wrapper function to match the original interface
  const uploadProfilePicture = async (
    file: File | Blob,
    fileName?: string
  ): Promise<string | null> => {
    try {
      const imageUrl = await uploadMutation.mutateAsync({ file, fileName });
      return imageUrl;
    } catch {
      // Error is automatically handled by mutation and available in mutation.error
      return null;
    }
  };

  // Convert mutation error to string for compatibility
  const error =
    uploadMutation.error instanceof CloudinaryUploadError
      ? uploadMutation.error.message
      : uploadMutation.error instanceof Error
      ? uploadMutation.error.message
      : uploadMutation.error
      ? String(uploadMutation.error)
      : null;

  // Clear error by resetting the mutation
  const clearError = () => {
    uploadMutation.reset();
  };

  return {
    isUploading: uploadMutation.isPending,
    error,
    uploadProfilePicture,
    clearError,
  };
};

