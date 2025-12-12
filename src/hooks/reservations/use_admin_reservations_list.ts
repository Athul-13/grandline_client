import { useState, useEffect, useCallback } from 'react';
import { adminReservationService } from '../../services/api/admin_reservation_service';
import type { AdminReservationListItem } from '../../types/reservations/admin_reservation';
import type { ReservationStatusType } from '../../types/reservations/reservation';

interface UseAdminReservationsListParams {
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
  search?: string;
  status?: ReservationStatusType[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UseAdminReservationsListReturn {
  reservations: AdminReservationListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing admin reservations list
 */
export const useAdminReservationsList = (params?: UseAdminReservationsListParams): UseAdminReservationsListReturn => {
  const [reservations, setReservations] = useState<AdminReservationListItem[]>([]);
  const [pagination, setPagination] = useState<UseAdminReservationsListReturn['pagination']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await adminReservationService.getReservations({
        page: params?.page || 1,
        limit: params?.limit || 20,
        includeDeleted: params?.includeDeleted || false,
        search: params?.search?.trim(),
        status: params?.status && params.status.length > 0 ? params.status : undefined,
        sortBy: params?.sortBy,
        sortOrder: params?.sortOrder,
      });
      
      setReservations(response.reservations);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch admin reservations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reservations');
      setReservations([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    params?.page,
    params?.limit,
    params?.includeDeleted,
    params?.search,
    params?.status,
    params?.sortBy,
    params?.sortOrder,
  ]);

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

