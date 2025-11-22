/**
 * Pricing Configuration Types
 * Types for admin pricing configuration management
 */

/**
 * Pricing Config Response
 * GET /api/v1/admin/pricing-config
 * GET /api/v1/admin/pricing-config/history
 * PUT /api/v1/admin/pricing-config/:id/activate
 */
export interface PricingConfigResponse {
  pricingConfigId: string;
  version: number;
  fuelPrice: number;
  averageDriverPerHourRate: number;
  taxPercentage: number;
  nightChargePerNight: number;
  isActive: boolean;
  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Create Pricing Config Request
 * POST /api/v1/admin/pricing-config
 */
export interface CreatePricingConfigRequest {
  fuelPrice: number; // min: 0
  averageDriverPerHourRate: number; // min: 0
  taxPercentage: number; // min: 0, max: 100
  nightChargePerNight: number; // min: 0
}

/**
 * Pricing Config History Response
 * GET /api/v1/admin/pricing-config/history
 */
export interface PricingConfigHistoryResponse {
  success: boolean;
  pricingConfigs: PricingConfigResponse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Pricing Config History Request Parameters
 */
export interface PricingConfigHistoryParams {
  page?: number;
  limit?: number;
}

