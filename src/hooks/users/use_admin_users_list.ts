import { useState, useEffect, useCallback, useMemo } from 'react';
import { userService } from '../../services/api/user_service';
import type { AdminUserListItem, AdminUserListParams } from '../../types/users/admin_user';
import type { PaginationMeta } from '../../types/quotes/quote';

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
  users: AdminUserListItem[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing admin users list
 */
export const useAdminUsersList = (params?: UseAdminUsersListParams): UseAdminUsersListReturn => {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize status array to prevent infinite loops from reference changes
  // Sort and stringify to create a stable comparison value
  const statusKey = useMemo(() => {
    if (!params?.status || params.status.length === 0) {
      return '';
    }
    return [...params.status].sort().join(',');
  }, [params?.status]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
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
      
      // Handle response structure - users and pagination are at top level
      if (response && response.success) {
        if (Array.isArray(response.users)) {
          setUsers(response.users);
          setPagination(response.pagination || null);
        } else {
          console.error('Unexpected response structure. Expected users array but got:', response);
          setError('Unexpected response format from server');
          setUsers([]);
          setPagination(null);
        }
      } else {
        console.error('Invalid response:', response);
        setError('Invalid response from server');
        setUsers([]);
        setPagination(null);
      }
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    params?.page,
    params?.limit,
    params?.search,
    statusKey, // Use memoized statusKey instead of params?.status
    params?.isVerified,
    params?.sortBy,
    params?.sortOrder,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    pagination,
    isLoading,
    error,
    refetch: fetchUsers,
  };
};

