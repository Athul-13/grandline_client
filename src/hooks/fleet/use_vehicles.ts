import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../../services/api/vehicle_service';
import { fleetQueryKeys } from '../../utils/fleet_query_keys';
import type { Vehicle, PaginationParams, PaginationMeta } from '../../types/fleet/vehicle';

/**
 * Custom hook to fetch vehicles with pagination and filters
 * Uses TanStack Query for automatic caching, refetching, and state management
 * 
 * @example
 * const { data, pagination, isLoading } = useVehicles({ page: 1, limit: 20, status: 'available' });
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 * if (data) return <VehicleList vehicles={data} />;
 */
export const useVehicles = (params?: PaginationParams & Record<string, unknown>) => {
  return useQuery<{
    data: Vehicle[];
    pagination: PaginationMeta;
  }>({
    // Query key - includes pagination and filter params for proper caching
    // Use query key factory for consistent keys
    queryKey: fleetQueryKeys.vehicles.list(params),
    
    // Query function - fetches the data
    queryFn: async () => {
      const response = await vehicleService.getVehicles(params);
      return {
        data: response.data,
        pagination: response.pagination,
      };
    },
    // Keep previous data while fetching new page (smooth transitions)
    placeholderData: (previousData) => previousData,
  });
};

