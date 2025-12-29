import { useState, useEffect, useCallback } from 'react';
import { adminTripService } from '../../services/api/admin_trip_service';
import type { AdminTripListItem, AdminTripListParams } from '../../types/trips/admin_trip';

interface UseAdminTripsListParams {
  page?: number;
  limit?: number;
  state?: 'UPCOMING' | 'CURRENT' | 'PAST';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UseAdminTripsListReturn {
  trips: AdminTripListItem[];
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
 * Hook for fetching and managing admin trips list
 */
export const useAdminTripsList = (params?: UseAdminTripsListParams): UseAdminTripsListReturn => {
  const [trips, setTrips] = useState<AdminTripListItem[]>([]);
  const [pagination, setPagination] = useState<UseAdminTripsListReturn['pagination']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const requestParams: AdminTripListParams = {
        page: params?.page || 1,
        limit: params?.limit || 20,
      };

      // Add state filter if provided
      if (params?.state) {
        requestParams.state = params.state;
      }

      // Add search parameter if provided
      if (params?.search && params.search.trim()) {
        requestParams.search = params.search.trim();
      }

      // Add sorting parameters if provided
      if (params?.sortBy) {
        requestParams.sortBy = params.sortBy;
      }
      if (params?.sortOrder) {
        requestParams.sortOrder = params.sortOrder;
      }

      const response = await adminTripService.getTrips(requestParams);
      
      setTrips(response.trips);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch admin trips:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch trips');
      setTrips([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    params?.page,
    params?.limit,
    params?.state,
    params?.search,
    params?.sortBy,
    params?.sortOrder,
  ]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return {
    trips,
    pagination,
    isLoading,
    error,
    refetch: fetchTrips,
  };
};
