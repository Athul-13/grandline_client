import { useState, useEffect } from 'react';
import { amenityService } from '../../services/api/amenity_service';

interface Amenity {
  amenityId: string;
  name: string;
  icon?: string;
}

/**
 * Hook for fetching amenities for a reservation
 */
export const useReservationAmenities = (
  selectedAmenities?: string[]
): { amenities: Amenity[]; isLoading: boolean } => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAmenities = async () => {
      if (!selectedAmenities || selectedAmenities.length === 0) {
        setAmenities([]);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedAmenities = await Promise.all(
          selectedAmenities.map(async (amenityId) => {
            try {
              const amenity = await amenityService.getAmenityById(amenityId);
              return {
                amenityId: amenity.amenityId,
                name: amenity.name,
                icon: amenity.icon,
              };
            } catch (error) {
              console.error(`Failed to fetch amenity ${amenityId}:`, error);
              return {
                amenityId,
                name: 'Unknown Amenity',
              };
            }
          })
        );
        setAmenities(fetchedAmenities);
      } catch (error) {
        console.error('Failed to fetch amenities:', error);
        setAmenities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAmenities();
  }, [selectedAmenities]);

  return { amenities, isLoading };
};

