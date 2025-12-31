import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supportService } from '../../services/api/support_service';
import type { CreateTicketRequest, CreateTicketResponse } from '../../types/support/ticket';

/**
 * Hook for creating a support ticket
 */
export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (request: CreateTicketRequest) => supportService.createTicket(request),
    onSuccess: () => {
      // Invalidate tickets list to refetch
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
    },
  });

  return {
    createTicket: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

