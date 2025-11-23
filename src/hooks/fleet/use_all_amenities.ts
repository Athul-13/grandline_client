import { useQuery } from '@tanstack/react-query';
import { amenityService } from '../../services/api/amenity_service';
import { fleetQueryKeys } from '../../utils/fleet_query_keys';
import type { Amenity } from '../../types/fleet/amenity';

/**
 * Custom hook to fetch ALL amenities (no pagination)
 * Used for dropdowns and select components
 * 
 * @example
 * const { data: amenities, isLoading } = useAllAmenities();
 * if (isLoading) return <Loading />;
 * return <Select options={amenities} />;
 */
export const useAllAmenities = () => {
  return useQuery<Amenity[]>({
    // Query key - unique for all amenities (no pagination)
    queryKey: fleetQueryKeys.amenities.allList(),

    // Query function - fetches all amenities
    queryFn: async () => {
      // Fetch with a large limit to get all amenities
      // Backend should handle this appropriately
      const response = await amenityService.getAmenities({
        page: 1,
        limit: 1000, // Large limit to get all amenities
      });
      return response.data;
    },
    
    // Amenities don't change often, cache for longer
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

