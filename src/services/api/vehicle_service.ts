import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type { FilterOptionsResponse } from '../../types/fleet/filter';

/**
 * Vehicle Service
 * Handles vehicle-related API calls
 */
export const vehicleService = {
  /**
   * Get filter options for vehicles
   * GET /api/v1/vehicles/filter-options
   */
  getFilterOptions: async (): Promise<FilterOptionsResponse> => {
    const response = await grandlineAxiosClient.get<FilterOptionsResponse>(
      API_ENDPOINTS.fleet.filterOptions
    );
    return response.data;
  },
};

