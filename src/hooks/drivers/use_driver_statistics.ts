import { useState, useEffect, useCallback, useRef } from 'react';
import { driverService } from '../../services/api/driver_service';
import type { DriverStatisticsResponse, DriverStatisticsRequest } from '../../types/drivers/admin_driver';
import { adminDashboardSocketService } from '../../services/socket/admin_dashboard_socket_service';

interface UseDriverStatisticsReturn {
  data: DriverStatisticsResponse['statistics'] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching driver statistics with real-time updates
 * GET /api/v1/admin/drivers/statistics
 * Listens for driver-related socket events and refetches automatically
 */
export const useDriverStatistics = (params?: DriverStatisticsRequest): UseDriverStatisticsReturn => {
  const [data, setData] = useState<DriverStatisticsResponse['statistics'] | null>(null);
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
      const response = await driverService.getDriverStatistics(currentParams);
      
      if (response && response.success) {
        setData(response.statistics);
      } else {
        setError('Invalid response from server');
        setData(null);
      }
    } catch (err) {
      console.error('Failed to fetch driver statistics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch driver statistics');
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
      adminDashboardSocketService.onDriverCreated(() => {
        fetchStatistics();
      }),
      adminDashboardSocketService.onDriverUpdated(() => {
        fetchStatistics();
      }),
      adminDashboardSocketService.onDriverStatusChanged(() => {
        fetchStatistics();
      }),
      adminDashboardSocketService.onDriverDeleted(() => {
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

