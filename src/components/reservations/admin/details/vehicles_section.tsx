import { FilterSection } from '../../../common/filters/filter_section';
import { useReservationVehicles } from '../../../../hooks/reservations/use_reservation_vehicles';
import type { AdminReservationDetailsResponse } from '../../../../types/reservations/admin_reservation';

interface VehiclesSectionProps {
  reservationDetails: AdminReservationDetailsResponse;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Vehicles Section Component
 * Displays selected vehicles with their details
 */
export const VehiclesSection: React.FC<VehiclesSectionProps> = ({
  reservationDetails,
  isExpanded,
  onToggle,
}) => {
  const { vehicles, isLoading } = useReservationVehicles(reservationDetails.selectedVehicles);

  return (
    <FilterSection
      title="Selected Vehicles"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      ) : reservationDetails.selectedVehicles && reservationDetails.selectedVehicles.length > 0 ? (
        <div className="space-y-3">
          {reservationDetails.selectedVehicles.map((selectedVehicle, index) => {
            const vehicle = vehicles.find((v) => v.vehicleId === selectedVehicle.vehicleId);
            return (
              <div
                key={index}
                className="p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)]"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                          {vehicle ? vehicle.name : `Vehicle ID: ${selectedVehicle.vehicleId}`}
                        </p>
                      </div>
                      {vehicle && (
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          Capacity: {vehicle.capacity} passengers
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        Qty: {selectedVehicle.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">No vehicles selected</p>
      )}
    </FilterSection>
  );
};

