import { useState, useEffect, useCallback } from 'react';
import { quoteService } from '../../services/api/quote_service';
import type { AdminQuoteDetailsResponse } from '../../types/quotes/admin_quote';

interface UseAdminQuoteDetailsReturn {
  quoteDetails: AdminQuoteDetailsResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching admin quote details
 */
export const useAdminQuoteDetails = (quoteId: string): UseAdminQuoteDetailsReturn => {
  const [quoteDetails, setQuoteDetails] = useState<AdminQuoteDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuoteDetails = useCallback(async () => {
    if (!quoteId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await quoteService.getAdminQuoteDetails(quoteId);
      setQuoteDetails(response);
    } catch (err) {
      console.error('Failed to fetch quote details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch quote details');
      setQuoteDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [quoteId]);

  useEffect(() => {
    fetchQuoteDetails();
  }, [fetchQuoteDetails]);

  return {
    quoteDetails,
    isLoading,
    error,
    refetch: fetchQuoteDetails,
  };
};

