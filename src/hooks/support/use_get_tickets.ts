import { useQuery } from '@tanstack/react-query';
import { supportService } from '../../services/api/support_service';
import type { ActorTypeType } from '../../types/support/ticket';

/**
 * Hook for getting tickets by actor
 */
export const useGetTickets = (actorType: ActorTypeType) => {
  return useQuery({
    queryKey: ['support', 'tickets', actorType],
    queryFn: () => supportService.getTicketsByActor(actorType),
    enabled: !!actorType,
  });
};

