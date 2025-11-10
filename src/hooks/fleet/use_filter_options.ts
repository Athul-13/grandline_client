import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../../services/api/vehicle_service';
import type { FilterOptionsResponse } from '../../types/fleet/filter';

/**
 * Custom hook to fetch vehicle filter options
 * Uses TanStack Query for automatic caching, refetching, and state management
 * 
 * @example
 * const { data: filterConfig, isLoading, error } = useFilterOptions();
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 * if (filterConfig) return <FilterDrawer filters={filterConfig.filters} />;
 */
export const useFilterOptions = () => {
  return useQuery<FilterOptionsResponse>({
    // Query key - unique identifier for this query
    queryKey: ['vehicleFilterOptions'],

    // Query function - fetches the data
    queryFn: async () => {
      return await vehicleService.getFilterOptions();
    },

    // Filter options don't change often, cache for longer
    staleTime: 1000 * 60 * 5, // 5 minutes

    // Keep data in cache for 10 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

