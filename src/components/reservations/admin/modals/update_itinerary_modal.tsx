import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../common/ui/button';
import { FormInput } from '../../../common/forms/form_input';
import type { UpdateReservationItineraryRequest } from '../../../../types/reservations/admin_reservation';
import type { AdminReservationDetailsResponse } from '../../../../types/reservations/admin_reservation';

interface ItineraryStopForm {
  itineraryId?: string;
  tripType: 'outbound' | 'return';
  stopOrder: number;
  locationName: string;
  latitude: number;
  longitude: number;
  arrivalTime: string; // ISO string for input
  departureTime?: string; // ISO string for input
  stopType: string;
  isDriverStaying: boolean;
  stayingDuration?: number;
}

interface UpdateItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: UpdateReservationItineraryRequest) => Promise<void>;
  isLoading?: boolean;
  reservationDetails?: AdminReservationDetailsResponse;
}

/**
 * Update Itinerary Modal Component
 * Allows admin to update itinerary stops for a reservation
 */
export const UpdateItineraryModal: React.FC<UpdateItineraryModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  isLoading = false,
  reservationDetails,
}) => {
  const [stops, setStops] = useState<ItineraryStopForm[]>([]);

  // Initialize with current itinerary when modal opens
  useEffect(() => {
    if (isOpen && reservationDetails?.itinerary) {
      const initialStops: ItineraryStopForm[] = reservationDetails.itinerary.map((stop) => ({
        itineraryId: stop.itineraryId,
        tripType: stop.tripType,
        stopOrder: stop.stopOrder,
        locationName: stop.locationName,
        latitude: stop.latitude,
        longitude: stop.longitude,
        arrivalTime: new Date(stop.arrivalTime).toISOString().slice(0, 16), // Format for datetime-local input
        departureTime: stop.departureTime ? new Date(stop.departureTime).toISOString().slice(0, 16) : undefined,
        stopType: stop.stopType,
        isDriverStaying: stop.isDriverStaying,
        stayingDuration: stop.stayingDuration,
      }));
      setStops(initialStops);
    } else if (isOpen && (!reservationDetails?.itinerary || reservationDetails.itinerary.length === 0)) {
      // If no itinerary, start with empty form
      setStops([]);
    }
  }, [isOpen, reservationDetails]);

  if (!isOpen) return null;

  const handleAddStop = () => {
    const newStop: ItineraryStopForm = {
      tripType: 'outbound',
      stopOrder: stops.length + 1,
      locationName: '',
      latitude: 0,
      longitude: 0,
      arrivalTime: new Date().toISOString().slice(0, 16),
      stopType: 'stop',
      isDriverStaying: false,
    };
    setStops([...stops, newStop]);
  };

  const handleRemoveStop = (index: number) => {
    const updated = stops.filter((_, i) => i !== index);
    // Reorder stops
    const reordered = updated.map((stop, i) => ({ ...stop, stopOrder: i + 1 }));
    setStops(reordered);
  };

  const handleStopChange = (index: number, field: keyof ItineraryStopForm, value: string | number | boolean) => {
    const updated = [...stops];
    updated[index] = { ...updated[index], [field]: value };
    setStops(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (stops.length === 0) {
      return;
    }

    // Validate all stops have required fields
    const invalidStops = stops.filter(
      (stop) => !stop.locationName || stop.latitude === 0 || stop.longitude === 0 || !stop.arrivalTime
    );

    if (invalidStops.length > 0) {
      return;
    }

    // Convert to request format
    const request: UpdateReservationItineraryRequest = {
      stops: stops.map((stop) => ({
        itineraryId: stop.itineraryId,
        tripType: stop.tripType,
        stopOrder: stop.stopOrder,
        locationName: stop.locationName,
        latitude: stop.latitude,
        longitude: stop.longitude,
        arrivalTime: new Date(stop.arrivalTime),
        departureTime: stop.departureTime ? new Date(stop.departureTime) : undefined,
        stopType: stop.stopType,
        isDriverStaying: stop.isDriverStaying,
        stayingDuration: stop.stayingDuration,
      })),
    };

    await onUpdate(request);
  };

  const handleClose = () => {
    // Reset to original itinerary
    if (reservationDetails?.itinerary) {
      const originalStops: ItineraryStopForm[] = reservationDetails.itinerary.map((stop) => ({
        itineraryId: stop.itineraryId,
        tripType: stop.tripType,
        stopOrder: stop.stopOrder,
        locationName: stop.locationName,
        latitude: stop.latitude,
        longitude: stop.longitude,
        arrivalTime: new Date(stop.arrivalTime).toISOString().slice(0, 16),
        departureTime: stop.departureTime ? new Date(stop.departureTime).toISOString().slice(0, 16) : undefined,
        stopType: stop.stopType,
        isDriverStaying: stop.isDriverStaying,
        stayingDuration: stop.stayingDuration,
      }));
      setStops(originalStops);
    } else {
      setStops([]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Update Itinerary
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {stops.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">No stops in itinerary</p>
                <Button type="button" variant="outline" onClick={handleAddStop}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Stop
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {stops.map((stop, index) => (
                  <div
                    key={index}
                    className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                        Stop #{stop.stopOrder}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(index)}
                        className="p-1 rounded hover:bg-[var(--color-bg-hover)] text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Location Name"
                        value={stop.locationName}
                        onChange={(e) => handleStopChange(index, 'locationName', e.target.value)}
                        required
                      />
                      <div>
                        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                          Trip Type
                        </label>
                        <select
                          value={stop.tripType}
                          onChange={(e) => handleStopChange(index, 'tripType', e.target.value as 'outbound' | 'return')}
                          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        >
                          <option value="outbound">Outbound</option>
                          <option value="return">Return</option>
                        </select>
                      </div>
                      <FormInput
                        label="Latitude"
                        type="number"
                        step="any"
                        value={stop.latitude}
                        onChange={(e) => handleStopChange(index, 'latitude', parseFloat(e.target.value) || 0)}
                        required
                      />
                      <FormInput
                        label="Longitude"
                        type="number"
                        step="any"
                        value={stop.longitude}
                        onChange={(e) => handleStopChange(index, 'longitude', parseFloat(e.target.value) || 0)}
                        required
                      />
                      <FormInput
                        label="Arrival Time"
                        type="datetime-local"
                        value={stop.arrivalTime}
                        onChange={(e) => handleStopChange(index, 'arrivalTime', e.target.value)}
                        required
                      />
                      <FormInput
                        label="Departure Time (Optional)"
                        type="datetime-local"
                        value={stop.departureTime || ''}
                        onChange={(e) => handleStopChange(index, 'departureTime', e.target.value ?? '')}
                      />
                      <div>
                        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                          Stop Type
                        </label>
                        <select
                          value={stop.stopType}
                          onChange={(e) => handleStopChange(index, 'stopType', e.target.value)}
                          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        >
                          <option value="pickup">Pickup</option>
                          <option value="dropoff">Dropoff</option>
                          <option value="stop">Stop</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={stop.isDriverStaying}
                          onChange={(e) => handleStopChange(index, 'isDriverStaying', e.target.checked)}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <label className="text-xs text-[var(--color-text-secondary)]">
                          Driver Staying
                        </label>
                      </div>
                      {stop.isDriverStaying && (
                        <FormInput
                          label="Staying Duration (minutes)"
                          type="number"
                          min="0"
                          value={stop.stayingDuration || ''}
                          onChange={(e) => handleStopChange(index, 'stayingDuration', parseInt(e.target.value ?? '0'))}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-[var(--color-border)]">
            <Button type="button" variant="outline" onClick={handleAddStop}>
              <Plus className="w-4 h-4 mr-2" />
              Add Stop
            </Button>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || stops.length === 0}>
                {isLoading ? 'Updating...' : 'Update Itinerary'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

