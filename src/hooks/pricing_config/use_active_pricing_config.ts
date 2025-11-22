import { useState, useEffect, useCallback } from 'react';
import { pricingConfigService } from '../../services/api/pricing_config_service';
import type { PricingConfigResponse } from '../../types/quotes/pricing_config';

interface UseActivePricingConfigReturn {
  pricingConfig: PricingConfigResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching active pricing configuration
 */
export const useActivePricingConfig = (enabled: boolean = true): UseActivePricingConfigReturn => {
  const [pricingConfig, setPricingConfig] = useState<PricingConfigResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const config = await pricingConfigService.getActivePricingConfig();
      setPricingConfig(config);
    } catch (err) {
      console.error('Failed to fetch active pricing config:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch active pricing configuration');
      setPricingConfig(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchActiveConfig();
    }
  }, [enabled, fetchActiveConfig]);

  return {
    pricingConfig,
    isLoading,
    error,
    refetch: fetchActiveConfig,
  };
};

