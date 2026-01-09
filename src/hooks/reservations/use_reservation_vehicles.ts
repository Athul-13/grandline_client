import { useState, useEffect } from 'react';
import { vehicleService } from '../../services/api/vehicle_service';
import type { SelectedVehicle } from '../../types/reservations/reservation';

interface Vehicle {
  vehicleId: string;
  name: string;
  capacity: number;
  imageUrl?: string;
}

/**
 * Hook for fetching vehicles for a reservation
 */
export const useReservationVehicles = (
  selectedVehicles?: SelectedVehicle[]
): { vehicles: Vehicle[]; isLoading: boolean } => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!selectedVehicles || selectedVehicles.length === 0) {
        setVehicles([]);
        return;
      }

      setIsLoading(true);
      try {
        const vehicleIds = selectedVehicles.map((sv) => sv.vehicleId);
        const fetchedVehicles = await Promise.all(
          vehicleIds.map(async (vehicleId) => {
            try {
              const vehicle = await vehicleService.getVehicleById(vehicleId);
              return {
                vehicleId: vehicle.vehicleId,
                name: vehicle.vehicleModel + ' ' + vehicle.year,
                capacity: vehicle.capacity,
                imageUrl: vehicle.imageUrls?.[0],
              };
            } catch (error) {
              console.error(`Failed to fetch vehicle ${vehicleId}:`, error);
              return {
                vehicleId,
                name: 'Unknown Vehicle',
                capacity: 0,
              };
            }
          })
        );
        setVehicles(fetchedVehicles);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [selectedVehicles]);

  return { vehicles, isLoading };
};

