import { useQuery } from '@tanstack/react-query';
import { vehicleTypeService } from '../../services/api/vehicle_type_service';
import type { VehicleType } from '../../types/fleet/vehicle_type';

/**
 * Custom hook to fetch all vehicle types
 * Uses TanStack Query for automatic caching, refetching, and state management
 * 
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 * if (vehicleTypes) return <VehicleTypeList types={vehicleTypes} />;
 */
export const useVehicleTypes = () => {
  return useQuery<VehicleType[]>({
    // Query key - unique identifier for this query
    queryKey: ['vehicleTypes'],

    // Query function - fetches the data
    queryFn: async () => {
      return await vehicleTypeService.getVehicleTypes();
    },
  });
};

