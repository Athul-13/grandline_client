import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  PricingConfigResponse,
  CreatePricingConfigRequest,
  PricingConfigHistoryResponse,
  PricingConfigHistoryParams,
} from '../../types/quotes/pricing_config';

/**
 * Pricing Config Service
 * Handles pricing configuration API calls
 */
export const pricingConfigService = {
  /**
   * Get active pricing configuration
   * GET /api/v1/admin/pricing-config
   */
  getActivePricingConfig: async (): Promise<PricingConfigResponse> => {
    const response = await grandlineAxiosClient.get<PricingConfigResponse>(
      API_ENDPOINTS.admin.pricingConfig.active
    );
    return response.data;
  },

  /**
   * Create new pricing configuration
   * POST /api/v1/admin/pricing-config
   */
  createPricingConfig: async (
    data: CreatePricingConfigRequest
  ): Promise<PricingConfigResponse> => {
    const response = await grandlineAxiosClient.post<PricingConfigResponse>(
      API_ENDPOINTS.admin.pricingConfig.create,
      data
    );
    return response.data;
  },

  /**
   * Get pricing configuration history
   * GET /api/v1/admin/pricing-config/history?page=1&limit=15
   */
  getPricingConfigHistory: async (
    params?: PricingConfigHistoryParams
  ): Promise<PricingConfigHistoryResponse> => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_ENDPOINTS.admin.pricingConfig.history}?${queryString}`
      : API_ENDPOINTS.admin.pricingConfig.history;

    const response = await grandlineAxiosClient.get<PricingConfigHistoryResponse>(url);
    return response.data;
  },

  /**
   * Activate pricing configuration
   * PUT /api/v1/admin/pricing-config/:id/activate
   */
  activatePricingConfig: async (id: string): Promise<PricingConfigResponse> => {
    const response = await grandlineAxiosClient.put<PricingConfigResponse>(
      API_ENDPOINTS.admin.pricingConfig.activate(id)
    );
    return response.data;
  },
};

