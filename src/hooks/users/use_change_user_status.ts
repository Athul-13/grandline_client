import { useState } from 'react';
import { userService } from '../../services/api/user_service';
import type { ChangeUserStatusRequest, ChangeUserStatusResponse } from '../../types/users/admin_user';

interface UseChangeUserStatusReturn {
  changeStatus: (userId: string, data: ChangeUserStatusRequest) => Promise<ChangeUserStatusResponse | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for changing user status (admin only)
 */
export const useChangeUserStatus = (): UseChangeUserStatusReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeStatus = async (
    userId: string,
    data: ChangeUserStatusRequest
  ): Promise<ChangeUserStatusResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.changeUserStatus(userId, data);
      // Check if response is valid
      if (response && response.success) {
        return response;
      } else {
        console.error('Invalid response from server:', response);
        setError('Invalid response from server');
        return null;
      }
    } catch (err) {
      console.error('Failed to change user status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to change user status';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changeStatus,
    isLoading,
    error,
  };
};

