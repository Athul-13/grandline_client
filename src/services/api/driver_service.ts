import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type { CreateDriverRequest, CreateDriverResponse } from '../../types/drivers/admin_driver';

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
};

