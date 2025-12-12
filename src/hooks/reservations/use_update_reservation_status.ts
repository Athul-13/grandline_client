import { useState } from 'react';
import { adminReservationService } from '../../services/api/admin_reservation_service';
import type { UpdateReservationStatusRequest } from '../../types/reservations/admin_reservation';
import type { AdminReservationDetailsResponse } from '../../types/reservations/admin_reservation';

interface UseUpdateReservationStatusReturn {
  updateStatus: (id: string, data: UpdateReservationStatusRequest) => Promise<AdminReservationDetailsResponse | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for updating reservation status (admin only)
 */
export const useUpdateReservationStatus = (): UseUpdateReservationStatusReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (
    id: string,
    data: UpdateReservationStatusRequest
  ): Promise<AdminReservationDetailsResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminReservationService.updateStatus(id, data);
      return response.reservation;
    } catch (err) {
      console.error('Failed to update reservation status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update reservation status');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateStatus,
    isLoading,
    error,
  };
};

