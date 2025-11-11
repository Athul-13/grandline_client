import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../../services/api/vehicle_service';
import type { Vehicle, PaginationParams, PaginationMeta } from '../../types/fleet/vehicle';

/**
 * Serialize query params to a stable string for use in query keys
 * Ensures consistent cache keys regardless of object key order
 */
const serializeParams = (params?: PaginationParams & Record<string, unknown>): string => {
  if (!params) return '';
  
  // Sort keys to ensure consistent serialization
  const sortedKeys = Object.keys(params).sort();
  const serialized = sortedKeys
    .map((key) => {
      const value = params[key];
      if (value === undefined || value === null || value === '') {
        return null;
      }
      if (Array.isArray(value)) {
        return `${key}=${value.sort().join(',')}`;
      }
      return `${key}=${String(value)}`;
    })
    .filter((item) => item !== null)
    .join('&');
  
  return serialized;
};

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
    // Use serialized params to ensure stable cache keys
    queryKey: ['vehicles', serializeParams(params)],
    
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

