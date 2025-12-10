import { useState, useEffect } from 'react';
import { X, Trash2, Search } from 'lucide-react';
import { Button } from '../../../common/ui/button';
import { vehicleService } from '../../../../services/api/vehicle_service';
import type { Vehicle } from '../../../../types/fleet/vehicle';
import type { SelectedVehicle } from '../../../../types/reservations/reservation';

interface AdjustVehiclesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdjust: (vehicles: Array<{ vehicleId: string; quantity: number }>) => Promise<void>;
  isLoading?: boolean;
  currentVehicles?: SelectedVehicle[];
}

/**
 * Adjust Vehicles Modal Component
 * Allows admin to adjust vehicles for a reservation
 */
export const AdjustVehiclesModal: React.FC<AdjustVehiclesModalProps> = ({
  isOpen,
  onClose,
  onAdjust,
  isLoading = false,
  currentVehicles = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<Array<{ vehicleId: string; quantity: number }>>(
    currentVehicles.map((v) => ({ vehicleId: v.vehicleId, quantity: v.quantity }))
  );

  // Fetch available vehicles
  useEffect(() => {
    if (!isOpen) return;

    const fetchVehicles = async () => {
      setIsLoadingVehicles(true);
      try {
        const response = await vehicleService.getVehicles({ page: 1, limit: 100, status: 'available' });
        setAvailableVehicles(response.data || []);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
        setAvailableVehicles([]);
      } finally {
        setIsLoadingVehicles(false);
      }
    };

    fetchVehicles();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredVehicles = availableVehicles.filter((vehicle) =>
    vehicle.vehicleModel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.plateNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVehicle = (vehicleId: string) => {
    const existing = selectedVehicles.find((v) => v.vehicleId === vehicleId);
    if (existing) {
      setSelectedVehicles(
        selectedVehicles.map((v) =>
          v.vehicleId === vehicleId ? { ...v, quantity: v.quantity + 1 } : v
        )
      );
    } else {
      setSelectedVehicles([...selectedVehicles, { vehicleId, quantity: 1 }]);
    }
  };

  const handleRemoveVehicle = (vehicleId: string) => {
    const existing = selectedVehicles.find((v) => v.vehicleId === vehicleId);
    if (existing && existing.quantity > 1) {
      setSelectedVehicles(
        selectedVehicles.map((v) =>
          v.vehicleId === vehicleId ? { ...v, quantity: v.quantity - 1 } : v
        )
      );
    } else {
      setSelectedVehicles(selectedVehicles.filter((v) => v.vehicleId !== vehicleId));
    }
  };

  const handleQuantityChange = (vehicleId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedVehicles(selectedVehicles.filter((v) => v.vehicleId !== vehicleId));
    } else {
      setSelectedVehicles(
        selectedVehicles.map((v) => (v.vehicleId === vehicleId ? { ...v, quantity } : v))
      );
    }
  };

  const handleSubmit = async () => {
    if (selectedVehicles.length === 0) {
      return;
    }
    await onAdjust(selectedVehicles);
    setSelectedVehicles([]);
  };

  const handleClose = () => {
    setSelectedVehicles(currentVehicles.map((v) => ({ vehicleId: v.vehicleId, quantity: v.quantity })));
    setSearchQuery('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Adjust Vehicles
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Available Vehicles List */}
          <div className="flex-1 border-r border-[var(--color-border)] flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-[var(--color-border)]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>
            </div>

            {/* Vehicles List */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoadingVehicles ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto"></div>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Loading vehicles...</p>
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-[var(--color-text-secondary)]">No vehicles found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredVehicles.map((vehicle) => {
                    const isSelected = selectedVehicles.some((v) => v.vehicleId === vehicle.vehicleId);
                    return (
                      <button
                        key={vehicle.vehicleId}
                        onClick={() => handleAddVehicle(vehicle.vehicleId)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">
                              {vehicle.vehicleModel || `Vehicle ${vehicle.vehicleId.slice(0, 8)}`}
                            </p>
                            <p className="text-xs text-[var(--color-text-secondary)]">
                              Capacity: {vehicle.capacity} passengers
                            </p>
                          </div>
                          {isSelected && (
                            <span className="text-xs font-medium text-[var(--color-primary)]">
                              Selected
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Selected Vehicles */}
          <div className="w-80 flex flex-col">
            <div className="p-4 border-b border-[var(--color-border)]">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                Selected Vehicles ({selectedVehicles.length})
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {selectedVehicles.length === 0 ? (
                <p className="text-sm text-[var(--color-text-secondary)] text-center py-8">
                  No vehicles selected
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedVehicles.map((selected) => {
                    const vehicle = availableVehicles.find((v) => v.vehicleId === selected.vehicleId);
                    return (
                      <div
                        key={selected.vehicleId}
                        className="p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                              {vehicle?.vehicleModel || `Vehicle ${selected.vehicleId.slice(0, 8)}`}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveVehicle(selected.vehicleId)}
                            className="p-1 rounded hover:bg-[var(--color-bg-hover)] text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-[var(--color-text-secondary)]">Quantity:</label>
                          <input
                            type="number"
                            min="1"
                            value={selected.quantity}
                            onChange={(e) =>
                              handleQuantityChange(selected.vehicleId, parseInt(e.target.value) || 1)
                            }
                            className="w-20 px-2 py-1 text-sm border border-[var(--color-border)] rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-border)]">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || selectedVehicles.length === 0}
          >
            {isLoading ? 'Adjusting...' : 'Adjust Vehicles'}
          </Button>
        </div>
      </div>
    </div>
  );
};

