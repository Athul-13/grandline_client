import { useState, useEffect, useCallback } from 'react';
import { quoteService } from '../../services/api/quote_service';
import type { AdminQuoteListItem, AdminQuoteListParams, PaginationMeta } from '../../types/quotes/admin_quote';

interface UseAdminQuotesListParams {
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
  search?: string;
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
  }, [params?.page, params?.limit, params?.includeDeleted, params?.search]);

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

