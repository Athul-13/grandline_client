import { useState, useEffect, useCallback } from 'react';
import { amenityService } from '../../services/api/amenity_service';
import type { Amenity } from '../../types/fleet/amenity';

/**
 * Hook for fetching paid amenities
 */
export const usePaidAmenities = (enabled: boolean = true) => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch paid amenities
   */
  const fetchPaidAmenities = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all paid amenities (with high limit to get all)
      const response = await amenityService.getPaidAmenities({
        page: 1,
        limit: 100,
      });

      // Extract data array from response
      const amenitiesData = response.data || [];
      setAmenities(amenitiesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch paid amenities';
      setError(errorMessage);
      setAmenities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Auto-fetch when enabled
   */
  useEffect(() => {
    if (enabled) {
      fetchPaidAmenities();
    }
  }, [enabled, fetchPaidAmenities]);

  return {
    amenities,
    isLoading,
    error,
    refetch: fetchPaidAmenities,
  };
};

