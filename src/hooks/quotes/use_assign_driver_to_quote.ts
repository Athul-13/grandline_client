import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '../../services/api/quote_service';
import { sanitizeErrorMessage } from '../../utils/error_sanitizer';
import type { AssignDriverToQuoteRequest } from '../../types/quotes/admin_quote';

interface UseAssignDriverToQuoteReturn {
  assignDriver: (quoteId: string, data: AssignDriverToQuoteRequest) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for assigning driver to quote
 */
export const useAssignDriverToQuote = (): UseAssignDriverToQuoteReturn => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ quoteId, data }: { quoteId: string; data: AssignDriverToQuoteRequest }) => {
      return await quoteService.assignDriverToQuote(quoteId, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['adminQuoteDetails', variables.quoteId] });
      queryClient.invalidateQueries({ queryKey: ['adminQuotes'] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      setError(null);
    },
    onError: (err: Error) => {
      setError(sanitizeErrorMessage(err));
    },
  });

  const assignDriver = async (quoteId: string, data: AssignDriverToQuoteRequest): Promise<boolean> => {
    try {
      await mutation.mutateAsync({ quoteId, data });
      return true;
    } catch {
      return false;
    }
  };

  return {
    assignDriver,
    isLoading: mutation.isPending,
    error: error || (mutation.error ? sanitizeErrorMessage(mutation.error as Error) : null),
  };
};
