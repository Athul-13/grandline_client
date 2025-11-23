/**
 * Query Key Factory for Fleet-Related Queries
 * Provides type-safe, consistent query keys for TanStack Query
 * 
 * @example
 * // Use in queries:
 * queryKey: fleetQueryKeys.vehicles.list({ page: 1, limit: 20 })
 * 
 * // Use in mutations:
 * queryClient.invalidateQueries({ queryKey: fleetQueryKeys.vehicles.all() })
 */

import type { PaginationParams } from '../types/fleet/vehicle';
import type { PaginationParams as AmenityPaginationParams } from '../types/fleet/amenity';
import type { PaginationParams as VehicleTypePaginationParams } from '../types/fleet/vehicle_type';

/**
 * Serialize query params to a stable string for use in query keys
 */
const serializeParams = (params?: Record<string, unknown>): string => {
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

export const fleetQueryKeys = {
  /**
   * Base key for all fleet queries
   */
  all: ['fleet'] as const,

  /**
   * Vehicle-related query keys
   */
  vehicles: {
    all: () => [...fleetQueryKeys.all, 'vehicles'] as const,
    lists: () => [...fleetQueryKeys.vehicles.all(), 'list'] as const,
    list: (params?: PaginationParams & Record<string, unknown>) =>
      [...fleetQueryKeys.vehicles.lists(), serializeParams(params)] as const,
    details: () => [...fleetQueryKeys.vehicles.all(), 'detail'] as const,
    detail: (id: string) => [...fleetQueryKeys.vehicles.details(), id] as const,
  },

  /**
   * Vehicle Type-related query keys
   */
  vehicleTypes: {
    all: () => [...fleetQueryKeys.all, 'vehicleTypes'] as const,
    lists: () => [...fleetQueryKeys.vehicleTypes.all(), 'list'] as const,
    list: (params?: VehicleTypePaginationParams) =>
      [...fleetQueryKeys.vehicleTypes.lists(), params?.page, params?.limit] as const,
    details: () => [...fleetQueryKeys.vehicleTypes.all(), 'detail'] as const,
    detail: (id: string) => [...fleetQueryKeys.vehicleTypes.details(), id] as const,
    /**
     * All vehicle types (non-paginated) - used in forms
     */
    allList: () => [...fleetQueryKeys.vehicleTypes.all(), 'all'] as const,
  },

  /**
   * Amenity-related query keys
   */
  amenities: {
    all: () => [...fleetQueryKeys.all, 'amenities'] as const,
    lists: () => [...fleetQueryKeys.amenities.all(), 'list'] as const,
    list: (params?: AmenityPaginationParams) =>
      [...fleetQueryKeys.amenities.lists(), params?.page, params?.limit] as const,
    details: () => [...fleetQueryKeys.amenities.all(), 'detail'] as const,
    detail: (id: string) => [...fleetQueryKeys.amenities.details(), id] as const,
    /**
     * All amenities (non-paginated) - used in forms
     */
    allList: () => [...fleetQueryKeys.amenities.all(), 'all'] as const,
  },

  /**
   * Filter options query key
   */
  filterOptions: () => [...fleetQueryKeys.all, 'filterOptions'] as const,
} as const;

