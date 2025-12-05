/**
 * Pricing Types
 * Types for pricing calculations and breakdowns
 */

/**
 * Pricing Breakdown
 */
export interface PricingBreakdown {
  fuelPriceAtTime: number;
  averageDriverRateAtTime: number;
  actualDriverRate?: number;
  taxPercentageAtTime: number;
  baseFare: number;
  distanceFare: number;
  driverCharge: number;
  fuelMaintenance: number;
  nightCharge: number;
  stayingCharge: number;
  amenitiesTotal: number;
  subtotal: number;
  tax: number;
  total: number;
}

/**
 * Calculate Pricing Response
 * POST /api/v1/quotes/:id/calculate-pricing
 */
export interface CalculatePricingResponse {
  pricing: PricingBreakdown;
}

