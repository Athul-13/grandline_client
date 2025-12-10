import { Truck } from 'lucide-react';
import type { ReservationResponse } from '../../../types/reservations/reservation';

interface Vehicle {
  vehicleId: string;
  name: string;
  capacity: number;
  imageUrl?: string;
}

interface VehiclesBentoCardProps {
  reservationDetails: ReservationResponse;
  vehicles: Vehicle[];
  isLoading: boolean;
}

/**
 * Vehicles Bento Card Component
 * Displays selected vehicles for the reservation
 */
export const VehiclesBentoCard: React.FC<VehiclesBentoCardProps> = ({
  reservationDetails,
  vehicles,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Vehicles</h3>
        </div>
        <div className="text-sm text-[var(--color-text-secondary)]">Loading...</div>
      </div>
    );
  }

  if (!reservationDetails.selectedVehicles || reservationDetails.selectedVehicles.length === 0) {
    return (
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Vehicles</h3>
        </div>
        <div className="text-sm text-[var(--color-text-secondary)]">No vehicles selected</div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Vehicles</h3>
      </div>
      <div className="space-y-3">
        {reservationDetails.selectedVehicles.map((selectedVehicle, index) => {
          const vehicle = vehicles.find((v) => v.vehicleId === selectedVehicle.vehicleId);
          return (
            <div
              key={`${selectedVehicle.vehicleId}-${index}`}
              className="flex items-center gap-3 p-3 bg-[var(--color-bg-secondary)] rounded-lg"
            >
              {vehicle?.imageUrl && (
                <img
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {vehicle?.name || 'Vehicle'}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Quantity: {selectedVehicle.quantity}
                  {vehicle && ` • Capacity: ${vehicle.capacity} passengers`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

