import { useState, useEffect, useCallback } from 'react';
import { quoteService } from '../../services/api/quote_service';
import type { QuoteResponse } from '../../types/quotes/quote';

interface UseQuoteDetailsReturn {
  quoteDetails: QuoteResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching user quote details
 */
export const useQuoteDetails = (quoteId: string): UseQuoteDetailsReturn => {
  const [quoteDetails, setQuoteDetails] = useState<QuoteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuoteDetails = useCallback(async () => {
    if (!quoteId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await quoteService.getQuoteById(quoteId);
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

