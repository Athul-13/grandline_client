import { useState, useEffect, useCallback } from 'react';
import { userService } from '../../services/api/user_service';
import type { AdminUserDetailsResponse } from '../../types/users/admin_user';

interface UseAdminUserDetailsReturn {
  userDetails: AdminUserDetailsResponse['user'] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching admin user details
 */
export const useAdminUserDetails = (userId: string): UseAdminUserDetailsReturn => {
  const [userDetails, setUserDetails] = useState<AdminUserDetailsResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.getAdminUserDetails(userId);
      
      // Handle response structure - user is at top level
      if (response && response.success && response.user) {
        setUserDetails(response.user);
      } else {
        console.error('Unexpected response structure:', response);
        setError('Unexpected response format from server');
        setUserDetails(null);
      }
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
      setUserDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  return {
    userDetails,
    isLoading,
    error,
    refetch: fetchUserDetails,
  };
};

