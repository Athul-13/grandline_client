import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/api/user_service';
import type { ChangeUserStatusRequest, ChangeUserStatusResponse } from '../../types/users/admin_user';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage } from '../../utils/error_sanitizer';

interface UseChangeUserStatusParams {
  userId: string;
  onSuccess?: () => void;
}

interface UseChangeUserStatusReturn {
  changeStatus: (userId: string, data: ChangeUserStatusRequest) => Promise<ChangeUserStatusResponse | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for changing user status (admin only)
 * Uses React Query for mutations and automatic query invalidation
 */
export const useChangeUserStatus = (params?: UseChangeUserStatusParams): UseChangeUserStatusReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ChangeUserStatusResponse, Error, { userId: string; data: ChangeUserStatusRequest }>({
    mutationFn: ({ userId, data }) => userService.changeUserStatus(userId, data),
    onSuccess: (response, variables) => {
      toast.success(response.message || 'User status updated successfully!');
      // Invalidate and refetch user details
      queryClient.invalidateQueries({ queryKey: ['adminUserDetails', variables.userId] });
      // Invalidate user list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      if (params?.onSuccess) {
        params.onSuccess();
      }
    },
    onError: (error) => {
      const errorMessage = sanitizeErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  const changeStatus = async (
    userId: string,
    data: ChangeUserStatusRequest
  ): Promise<ChangeUserStatusResponse | null> => {
    try {
      const response = await mutation.mutateAsync({ userId, data });
      return response;
    } catch  {
      return null;
    }
  };

  return {
    changeStatus,
    isLoading: mutation.isPending,
    error: mutation.error ? sanitizeErrorMessage(mutation.error) : null,
  };
};

