import { useState, useEffect, useCallback, useRef } from 'react';
import { adminDashboardService } from '../../services/api/admin_dashboard_service';
import type {
  AdminDashboardAnalyticsRequest,
  AdminDashboardAnalyticsResponse,
} from '../../types/dashboard/admin_dashboard';

interface UseAdminDashboardAnalyticsReturn {
  data: AdminDashboardAnalyticsResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching admin dashboard analytics
 * GET /api/v1/dashboard/admin/analytics
 */
export const useAdminDashboardAnalytics = (
  params?: AdminDashboardAnalyticsRequest
): UseAdminDashboardAnalyticsReturn => {
  const [data, setData] = useState<AdminDashboardAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to store params to avoid dependency issues
  const paramsRef = useRef(params);
  useEffect(() => {
    paramsRef.current = params;
  }, [params?.timeRange, params?.startDate, params?.endDate]);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminDashboardService.getAdminDashboardAnalytics(paramsRef.current);

      if (response && response.success) {
        setData(response);
      } else {
        setError('Invalid response from server');
        setData(null);
      }
    } catch (err) {
      console.error('Failed to fetch admin dashboard analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch admin dashboard analytics');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array - params are accessed via ref

  useEffect(() => {
    fetchAnalytics();
  }, [params?.timeRange, params?.startDate, params?.endDate, fetchAnalytics]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchAnalytics,
  };
};

