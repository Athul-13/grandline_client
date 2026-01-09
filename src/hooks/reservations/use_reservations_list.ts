import { useState, useEffect, useCallback } from 'react';
import { reservationService } from '../../services/api/reservation_service';
import type { ReservationListItem, PaginationMeta } from '../../types/reservations/reservation';

interface UseReservationsListParams {
  page?: number;
  limit?: number;
}

interface UseReservationsListReturn {
  reservations: ReservationListItem[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing reservations list
 */
export const useReservationsList = (params?: UseReservationsListParams): UseReservationsListReturn => {
  const [reservations, setReservations] = useState<ReservationListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TypeScript infers ReservationListResponse from function overload (forDropdown is not set)
      const response = await reservationService.getReservations({
        page: params?.page || 1,
        limit: params?.limit || 15,
      });
      
      // Sort by reservation date (newest first)
      const sortedReservations = [...response.reservations].sort((a, b) => {
        const dateA = new Date(a.reservationDate).getTime();
        const dateB = new Date(b.reservationDate).getTime();
        return dateB - dateA; // Newest first (descending)
      });
      
      setReservations(sortedReservations);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reservations');
      setReservations([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [params?.page, params?.limit]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return {
    reservations,
    pagination,
    isLoading,
    error,
    refetch: fetchReservations,
  };
};

