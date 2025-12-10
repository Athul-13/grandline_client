import { useState } from 'react';
import { adminReservationService } from '../../services/api/admin_reservation_service';
import type { ChangeReservationDriverRequest } from '../../types/reservations/admin_reservation';
import type { AdminReservationDetailsResponse } from '../../types/reservations/admin_reservation';

interface UseChangeDriverReturn {
  changeDriver: (id: string, data: ChangeReservationDriverRequest) => Promise<AdminReservationDetailsResponse | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for changing reservation driver (admin only)
 */
export const useChangeDriver = (): UseChangeDriverReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeDriver = async (
    id: string,
    data: ChangeReservationDriverRequest
  ): Promise<AdminReservationDetailsResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminReservationService.changeDriver(id, data);
      return response.reservation;
    } catch (err) {
      console.error('Failed to change driver:', err);
      setError(err instanceof Error ? err.message : 'Failed to change driver');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changeDriver,
    isLoading,
    error,
  };
};

