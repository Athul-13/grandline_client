import { useState } from 'react';
import { pricingConfigService } from '../../services/api/pricing_config_service';
import type { PricingConfigResponse } from '../../types/quotes/pricing_config';

interface UseActivatePricingConfigReturn {
  activatePricingConfig: (id: string) => Promise<PricingConfigResponse | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for activating pricing configuration
 */
export const useActivatePricingConfig = (): UseActivatePricingConfigReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activatePricingConfig = async (id: string): Promise<PricingConfigResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await pricingConfigService.activatePricingConfig(id);
      return response;
    } catch (err) {
      console.error('Failed to activate pricing config:', err);
      setError(err instanceof Error ? err.message : 'Failed to activate pricing configuration');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activatePricingConfig,
    isLoading,
    error,
  };
};

