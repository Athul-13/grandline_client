import { useState, useEffect, useCallback, useMemo } from 'react';
import { userService } from '../../services/api/user_service';
import type { UserStatisticsResponse, UserStatisticsRequest } from '../../types/users/admin_user';

interface UseUserStatisticsReturn {
  data: UserStatisticsResponse['statistics'] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching user statistics
 * GET /api/v1/admin/users/statistics
 */
export const useUserStatistics = (params?: UserStatisticsRequest): UseUserStatisticsReturn => {
  const [data, setData] = useState<UserStatisticsResponse['statistics'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize params to prevent unnecessary re-renders
  const memoizedParams = useMemo(() => params, [params]);

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.getUserStatistics(memoizedParams);
      
      if (response && response.success) {
        setData(response.statistics);
      } else {
        setError('Invalid response from server');
        setData(null);
      }
    } catch (err) {
      console.error('Failed to fetch user statistics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user statistics');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [memoizedParams]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchStatistics,
  };
};

