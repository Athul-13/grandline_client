import { useState, useEffect, useCallback, useMemo } from 'react';
import { driverService } from '../../services/api/driver_service';
import type { AdminDriverListItem, AdminDriverListParams } from '../../types/drivers/admin_driver';
import type { PaginationMeta } from '../../types/quotes/quote';

interface UseAdminDriversListParams {
  page?: number;
  limit?: number;
  status?: string[];
  isOnboarded?: boolean;
  search?: string;
  sortBy?: 'email' | 'fullName' | 'licenseNumber' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

interface UseAdminDriversListReturn {
  drivers: AdminDriverListItem[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing admin drivers list
 */
export const useAdminDriversList = (params?: UseAdminDriversListParams): UseAdminDriversListReturn => {
  const [drivers, setDrivers] = useState<AdminDriverListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize status array to prevent infinite loops from reference changes
  const statusKey = useMemo(() => {
    if (!params?.status || params.status.length === 0) {
      return '';
    }
    return [...params.status].sort().join(',');
  }, [params?.status]);

  const fetchDrivers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const requestParams: AdminDriverListParams = {
        page: params?.page || 1,
        limit: params?.limit || 20,
      };

      // Add search parameter if provided
      if (params?.search && params.search.trim()) {
        requestParams.search = params.search.trim();
      }

      // Add status filter if provided
      if (params?.status && params.status.length > 0) {
        requestParams.status = params.status;
      }

      // Add isOnboarded filter if provided
      if (params?.isOnboarded !== undefined) {
        requestParams.isOnboarded = params.isOnboarded;
      }

      // Add sorting parameters if provided
      if (params?.sortBy) {
        requestParams.sortBy = params.sortBy;
      }
      if (params?.sortOrder) {
        requestParams.sortOrder = params.sortOrder;
      }

      const response = await driverService.getAdminDrivers(requestParams);
      
      // Handle response structure
      if (response && response.success) {
        if (Array.isArray(response.drivers)) {
          setDrivers(response.drivers);
          setPagination(response.pagination || null);
        } else {
          console.error('Unexpected response structure. Expected drivers array but got:', response);
          setError('Unexpected response format from server');
          setDrivers([]);
          setPagination(null);
        }
      } else {
        console.error('Invalid response:', response);
        setError('Invalid response from server');
        setDrivers([]);
        setPagination(null);
      }
    } catch (err) {
      console.error('Failed to fetch admin drivers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch drivers');
      setDrivers([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    params?.page,
    params?.limit,
    params?.search,
    statusKey, // Use memoized statusKey instead of params?.status to prevent infinite loops
    params?.isOnboarded,
    params?.sortBy,
    params?.sortOrder,
  ]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return {
    drivers,
    pagination,
    isLoading,
    error,
    refetch: fetchDrivers,
  };
};

