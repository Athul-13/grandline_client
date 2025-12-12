import { useState } from 'react';
import { adminReservationService } from '../../services/api/admin_reservation_service';
import type { AddPassengersToReservationRequest } from '../../types/reservations/admin_reservation';
import type { AdminReservationDetailsResponse } from '../../types/reservations/admin_reservation';

interface UseAddPassengersReturn {
  addPassengers: (id: string, data: AddPassengersToReservationRequest) => Promise<AdminReservationDetailsResponse | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for adding passengers to reservation (admin only)
 */
export const useAddPassengers = (): UseAddPassengersReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPassengers = async (
    id: string,
    data: AddPassengersToReservationRequest
  ): Promise<AdminReservationDetailsResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminReservationService.addPassengers(id, data);
      return response.reservation;
    } catch (err) {
      console.error('Failed to add passengers:', err);
      setError(err instanceof Error ? err.message : 'Failed to add passengers');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addPassengers,
    isLoading,
    error,
  };
};

