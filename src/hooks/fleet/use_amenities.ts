import { useQuery } from '@tanstack/react-query';
import { amenityService } from '../../services/api/amenity_service';
import { fleetQueryKeys } from '../../utils/fleet_query_keys';
import type { Amenity, PaginationParams, PaginationMeta } from '../../types/fleet/amenity';

/**
 * Custom hook to fetch amenities with pagination
 * Uses TanStack Query for automatic caching, refetching, and state management
 * 
 * @example
 * const { data, pagination, isLoading } = useAmenities({ page: 1, limit: 20 });
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 * if (data) return <AmenityList amenities={data} />;
 */
export const useAmenities = (params?: PaginationParams) => {
  return useQuery<{
    data: Amenity[];
    pagination: PaginationMeta;
  }>({
    // Query key - includes pagination params for proper caching
    queryKey: fleetQueryKeys.amenities.list(params),

    // Query function - fetches the data
    queryFn: async () => {
      const response = await amenityService.getAmenities(params);
      return {
        data: response.data,
        pagination: response.pagination,
      };
    },
    // Keep previous data while fetching new page (smooth transitions)
    placeholderData: (previousData) => previousData,
  });
};

