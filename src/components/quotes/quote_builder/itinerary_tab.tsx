import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/common/button';
import { StopItem } from './stop_item';
import type { ItineraryStopDto } from '../../../types/quotes/itinerary';
import { StopType } from '../../../types/quotes/itinerary';

interface ItineraryTabProps {
  stops: ItineraryStopDto[];
  onStopsChange: (stops: ItineraryStopDto[]) => void;
  isReturn?: boolean;
}

/**
 * Itinerary Tab Component
 * Reusable component for Outbound/Return itinerary
 */
export const ItineraryTab: React.FC<ItineraryTabProps> = ({
  stops,
  onStopsChange,
  isReturn = false,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleUpdateStop = (index: number, updates: Partial<ItineraryStopDto>) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], ...updates };
    onStopsChange(newStops);
  };

  const handleRemoveStop = (index: number) => {
    const newStops = stops.filter((_, i) => i !== index);
    onStopsChange(newStops);
  };

  const handleAddStop = () => {
    const newStop: ItineraryStopDto = {
      locationName: '',
      latitude: 0,
      longitude: 0,
      arrivalTime: new Date().toISOString(),
      departureTime: null,
      isDriverStaying: false,
      stayingDuration: null,
      stopType: StopType.STOP,
    };
    onStopsChange([...stops, newStop]);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDrop = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newStops = [...stops];
    const [removed] = newStops.splice(fromIndex, 1);
    newStops.splice(toIndex, 0, removed);
    onStopsChange(newStops);
    setDraggedIndex(null);
  };

  // Find pickup and dropoff indices
  const pickupIndex = stops.findIndex((s) => s.stopType === StopType.PICKUP);
  const dropoffIndex = stops.findIndex((s) => s.stopType === StopType.DROPOFF);
  const stopIndices = stops
    .map((_, index) => index)
    .filter((index) => stops[index].stopType === StopType.STOP);

  return (
    <div className="space-y-4">
      {/* Pickup */}
      {pickupIndex !== -1 && (
        <StopItem
          stop={stops[pickupIndex]}
          index={pickupIndex}
          isDragging={draggedIndex === pickupIndex}
          onUpdate={handleUpdateStop}
          onRemove={() => {}} // Pickup cannot be removed
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        />
      )}

      {/* Stops */}
      {stopIndices.map((stopIndex) => (
        <StopItem
          key={stopIndex}
          stop={stops[stopIndex]}
          index={stopIndex}
          isDragging={draggedIndex === stopIndex}
          onUpdate={handleUpdateStop}
          onRemove={handleRemoveStop}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        />
      ))}

      {/* Add Stop Button */}
      <Button
        onClick={handleAddStop}
        variant="outline"
        size="sm"
        className="w-full"
        type="button"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Stop
      </Button>

      {/* Dropoff (only for one-way, or last stop for two-way) */}
      {!isReturn && dropoffIndex !== -1 && (
        <StopItem
          stop={stops[dropoffIndex]}
          index={dropoffIndex}
          isDragging={draggedIndex === dropoffIndex}
          onUpdate={handleUpdateStop}
          onRemove={() => {}} // Dropoff cannot be removed
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        />
      )}

      {/* Last Stop (for two-way return) */}
      {isReturn && dropoffIndex !== -1 && (
        <StopItem
          stop={stops[dropoffIndex]}
          index={dropoffIndex}
          isDragging={draggedIndex === dropoffIndex}
          onUpdate={handleUpdateStop}
          onRemove={() => {}} // Last stop cannot be removed
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        />
      )}
    </div>
  );
};

