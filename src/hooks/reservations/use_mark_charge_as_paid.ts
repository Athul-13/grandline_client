import { useState } from 'react';
import { adminReservationService } from '../../services/api/admin_reservation_service';
import type { ReservationChargeResponse } from '../../types/reservations/admin_reservation';

interface UseMarkChargeAsPaidReturn {
  markChargeAsPaid: (reservationId: string, chargeId: string) => Promise<ReservationChargeResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export const useMarkChargeAsPaid = (): UseMarkChargeAsPaidReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markChargeAsPaid = async (
    reservationId: string,
    chargeId: string
  ): Promise<ReservationChargeResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminReservationService.markChargeAsPaid(reservationId, chargeId);
      return response.charge;
    } catch (err) {
      console.error('Failed to mark charge as paid:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark charge as paid');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    markChargeAsPaid,
    isLoading,
    error,
  };
};

