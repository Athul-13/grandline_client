import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/common/button';
import { StopItemV2 } from './stop_item_v2';
import { formatDuration } from '../../../services/api/mapbox_directions_service';
import type { ItineraryStopDto } from '../../../types/quotes/itinerary';
import { StopType } from '../../../types/quotes/itinerary';
import type { RouteResponse } from '../../../services/api/mapbox_directions_service';
import { createNewStop } from '../../../utils/stop_utils';

interface ItineraryTabV2Props {
  stops: ItineraryStopDto[];
  onStopsChange: (stops: ItineraryStopDto[]) => void;
  isReturn?: boolean;
  geocoderContainerId?: string;
  route?: RouteResponse | null; // Route data for segment durations
}

/**
 * Itinerary Tab V2 Component
 * Redesigned with vertical numbering and connecting lines
 */
export const ItineraryTabV2: React.FC<ItineraryTabV2Props> = ({
  stops,
  onStopsChange,
  isReturn = false,
  geocoderContainerId,
  route,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Calculate segment durations from route legs
  const segmentDurations = useMemo(() => {
    if (!route || !route.legs || route.legs.length === 0) return null;
    return route.legs.map((leg) => leg.duration); // Duration in seconds
  }, [route]);

  // Find pickup and dropoff indices
  const pickupIndex = stops.findIndex((s) => s.stopType === StopType.PICKUP);
  const dropoffIndex = stops.findIndex((s) => s.stopType === StopType.DROPOFF);
  const stopIndices = stops
    .map((_, index) => index)
    .filter((index) => stops[index].stopType === StopType.STOP);

  // Check if we can remove stops (minimum 2 stops required)
  const canRemoveStops = stops.length > 2;

  const handleUpdateStop = (index: number, updates: Partial<ItineraryStopDto>) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], ...updates };
    
    // If pickup was removed and this is the first stop, make it pickup
    if (pickupIndex === index && updates.stopType !== StopType.PICKUP) {
      // This shouldn't happen as pickup can't be removed, but handle it anyway
      if (newStops.length > 0 && newStops[0].stopType !== StopType.PICKUP) {
        newStops[0].stopType = StopType.PICKUP;
      }
    }
    
    onStopsChange(newStops);
  };

  const handleRemoveStop = (index: number) => {
    if (!canRemoveStops) return;
    
    const newStops = stops.filter((_, i) => i !== index);
    
    // If pickup was removed, make the first stop the new pickup
    if (pickupIndex === index && newStops.length > 0) {
      newStops[0].stopType = StopType.PICKUP;
    }
    
    // Ensure we have pickup and dropoff
    if (newStops.length > 0 && newStops[0].stopType !== StopType.PICKUP) {
      newStops[0].stopType = StopType.PICKUP;
    }
    if (newStops.length > 1 && newStops[newStops.length - 1].stopType !== StopType.DROPOFF) {
      newStops[newStops.length - 1].stopType = StopType.DROPOFF;
    }
    
    onStopsChange(newStops);
  };

  const handleAddStop = (insertAfterIndex?: number) => {
    const newStop = createNewStop();

    if (insertAfterIndex !== undefined) {
      // Insert after specific index
      const newStops = [...stops];
      newStops.splice(insertAfterIndex + 1, 0, newStop);
      onStopsChange(newStops);
    } else {
      // Add at end (before dropoff)
      if (dropoffIndex !== -1) {
        const newStops = [...stops];
        newStops.splice(dropoffIndex, 0, newStop);
        onStopsChange(newStops);
      } else {
        onStopsChange([...stops, newStop]);
      }
    }
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
    
    // Reassign stop types after reordering
    if (newStops.length > 0) {
      newStops[0].stopType = StopType.PICKUP;
    }
    if (newStops.length > 1) {
      newStops[newStops.length - 1].stopType = StopType.DROPOFF;
      // Set intermediate stops to STOP type
      for (let i = 1; i < newStops.length - 1; i++) {
        newStops[i].stopType = StopType.STOP;
      }
    }
    
    onStopsChange(newStops);
    setDraggedIndex(null);
  };

  // Get previous stop's arrival time for chronological validation
  const getPreviousArrivalTime = (currentIndex: number): string | null => {
    if (currentIndex === 0) return null;
    return stops[currentIndex - 1]?.arrivalTime || null;
  };

  return (
    <div className="space-y-0">
      {/* Pickup */}
      {pickupIndex !== -1 && (
        <>
          <StopItemV2
            stop={stops[pickupIndex]}
            index={pickupIndex}
            isPickup={true}
            isDropoff={false}
            isDragging={draggedIndex === pickupIndex}
            previousStopArrivalTime={null}
            onUpdate={handleUpdateStop}
            onRemove={() => {}}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            canRemove={false}
            geocoderContainerId={geocoderContainerId}
          />
          
          {/* Add Stop Button after Pickup */}
          <div className="flex justify-center my-2">
            <Button
              onClick={() => handleAddStop(pickupIndex)}
              variant="outline"
              size="sm"
              className="bg-[var(--color-primary)] text-white border-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
              type="button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add stop
            </Button>
          </div>
          
          {/* Connecting Line with Duration */}
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-4 bg-gray-300" />
            {segmentDurations && segmentDurations.length > 0 && (
              <div className="text-xs text-gray-600 font-medium my-1">
                {formatDuration(segmentDurations[0])}
              </div>
            )}
            <div className="w-0.5 h-4 bg-gray-300" />
          </div>
        </>
      )}

      {/* Stops with numbering */}
      {stopIndices.map((stopIndex, stopArrayIndex) => {
        const previousIndex = stopArrayIndex === 0 ? pickupIndex : stopIndices[stopArrayIndex - 1];
        const previousArrivalTime = previousIndex !== -1 ? stops[previousIndex]?.arrivalTime : null;

        return (
          <div key={stopIndex}>
            {/* Connecting Line before stop */}
            <div className="flex justify-center">
              <div className="w-0.5 h-4 bg-gray-300" />
            </div>
            
            {/* Stop Number Circle */}
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-semibold text-sm">
                {stopArrayIndex + 1}
              </div>
            </div>
            
            {/* Connecting Line to stop */}
            <div className="flex justify-center">
              <div className="w-0.5 h-4 bg-gray-300" />
            </div>

            <StopItemV2
              stop={stops[stopIndex]}
              index={stopIndex}
              stopNumber={stopArrayIndex + 1}
              isPickup={false}
              isDropoff={false}
              isDragging={draggedIndex === stopIndex}
              previousStopArrivalTime={previousArrivalTime}
              onUpdate={handleUpdateStop}
              onRemove={handleRemoveStop}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              canRemove={canRemoveStops}
              geocoderContainerId={geocoderContainerId}
            />

            {/* Add Stop Button after this stop */}
            <div className="flex justify-center my-2">
              <Button
                onClick={() => handleAddStop(stopIndex)}
                variant="outline"
                size="sm"
                className="bg-[var(--color-primary)] text-white border-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
                type="button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add stop
              </Button>
            </div>

            {/* Connecting Line after stop */}
            {stopArrayIndex < stopIndices.length - 1 || dropoffIndex === -1 ? (
              <div className="flex justify-center">
                <div className="w-0.5 h-4 bg-gray-300" />
              </div>
            ) : null}
          </div>
        );
      })}

      {/* Connecting Line before Dropoff with Duration */}
      {dropoffIndex !== -1 && (pickupIndex !== -1 || stopIndices.length > 0) && (
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-4 bg-gray-300" />
          {segmentDurations &&
            segmentDurations.length > stopIndices.length &&
            (stopIndices.length > 0
              ? stops[stopIndices[stopIndices.length - 1]]?.departureTime
              : stops[pickupIndex]?.arrivalTime) && (
              <div className="text-xs text-gray-600 font-medium my-1">
                {formatDuration(segmentDurations[segmentDurations.length - 1])}
              </div>
            )}
          <div className="w-0.5 h-4 bg-gray-300" />
        </div>
      )}

      {/* Dropoff */}
      {dropoffIndex !== -1 && (
        <StopItemV2
          stop={stops[dropoffIndex]}
          index={dropoffIndex}
          isPickup={false}
          isDropoff={true}
          isDragging={draggedIndex === dropoffIndex}
          previousStopArrivalTime={
            stopIndices.length > 0
              ? stops[stopIndices[stopIndices.length - 1]]?.arrivalTime
              : pickupIndex !== -1
                ? stops[pickupIndex]?.arrivalTime
                : null
          }
          onUpdate={handleUpdateStop}
          onRemove={() => {}}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          canRemove={false}
          geocoderContainerId={geocoderContainerId}
        />
      )}
    </div>
  );
};

