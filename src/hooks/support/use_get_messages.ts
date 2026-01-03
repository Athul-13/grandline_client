import { useQuery } from '@tanstack/react-query';
import { supportService } from '../../services/api/support_service';

/**
 * Hook for getting messages by ticket ID
 */
export const useGetMessages = (ticketId: string | null, page: number = 1, limit: number = 50) => {
  return useQuery({
    queryKey: ['support', 'tickets', ticketId, 'messages', page, limit],
    queryFn: () => supportService.getMessagesByTicket(ticketId!, page, limit),
    enabled: !!ticketId,
  });
};

