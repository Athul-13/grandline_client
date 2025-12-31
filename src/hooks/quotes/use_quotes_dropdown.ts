import { useQuery } from '@tanstack/react-query';
import { quoteService } from '../../services/api/quote_service';

/**
 * Hook for getting quotes for dropdown (minimal data)
 */
export const useQuotesDropdown = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['quotes', 'dropdown'],
    queryFn: async () => {
      const response = await quoteService.getQuotes({ forDropdown: true });
      // Response is wrapped: { success: true, data: [...] }
      if (response && typeof response === 'object' && 'data' in response) {
        return Array.isArray(response.data) ? response.data : [];
      }
      // Fallback: if response is already an array (shouldn't happen but safe)
      return Array.isArray(response) ? response : [];
    },
    enabled,
  });
};

