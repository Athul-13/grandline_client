import { grandlineAxiosClient } from './axios_client';
import type {
  AdminTripsListResponse,
  AdminTripListParams,
} from '../../types/trips/admin_trip';

const API_ENDPOINTS = {
  trips: '/admin/trips',
  activeTripLocations: '/admin/trips/active/locations',
} as const;

/**
 * Admin Trip Service
 * Handles admin trip-related API calls
 */
export const adminTripService = {
  /**
   * Get all trips for admin (with optional pagination and filters)
   * GET /api/v1/admin/trips?page=1&limit=20&state=CURRENT&search=...
   */
  getTrips: async (params?: AdminTripListParams): Promise<AdminTripsListResponse> => {
    const queryParams: Record<string, string> = {};

    if (params?.page) queryParams.page = params.page.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.state) queryParams.state = params.state;
    if (params?.search) queryParams.search = params.search;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;

    const queryString = new URLSearchParams(queryParams).toString();
    const url = queryString ? `${API_ENDPOINTS.trips}?${queryString}` : API_ENDPOINTS.trips;

    const response = await grandlineAxiosClient.get<AdminTripsListResponse>(url);
    return response.data;
  },

  /**
   * Get active trip locations (for map rehydration)
   * GET /api/v1/admin/trips/active/locations
   */
  getActiveTripLocations: async (): Promise<{
    locations: Array<{
      reservationId: string;
      driverId: string;
      latitude: number;
      longitude: number;
      accuracy?: number;
      heading?: number;
      speed?: number;
      timestamp: string;
    }>;
  }> => {
    const response = await grandlineAxiosClient.get<{
      locations: Array<{
        reservationId: string;
        driverId: string;
        latitude: number;
        longitude: number;
        accuracy?: number;
        heading?: number;
        speed?: number;
        timestamp: string;
      }>;
    }>(API_ENDPOINTS.activeTripLocations);
    return response.data;
  },
};

