import { useQuery } from '@tanstack/react-query';
import { vehicleTypeService } from '../../services/api/vehicle_type_service';
import type { VehicleType, PaginationParams, PaginationMeta } from '../../types/fleet/vehicle_type';

/**
 * Custom hook to fetch vehicle types with pagination
 * Uses TanStack Query for automatic caching, refetching, and state management
 * 
 * @example
 * const { data, pagination, isLoading } = useVehicleTypes({ page: 1, limit: 20 });
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 * if (data) return <VehicleTypeList types={data} />;
 */
export const useVehicleTypes = (params?: PaginationParams) => {
  return useQuery<{
    data: VehicleType[];
    pagination: PaginationMeta;
  }>({
    // Query key - includes pagination params for proper caching
    queryKey: ['vehicleTypes', params?.page, params?.limit],

    // Query function - fetches the data
    queryFn: async () => {
      const response = await vehicleTypeService.getVehicleTypes(params);
      return {
        data: response.data,
        pagination: response.pagination,
      };
    },
    // Keep previous data while fetching new page (smooth transitions)
    placeholderData: (previousData) => previousData,
  });
};

