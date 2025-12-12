import { useState } from 'react';
import { adminReservationService } from '../../services/api/admin_reservation_service';
import type { AddReservationChargeRequest, ReservationChargeResponse } from '../../types/reservations/admin_reservation';

interface UseAddChargeReturn {
  addCharge: (id: string, data: AddReservationChargeRequest) => Promise<ReservationChargeResponse | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for adding charge to reservation (admin only)
 */
export const useAddCharge = (): UseAddChargeReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCharge = async (
    id: string,
    data: AddReservationChargeRequest
  ): Promise<ReservationChargeResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminReservationService.addCharge(id, data);
      return response.charge;
    } catch (err) {
      console.error('Failed to add charge:', err);
      setError(err instanceof Error ? err.message : 'Failed to add charge');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addCharge,
    isLoading,
    error,
  };
};

