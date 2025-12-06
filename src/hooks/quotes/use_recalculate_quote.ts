import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '../../services/api/quote_service';
import { sanitizeErrorMessage } from '../../utils/error_sanitizer';

interface UseRecalculateQuoteReturn {
  recalculate: (quoteId: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  requiresVehicleReselection: boolean;
}

/**
 * Hook for recalculating quote pricing
 */
export const useRecalculateQuote = (): UseRecalculateQuoteReturn => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [requiresVehicleReselection, setRequiresVehicleReselection] = useState(false);

  const mutation = useMutation({
    mutationFn: async (quoteId: string) => {
      return await quoteService.recalculateQuote(quoteId);
    },
    onSuccess: (response, quoteId) => {
      if (response.requiresVehicleReselection) {
        setRequiresVehicleReselection(true);
      } else {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['adminQuoteDetails', quoteId] });
        queryClient.invalidateQueries({ queryKey: ['adminQuotes'] });
        queryClient.invalidateQueries({ queryKey: ['quotes'] });
        setRequiresVehicleReselection(false);
        setError(null);
      }
    },
    onError: (err: Error) => {
      setError(sanitizeErrorMessage(err));
      setRequiresVehicleReselection(false);
    },
  });

  const recalculate = async (quoteId: string): Promise<boolean> => {
    try {
      const response = await mutation.mutateAsync(quoteId);
      return response.success;
    } catch {
      return false;
    }
  };

  return {
    recalculate,
    isLoading: mutation.isPending,
    error: error || (mutation.error ? sanitizeErrorMessage(mutation.error as Error) : null),
    requiresVehicleReselection,
  };
};
