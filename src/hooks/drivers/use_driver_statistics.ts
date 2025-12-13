import { useState, useEffect, useCallback, useMemo } from 'react';
import { driverService } from '../../services/api/driver_service';
import type { DriverStatisticsResponse, DriverStatisticsRequest } from '../../types/drivers/admin_driver';

interface UseDriverStatisticsReturn {
  data: DriverStatisticsResponse['statistics'] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching driver statistics
 * GET /api/v1/admin/drivers/statistics
 */
export const useDriverStatistics = (params?: DriverStatisticsRequest): UseDriverStatisticsReturn => {
  const [data, setData] = useState<DriverStatisticsResponse['statistics'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const memoizedParams = useMemo(() => {
    if (!params) return undefined;
    return {
      timeRange: params.timeRange,
      startDate: params.startDate,
      endDate: params.endDate,
    };
  }, [params?.timeRange, params?.startDate, params?.endDate]);

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await driverService.getDriverStatistics(memoizedParams);
      
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

