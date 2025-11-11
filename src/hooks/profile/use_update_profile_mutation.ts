import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '../../store/hooks';
import { userService } from '../../services/api/user_service';
import { updateUserProfile } from '../../store/slices/auth_slice';
import type { UpdateProfileRequest, UserProfile } from '../../types/profile/user_profile';

/**
 * Custom hook to update user profile
 * Uses TanStack Query mutation for automatic cache management and state updates
 */
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation<UserProfile, Error, UpdateProfileRequest>({
    // Mutation function - updates the profile
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await userService.updateProfile(data);
      return response.user; // Return UserProfile
    },

    // On successful mutation
    onSuccess: (updatedProfile: UserProfile) => {
      queryClient.setQueryData<UserProfile>(['profile'], updatedProfile);

      // Sync with Redux auth slice (for global user state)
      dispatch(
        updateUserProfile({
          fullName: updatedProfile.fullName,
          email: updatedProfile.email,
          role: updatedProfile.role,
        })
      );

      // Optionally invalidate to ensure consistency (refetch in background)
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },

    // On mutation error
    onError: (error: Error) => {
      console.error('Profile update failed:', error);
    },
  });
};

