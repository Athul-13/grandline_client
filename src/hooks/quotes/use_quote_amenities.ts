import { useEffect, useState } from 'react';
import { amenityService } from '../../services/api/amenity_service';
import type { Amenity } from '../../types/fleet/amenity';

/**
 * Hook to fetch amenity details for selected amenities in a quote
 */
export const useQuoteAmenities = (selectedAmenityIds?: string[]) => {
  const [amenities, setAmenities] = useState<Record<string, Amenity>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAmenities = async () => {
      if (!selectedAmenityIds || selectedAmenityIds.length === 0) {
        setAmenities({});
        return;
      }

      setIsLoading(true);
      const amenityMap: Record<string, Amenity> = {};

      try {
        await Promise.all(
          selectedAmenityIds.map(async (amenityId) => {
            try {
              const response = await amenityService.getAmenityById(amenityId);
              amenityMap[amenityId] = response.amenity;
            } catch (err) {
              console.error(`Failed to fetch amenity ${amenityId}:`, err);
            }
          })
        );
        setAmenities(amenityMap);
      } catch (err) {
        console.error('Failed to fetch amenities:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAmenities();
  }, [selectedAmenityIds]);

  return { amenities, isLoading };
};

