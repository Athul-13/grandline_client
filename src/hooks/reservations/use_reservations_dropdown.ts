import { useQuery } from '@tanstack/react-query';
import { reservationService } from '../../services/api/reservation_service';

/**
 * Hook for getting reservations for dropdown (minimal data)
 */
export const useReservationsDropdown = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['reservations', 'dropdown'],
    queryFn: async () => {
      const response = await reservationService.getReservations({ forDropdown: true });
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

