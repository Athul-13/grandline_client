import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supportService } from '../../services/api/support_service';

/**
 * Hook for adding a message to a ticket
 */
export const useAddMessage = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ ticketId, content }: { ticketId: string; content: string }) =>
      supportService.addMessage(ticketId, content),
    onSuccess: (_, variables) => {
      // Invalidate messages for this ticket
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets', variables.ticketId, 'messages'] });
      // Invalidate ticket details to update lastMessageAt
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets', variables.ticketId] });
      // Invalidate tickets list to update lastMessageAt
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
    },
  });

  return {
    addMessage: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

