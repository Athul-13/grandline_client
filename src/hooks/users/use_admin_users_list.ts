import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/api/user_service';
import type { AdminUserListParams, AdminUserListResponse } from '../../types/users/admin_user';
import { sanitizeErrorMessage } from '../../utils/error_sanitizer';
import { useCallback, useMemo } from 'react';

interface UseAdminUsersListParams {
  page?: number;
  limit?: number;
  status?: string[];
  isVerified?: boolean;
  search?: string;
  sortBy?: 'email' | 'fullName' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

interface UseAdminUsersListReturn {
  users: AdminUserListResponse['users'];
  pagination: AdminUserListResponse['pagination'] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook for fetching and managing admin users list
 * Uses React Query for caching and automatic refetching
 */
export const useAdminUsersList = (params?: UseAdminUsersListParams): UseAdminUsersListReturn => {
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
      'adminUsers',
      params?.page,
      params?.limit,
      params?.search,
      statusKey,
      params?.isVerified,
      params?.sortBy,
      params?.sortOrder,
    ];
  }, [
    params?.page,
    params?.limit,
    params?.search,
    statusKey,
    params?.isVerified,
    params?.sortBy,
    params?.sortOrder,
  ]);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<AdminUserListResponse, Error>({
    queryKey: queryKey,
    queryFn: async () => {
      const requestParams: AdminUserListParams = {
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

      // Add isVerified filter if provided
      if (params?.isVerified !== undefined) {
        requestParams.isVerified = params.isVerified;
      }

      // Add sorting parameters if provided
      if (params?.sortBy) {
        requestParams.sortBy = params.sortBy;
      }
      if (params?.sortOrder) {
        requestParams.sortOrder = params.sortOrder;
      }

      const response = await userService.getAdminUsers(requestParams);
      return response;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const memoizedRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    users: (data as AdminUserListResponse | undefined)?.users || [],
    pagination: (data as AdminUserListResponse | undefined)?.pagination || null,
    isLoading,
    error: error ? sanitizeErrorMessage(error) : null,
    refetch: memoizedRefetch,
  };
};

