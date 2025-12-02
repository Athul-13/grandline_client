import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  CreateDriverRequest,
  CreateDriverResponse,
  AdminDriverListParams,
  AdminDriverListResponse,
  AdminDriverDetailsResponse,
  UpdateDriverRequest,
  UpdateDriverResponse,
} from '../../types/drivers/admin_driver';

/**
 * Driver Service
 */
export const driverService = {
  /**
   * Create a new driver (admin only)
   * POST /api/v1/admin/drivers
   */
  createDriver: async (data: CreateDriverRequest): Promise<CreateDriverResponse> => {
    const response = await grandlineAxiosClient.post<CreateDriverResponse>(
      API_ENDPOINTS.admin.drivers,
      data
    );
    return response.data;
  },

  /**
   * Get admin drivers list (with optional pagination, search, filters, and sorting)
   * GET /api/v1/admin/drivers?page=1&limit=20&status=available&status=offline&isOnboarded=true&search=john&sortBy=email&sortOrder=asc
   */
  getAdminDrivers: async (params?: AdminDriverListParams): Promise<AdminDriverListResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Handle array values (status filter)
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((v) => queryParams.append(key, String(v)));
          } else if (typeof value === 'boolean') {
            queryParams.append(key, String(value));
          } else if (typeof value === 'string' || typeof value === 'number') {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.admin.drivers}?${queryString}` : API_ENDPOINTS.admin.drivers;
    
    const response = await grandlineAxiosClient.get<AdminDriverListResponse>(url);
    return response.data;
  },

  /**
   * Get admin driver details by ID
   * GET /api/v1/admin/drivers/:driverId
   */
  getAdminDriverDetails: async (driverId: string): Promise<AdminDriverDetailsResponse> => {
    const response = await grandlineAxiosClient.get<AdminDriverDetailsResponse>(
      `${API_ENDPOINTS.admin.drivers}/${driverId}`
    );
    return response.data;
  },

  /**
   * Update driver details
   * PATCH /api/v1/admin/drivers/:driverId
   */
  updateDriver: async (driverId: string, data: UpdateDriverRequest): Promise<UpdateDriverResponse> => {
    const response = await grandlineAxiosClient.patch<UpdateDriverResponse>(
      `${API_ENDPOINTS.admin.drivers}/${driverId}`,
      data
    );
    return response.data;
  },
};

