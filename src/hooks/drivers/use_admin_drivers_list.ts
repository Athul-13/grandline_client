import { useQuery } from '@tanstack/react-query';
import { driverService } from '../../services/api/driver_service';
import type { AdminDriverListParams, AdminDriverListResponse } from '../../types/drivers/admin_driver';
import { sanitizeErrorMessage } from '../../utils/error_sanitizer';
import { useCallback, useMemo } from 'react';

interface UseAdminDriversListParams {
  page?: number;
  limit?: number;
  status?: string[];
  isOnboarded?: boolean;
  search?: string;
  sortBy?: 'email' | 'fullName' | 'licenseNumber' | 'createdAt' | 'salary';
  sortOrder?: 'asc' | 'desc';
}

interface UseAdminDriversListReturn {
  drivers: AdminDriverListResponse['drivers'];
  pagination: AdminDriverListResponse['pagination'] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook for fetching and managing admin drivers list
 * Uses React Query for caching and automatic refetching
 */
export const useAdminDriversList = (params?: UseAdminDriversListParams): UseAdminDriversListReturn => {
  // Memoize status array to prevent infinite loops from reference changes
  const statusKey = useMemo(() => {
    if (!params?.status || params.status.length === 0) {
      return '';
    }
    return [...params.status].sort().join(',');
  }, [params?.status]);

  // Build query key for React Query
  const queryKey = useMemo(() => {
    return [
      'adminDrivers',
      params?.page,
      params?.limit,
      params?.search,
      statusKey,
      params?.isOnboarded,
      params?.sortBy,
      params?.sortOrder,
    ];
  }, [
    params?.page,
    params?.limit,
    params?.search,
    statusKey,
    params?.isOnboarded,
    params?.sortBy,
    params?.sortOrder,
  ]);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<AdminDriverListResponse, Error>({
    queryKey: queryKey,
    queryFn: async () => {
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
      return response;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const memoizedRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    drivers: (data as AdminDriverListResponse | undefined)?.drivers || [],
    pagination: (data as AdminDriverListResponse | undefined)?.pagination || null,
    isLoading,
    error: error ? sanitizeErrorMessage(error) : null,
    refetch: memoizedRefetch,
  };
};

