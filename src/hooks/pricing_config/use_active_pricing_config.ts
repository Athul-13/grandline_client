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
      // Check if error is "no active config" - this is a valid state, not an error
      let errorMessage = '';
      let errorCode = '';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        errorMessage = ('message' in err && typeof err.message === 'string') ? err.message : String(err);
        errorCode = ('code' in err && typeof err.code === 'string') ? err.code : '';
      } else {
        errorMessage = String(err);
      }

      const isNoActiveConfig = 
        errorMessage.includes('No active pricing configuration found') ||
        errorMessage.includes('not found') ||
        errorCode === 'NOT_FOUND';

      if (isNoActiveConfig) {
        // No active config is a valid state - set to null without error
        setPricingConfig(null);
        setError(null);
      } else {
        // Actual error (network, server, etc.)
        console.error('Failed to fetch active pricing config:', err);
        setError(errorMessage || 'Failed to fetch active pricing configuration');
        setPricingConfig(null);
      }
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

