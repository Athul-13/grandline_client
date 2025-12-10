import { useState } from 'react';
import { adminReservationService } from '../../services/api/admin_reservation_service';
import type { UpdateReservationItineraryRequest } from '../../types/reservations/admin_reservation';
import type { AdminReservationDetailsResponse } from '../../types/reservations/admin_reservation';

interface UseUpdateItineraryReturn {
  updateItinerary: (id: string, data: UpdateReservationItineraryRequest) => Promise<AdminReservationDetailsResponse | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for updating reservation itinerary (admin only)
 */
export const useUpdateItinerary = (): UseUpdateItineraryReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateItinerary = async (
    id: string,
    data: UpdateReservationItineraryRequest
  ): Promise<AdminReservationDetailsResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminReservationService.updateItinerary(id, data);
      return response.reservation;
    } catch (err) {
      console.error('Failed to update itinerary:', err);
      setError(err instanceof Error ? err.message : 'Failed to update itinerary');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateItinerary,
    isLoading,
    error,
  };
};

