import { useState, useEffect, useCallback, useMemo } from 'react';
import { quoteService } from '../../services/api/quote_service';
import type { AdminQuoteListItem, AdminQuoteListParams } from '../../types/quotes/admin_quote';
import type { PaginationMeta } from '../../types/quotes/quote';

interface UseAdminQuotesListParams {
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
  search?: string;
  status?: string[];
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

interface UseAdminQuotesListReturn {
  quotes: AdminQuoteListItem[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing admin quotes list
 */
export const useAdminQuotesList = (params?: UseAdminQuotesListParams): UseAdminQuotesListReturn => {
  const [quotes, setQuotes] = useState<AdminQuoteListItem[]>([]);
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

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const requestParams: AdminQuoteListParams = {
        page: params?.page || 1,
        limit: params?.limit || 20,
        includeDeleted: params?.includeDeleted || false,
      };

      // Add search parameter if provided
      if (params?.search && params.search.trim()) {
        requestParams.search = params.search.trim();
      }

      // Add status filter if provided
      if (params?.status && params.status.length > 0) {
        requestParams.status = params.status;
      }

      // Add sorting parameters if provided
      if (params?.sortBy) {
        requestParams.sortBy = params.sortBy;
      }
      if (params?.sortOrder) {
        requestParams.sortOrder = params.sortOrder;
      }

      const response = await quoteService.getAdminQuotes(requestParams);
      
      setQuotes(response.quotes);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch admin quotes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
      setQuotes([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    params?.page,
    params?.limit,
    params?.includeDeleted,
    params?.search,
    statusKey, // Use memoized statusKey instead of params?.status
    params?.sortBy,
    params?.sortOrder,
  ]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return {
    quotes,
    pagination,
    isLoading,
    error,
    refetch: fetchQuotes,
  };
};

