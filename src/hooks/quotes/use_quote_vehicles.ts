import { useEffect, useState } from 'react';
import { vehicleService } from '../../services/api/vehicle_service';
import type { Vehicle } from '../../types/fleet/vehicle';
import type { SelectedVehicle } from '../../types/quotes/admin_quote';

/**
 * Hook to fetch vehicle details for selected vehicles in a quote
 */
export const useQuoteVehicles = (selectedVehicles?: SelectedVehicle[]) => {
  const [vehicles, setVehicles] = useState<Record<string, Vehicle>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!selectedVehicles || selectedVehicles.length === 0) {
        setVehicles({});
        return;
      }

      setIsLoading(true);
      const vehicleMap: Record<string, Vehicle> = {};

      try {
        await Promise.all(
          selectedVehicles.map(async (selectedVehicle) => {
            try {
              const vehicle = await vehicleService.getVehicleById(selectedVehicle.vehicleId);
              vehicleMap[selectedVehicle.vehicleId] = vehicle;
            } catch (err) {
              console.error(`Failed to fetch vehicle ${selectedVehicle.vehicleId}:`, err);
            }
          })
        );
        setVehicles(vehicleMap);
      } catch (err) {
        console.error('Failed to fetch vehicles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicles]);

  return { vehicles, isLoading };
};

