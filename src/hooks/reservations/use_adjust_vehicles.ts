import { useState } from 'react';
import { adminReservationService } from '../../services/api/admin_reservation_service';
import type { AdjustReservationVehiclesRequest } from '../../types/reservations/admin_reservation';
import type { AdminReservationDetailsResponse } from '../../types/reservations/admin_reservation';

interface UseAdjustVehiclesReturn {
  adjustVehicles: (id: string, data: AdjustReservationVehiclesRequest) => Promise<AdminReservationDetailsResponse | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for adjusting reservation vehicles (admin only)
 */
export const useAdjustVehicles = (): UseAdjustVehiclesReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adjustVehicles = async (
    id: string,
    data: AdjustReservationVehiclesRequest
  ): Promise<AdminReservationDetailsResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminReservationService.adjustVehicles(id, data);
      return response.reservation;
    } catch (err) {
      console.error('Failed to adjust vehicles:', err);
      setError(err instanceof Error ? err.message : 'Failed to adjust vehicles');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    adjustVehicles,
    isLoading,
    error,
  };
};

