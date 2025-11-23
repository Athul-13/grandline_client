import { useState } from 'react';
import { pricingConfigService } from '../../services/api/pricing_config_service';
import type { PricingConfigResponse, CreatePricingConfigRequest } from '../../types/quotes/pricing_config';

interface UseCreatePricingConfigReturn {
  createPricingConfig: (data: CreatePricingConfigRequest) => Promise<PricingConfigResponse | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for creating new pricing configuration
 */
export const useCreatePricingConfig = (): UseCreatePricingConfigReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPricingConfig = async (
    data: CreatePricingConfigRequest
  ): Promise<PricingConfigResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await pricingConfigService.createPricingConfig(data);
      return response;
    } catch (err) {
      console.error('Failed to create pricing config:', err);
      setError(err instanceof Error ? err.message : 'Failed to create pricing configuration');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPricingConfig,
    isLoading,
    error,
  };
};

