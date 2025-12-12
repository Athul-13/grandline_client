import { useState, useEffect, useCallback } from 'react';
import { reservationService } from '../../services/api/reservation_service';
import type { ReservationResponse } from '../../types/reservations/reservation';

interface UseReservationDetailsReturn {
  reservationDetails: ReservationResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching user reservation details
 */
export const useReservationDetails = (reservationId: string): UseReservationDetailsReturn => {
  const [reservationDetails, setReservationDetails] = useState<ReservationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservationDetails = useCallback(async () => {
    if (!reservationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await reservationService.getReservationById(reservationId);
      setReservationDetails(response);
    } catch (err) {
      console.error('Failed to fetch reservation details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reservation details');
      setReservationDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [reservationId]);

  useEffect(() => {
    fetchReservationDetails();
  }, [fetchReservationDetails]);

  return {
    reservationDetails,
    isLoading,
    error,
    refetch: fetchReservationDetails,
  };
};

