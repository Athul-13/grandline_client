import { useState, useEffect, useCallback, useRef } from 'react';
import { userService } from '../../services/api/user_service';
import type { UserStatisticsResponse, UserStatisticsRequest } from '../../types/users/admin_user';
import { adminDashboardSocketService } from '../../services/socket/admin_dashboard_socket_service';

interface UseUserStatisticsReturn {
  data: UserStatisticsResponse['statistics'] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching user statistics with real-time updates
 * GET /api/v1/admin/users/statistics
 * Listens for user-related socket events and refetches automatically
 */
export const useUserStatistics = (params?: UserStatisticsRequest): UseUserStatisticsReturn => {
  const [data, setData] = useState<UserStatisticsResponse['statistics'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to store params to avoid dependency loops
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentParams = paramsRef.current;
      const response = await userService.getUserStatistics(currentParams);
      
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
  }, []);

  // Initial fetch and refetch on params change
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics, params?.timeRange, params?.startDate, params?.endDate]);

  // Socket listeners for real-time updates
  useEffect(() => {
    const unsubscribeHandlers = [
      adminDashboardSocketService.onUserCreated(() => {
        fetchStatistics();
      }),
      adminDashboardSocketService.onUserUpdated(() => {
        fetchStatistics();
      }),
      adminDashboardSocketService.onUserStatusChanged(() => {
        fetchStatistics();
      }),
      adminDashboardSocketService.onUserRoleChanged(() => {
        fetchStatistics();
      }),
      adminDashboardSocketService.onUserVerified(() => {
        fetchStatistics();
      }),
      adminDashboardSocketService.onUserDeleted(() => {
        fetchStatistics();
      }),
    ];

    return () => {
      unsubscribeHandlers.forEach(unsubscribe => unsubscribe());
    };
  }, [fetchStatistics]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchStatistics,
  };
};

