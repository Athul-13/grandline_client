import { useState } from 'react';
import { quoteService } from '../../services/api/quote_service';
import type { UpdateQuoteStatusRequest, UpdateQuoteStatusResponse } from '../../types/quotes/admin_quote';

interface UseUpdateQuoteStatusReturn {
  updateStatus: (id: string, data: UpdateQuoteStatusRequest) => Promise<UpdateQuoteStatusResponse | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for updating quote status (admin only)
 */
export const useUpdateQuoteStatus = (): UseUpdateQuoteStatusReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (
    id: string,
    data: UpdateQuoteStatusRequest
  ): Promise<UpdateQuoteStatusResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await quoteService.updateQuoteStatus(id, data);
      return response;
    } catch (err) {
      console.error('Failed to update quote status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update quote status');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateStatus,
    isLoading,
    error,
  };
};

