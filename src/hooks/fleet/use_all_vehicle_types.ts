import { useQuery } from '@tanstack/react-query';
import { vehicleTypeService } from '../../services/api/vehicle_type_service';
import { fleetQueryKeys } from '../../utils/fleet_query_keys';
import type { VehicleType } from '../../types/fleet/vehicle_type';

/**
 * Custom hook to fetch ALL vehicle types (no pagination)
 * Used for dropdowns and select components
 * 
 * @example
 * const { data: vehicleTypes, isLoading } = useAllVehicleTypes();
 * if (isLoading) return <Loading />;
 * return <Select options={vehicleTypes} />;
 */
export const useAllVehicleTypes = () => {
  return useQuery<VehicleType[]>({
    // Query key - unique for all vehicle types (no pagination)
    queryKey: fleetQueryKeys.vehicleTypes.allList(),

    // Query function - fetches all vehicle types
    queryFn: async () => {
      // Fetch with a large limit to get all vehicle types
      // Backend should handle this appropriately
      const response = await vehicleTypeService.getVehicleTypes({
        page: 1,
        limit: 1000, // Large limit to get all types
      });
      return response.data;
    },
    
    // Vehicle types don't change often, cache for longer
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

