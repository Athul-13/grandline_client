import { useState, useEffect, useCallback } from 'react';
import { pricingConfigService } from '../../services/api/pricing_config_service';
import type { PricingConfigResponse, PricingConfigHistoryParams } from '../../types/quotes/pricing_config';
import type { PaginationMeta } from '../../types/quotes/quote';

interface UsePricingConfigHistoryParams {
  page?: number;
  limit?: number;
}

interface UsePricingConfigHistoryReturn {
  pricingConfigs: PricingConfigResponse[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}


/**
 * Hook for fetching pricing configuration history
 */
export const usePricingConfigHistory = (
  params?: UsePricingConfigHistoryParams
): UsePricingConfigHistoryReturn => {
  const [pricingConfigs, setPricingConfigs] = useState<PricingConfigResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const requestParams: PricingConfigHistoryParams = {
        page: params?.page || 1,
        limit: params?.limit || 15,
      };

      const response = await pricingConfigService.getPricingConfigHistory(requestParams);
      setPricingConfigs(response.pricingConfigs);
      
      // If API returns pagination, use it; otherwise create default
      if ('pagination' in response && response.pagination) {
        setPagination(response.pagination);
      } else {
        // Default pagination if not provided
        const defaultPagination: PaginationMeta = {
          page: params?.page || 1,
          limit: params?.limit || 15,
          total: response.pricingConfigs.length,
          totalPages: 1,
        };
        setPagination(defaultPagination);
      }
    } catch (err) {
      console.error('Failed to fetch pricing config history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pricing configuration history');
      setPricingConfigs([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [params?.page, params?.limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    pricingConfigs,
    pagination,
    isLoading,
    error,
    refetch: fetchHistory,
  };
};

