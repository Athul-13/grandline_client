import { Car } from 'lucide-react';
import { formatPrice } from '../../../../utils/quote_formatters';
import type { QuoteResponse } from '../../../../types/quotes/quote';
import type { Vehicle } from '../../../../types/fleet/vehicle';

interface VehiclesBentoCardProps {
  quoteDetails: QuoteResponse;
  vehicles: Record<string, Vehicle>;
  isLoading: boolean;
}

/**
 * Vehicles Bento Card Component
 * Displays selected vehicles with their details
 */
export const VehiclesBentoCard: React.FC<VehiclesBentoCardProps> = ({
  quoteDetails,
  vehicles,
  isLoading,
}) => {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Car className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Selected Vehicles</h3>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      ) : quoteDetails.selectedVehicles && quoteDetails.selectedVehicles.length > 0 ? (
        <div className="space-y-3">
          {quoteDetails.selectedVehicles.map((selectedVehicle, index) => {
            const vehicle = vehicles[selectedVehicle.vehicleId];
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
                          {vehicle ? vehicle.vehicleModel : `Vehicle ID: ${selectedVehicle.vehicleId}`}
                        </p>
                        {vehicle && vehicle.year && (
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            ({vehicle.year})
                          </span>
                        )}
                      </div>
                      {vehicle && (
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          {vehicle.vehicleType?.name || vehicle.vehicleTypeId}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        Qty: {selectedVehicle.quantity}
                      </p>
                    </div>
                  </div>
                  {vehicle && (
                    <div className="mt-2 pt-2 border-t border-[var(--color-border)] space-y-1 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[var(--color-text-secondary)]">Plate Number:</span>
                          <span className="ml-2 text-[var(--color-text-primary)] font-medium">
                            {vehicle.plateNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-[var(--color-text-secondary)]">Capacity:</span>
                          <span className="ml-2 text-[var(--color-text-primary)] font-medium">
                            {vehicle.capacity} seats
                          </span>
                        </div>
                        <div>
                          <span className="text-[var(--color-text-secondary)]">Base Fare:</span>
                          <span className="ml-2 text-[var(--color-text-primary)] font-medium">
                            {formatPrice(vehicle.baseFare)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[var(--color-text-secondary)]">Status:</span>
                          <span className="ml-2 text-[var(--color-text-primary)] font-medium capitalize">
                            {vehicle.status ? vehicle.status.replace('_', ' ') : '-'}
                          </span>
                        </div>
                      </div>
                      {vehicle.fuelConsumption && (
                        <div>
                          <span className="text-[var(--color-text-secondary)]">Fuel Consumption:</span>
                          <span className="ml-2 text-[var(--color-text-primary)] font-medium">
                            {vehicle.fuelConsumption} km/L
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {!vehicle && (
                    <p className="text-xs text-[var(--color-text-secondary)] italic mt-2">
                      Vehicle details not available
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">No vehicles selected</p>
      )}
    </div>
  );
};

