import { useState, useEffect, useCallback } from 'react';
import { driverService } from '../../services/api/driver_service';
import type { AdminDriverDetailsResponse } from '../../types/drivers/admin_driver';

interface UseAdminDriverDetailsReturn {
  driverDetails: AdminDriverDetailsResponse['driver'] | null;
  stats: AdminDriverDetailsResponse['stats'] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching admin driver details
 */
export const useAdminDriverDetails = (driverId: string): UseAdminDriverDetailsReturn => {
  const [driverDetails, setDriverDetails] = useState<AdminDriverDetailsResponse['driver'] | null>(null);
  const [stats, setStats] = useState<AdminDriverDetailsResponse['stats'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDriverDetails = useCallback(async () => {
    if (!driverId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await driverService.getAdminDriverDetails(driverId);
      
      // Handle response structure - driver and stats are at top level
      if (response && response.success && response.driver) {
        setDriverDetails(response.driver);
        setStats(response.stats || null);
      } else {
        console.error('Unexpected response structure:', response);
        setError('Unexpected response format from server');
        setDriverDetails(null);
        setStats(null);
      }
    } catch (err) {
      console.error('Failed to fetch driver details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch driver details');
      setDriverDetails(null);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [driverId]);

  useEffect(() => {
    fetchDriverDetails();
  }, [fetchDriverDetails]);

  return {
    driverDetails,
    stats,
    isLoading,
    error,
    refetch: fetchDriverDetails,
  };
};

