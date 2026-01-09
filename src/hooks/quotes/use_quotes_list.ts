import { useState, useEffect, useCallback } from 'react';
import { quoteService } from '../../services/api/quote_service';
import type { QuoteListItem, PaginationMeta } from '../../types/quotes/quote';

interface UseQuotesListParams {
  page?: number;
  limit?: number;
  status?: string;
}

interface UseQuotesListReturn {
  quotes: QuoteListItem[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing quotes list
 */
export const useQuotesList = (params?: UseQuotesListParams): UseQuotesListReturn => {
  const [quotes, setQuotes] = useState<QuoteListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TypeScript infers QuoteListResponse from function overload (forDropdown is not set)
      const response = await quoteService.getQuotes({
        page: params?.page || 1,
        limit: params?.limit || 15,
        status: params?.status,
        sortBy: 'createdAt',
        sortOrder: 'desc', // Newest first
      });
      
      // Ensure sorting (fallback in case backend doesn't support sort params)
      const sortedQuotes = [...response.quotes].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Newest first (descending)
      });
      
      setQuotes(sortedQuotes);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch quotes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch quotes');
      setQuotes([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [params?.page, params?.limit, params?.status]);

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

