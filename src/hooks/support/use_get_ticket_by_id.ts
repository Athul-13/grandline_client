import { useQuery } from '@tanstack/react-query';
import { supportService } from '../../services/api/support_service';

/**
 * Hook for getting a ticket by ID
 */
export const useGetTicketById = (ticketId: string | null) => {
  return useQuery({
    queryKey: ['support', 'tickets', ticketId],
    queryFn: () => supportService.getTicketById(ticketId!),
    enabled: !!ticketId,
  });
};

