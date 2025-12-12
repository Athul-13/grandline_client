import { useState, useEffect, useCallback } from 'react';
import { adminReservationService } from '../../services/api/admin_reservation_service';
import type { AdminReservationDetailsResponse } from '../../types/reservations/admin_reservation';

interface UseAdminReservationDetailsReturn {
  reservationDetails: AdminReservationDetailsResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching admin reservation details
 */
export const useAdminReservationDetails = (reservationId: string): UseAdminReservationDetailsReturn => {
  const [reservationDetails, setReservationDetails] = useState<AdminReservationDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservationDetails = useCallback(async () => {
    if (!reservationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await adminReservationService.getReservationById(reservationId);
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

