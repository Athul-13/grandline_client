import { useState } from 'react';
import { adminReservationService } from '../../services/api/admin_reservation_service';
import type { CancelReservationRequest } from '../../types/reservations/admin_reservation';
import type { AdminReservationDetailsResponse } from '../../types/reservations/admin_reservation';

interface UseCancelReservationReturn {
  cancelReservation: (id: string, data: CancelReservationRequest) => Promise<AdminReservationDetailsResponse | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for cancelling reservation (admin only)
 */
export const useCancelReservation = (): UseCancelReservationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelReservation = async (
    id: string,
    data: CancelReservationRequest
  ): Promise<AdminReservationDetailsResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminReservationService.cancelReservation(id, data);
      return response.reservation;
    } catch (err) {
      console.error('Failed to cancel reservation:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel reservation');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cancelReservation,
    isLoading,
    error,
  };
};

