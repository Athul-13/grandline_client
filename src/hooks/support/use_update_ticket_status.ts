import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supportService } from '../../services/api/support_service';
import type { UpdateTicketStatusRequest, GetTicketByIdResponse } from '../../types/support/ticket';

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<GetTicketByIdResponse, Error, { ticketId: string; request: UpdateTicketStatusRequest }>({
    mutationFn: ({ ticketId, request }) => supportService.updateTicketStatus(ticketId, request),
    onSuccess: (data, variables) => {
      // Invalidate tickets list
      queryClient.invalidateQueries({ queryKey: ['admin', 'support', 'tickets'] });
      // Invalidate specific ticket
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets', variables.ticketId] });
    },
  });
};

