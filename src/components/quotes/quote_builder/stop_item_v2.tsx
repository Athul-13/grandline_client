import { useState, useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../../utils/cn';
import type { ItineraryStopDto } from '../../../types/quotes/itinerary';
import { formatDate, formatTime, parseDate } from '../../../utils/date_utils';
import { AddressAutocomplete } from './address_autocomplete';
import type { Map } from 'mapbox-gl';

interface StopItemV2Props {
  stop: ItineraryStopDto;
  index: number;
  stopNumber?: number; // For numbered stops (1, 2, 3...)
  isPickup: boolean;
  isDropoff: boolean;
  isDragging?: boolean;
  previousStopArrivalTime?: string | null; // For chronological validation
  onUpdate: (index: number, updates: Partial<ItineraryStopDto>) => void;
  onRemove: (index: number) => void;
  onDragStart?: (index: number) => void;
  onDragEnd?: () => void;
  onDragOver?: (index: number) => void;
  onDrop?: (fromIndex: number, toIndex: number) => void;
  canRemove: boolean; // Whether remove button should be enabled
  geocoderContainerId?: string; // For geocoder integration
  displayMode?: 'edit' | 'card'; // 'edit' = full editing, 'card' = simple display card
  onCardClick?: () => void; // Callback when card is clicked (for card mode)
  mapboxAccessToken?: string; // Mapbox access token for autocomplete
  map: Map | null; // Map instance for animation
  isMapLoaded: boolean; // Whether map is loaded
  isDropoffDisabled?: boolean; // Whether dropoff address input should be disabled
}

/**
 * Stop Item V2 Component
 * Redesigned stop item with vertical layout, separate Date/Time buttons, and driver stay logic
 */
export const StopItemV2: React.FC<StopItemV2Props> = ({
  stop,
  index,
  stopNumber,
  isPickup,
  isDropoff,
  isDragging = false,
  onUpdate,
  onRemove,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  canRemove,
  mapboxAccessToken,
  map,
  isMapLoaded,
  isDropoffDisabled = false,
}) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);


  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    if (onDragStart) {
      onDragStart(index);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDraggedOver(true);
    if (onDragOver) {
      onDragOver(index);
    }
  };

  const handleDragLeave = () => {
    setIsDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggedOver(false);
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(fromIndex) && fromIndex !== index && onDrop) {
      onDrop(fromIndex, index);
    }
  };

  const handleDragEnd = () => {
    setIsDraggedOver(false);
    if (onDragEnd) {
      onDragEnd();
    }
  };

  // Memoize min date/time for validation - always use future time (next minute)
  const minDate = useMemo(() => {
    const now = new Date();
    // Add 1 minute to ensure it's in the future
    now.setMinutes(now.getMinutes() + 1);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);
  
  const minTime = useMemo(() => {
    const now = new Date();
    // Add 1 minute to ensure it's in the future
    now.setMinutes(now.getMinutes() + 1);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }, []);

  // For intermediate stops, calculate min departure time based on arrival time + staying duration
  // This is ready for when departure time inputs are added
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const minDepartureDateTime = useMemo(() => {
    if (!isPickup && !isDropoff && stop.arrivalTime && stop.arrivalTime !== '') {
      const arrivalDate = new Date(stop.arrivalTime);
      const stayingDuration = stop.stayingDuration || 0; // in seconds
      // Add staying duration to arrival time
      arrivalDate.setSeconds(arrivalDate.getSeconds() + stayingDuration);
      // Add 1 minute buffer to ensure departure is after arrival + stay
      arrivalDate.setMinutes(arrivalDate.getMinutes() + 1);
      return arrivalDate;
    }
    return null;
  }, [isPickup, isDropoff, stop.arrivalTime, stop.stayingDuration]);

  return (
      <div
        draggable={!isPickup && !isDropoff}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        className={cn(
          'relative bg-white rounded-lg border-2 p-4 transition-all',
          isPickup
            ? 'border-green-500 bg-green-50/30'
            : isDropoff
              ? 'border-red-500 bg-red-50/30'
              : 'border-blue-500 bg-blue-50/30 cursor-move',
          isDragging && 'opacity-50',
          isDraggedOver && 'border-[var(--color-primary)] border-2 bg-[var(--color-primary)]/5'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-3 h-3 rounded-full',
                isPickup ? 'bg-green-500' : isDropoff ? 'bg-red-500' : 'bg-blue-500'
              )}
            />
            <h3 className="font-semibold text-gray-900">
              {isPickup ? 'Pickup Location' : isDropoff ? 'Dropoff Location' : `Stop ${stopNumber || ''}`}
            </h3>
          </div>
          {/* Remove Button - only for intermediate stops or if canRemove */}
          {!isPickup && !isDropoff && canRemove && (
            <button
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
              type="button"
            >
              Remove
            </button>
          )}
          {(isPickup || isDropoff) && canRemove && (
            <button
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
              type="button"
            >
              Remove
            </button>
          )}
        </div>

        {/* Address Input with Autocomplete */}
        <div className="mb-3">
          {mapboxAccessToken ? (
            <div
              onClick={() => {
                if (isDropoff && isDropoffDisabled) {
                  toast.error('Please set the departure time for the previous stop before setting the dropoff location');
                }
              }}
              className={cn(
                isDropoff && isDropoffDisabled && 'cursor-not-allowed opacity-60'
              )}
            >
              <AddressAutocomplete
                value={stop.locationName || ''}
                onChange={(value) => {
                  if (isDropoff && isDropoffDisabled) {
                    toast.error('Please set the departure time for the previous stop before setting the dropoff location');
                    return;
                  }
                  onUpdate(index, { locationName: value });
                }}
                onSelect={(suggestion) => {
                  if (isDropoff && isDropoffDisabled) {
                    toast.error('Please set the departure time for the previous stop before setting the dropoff location');
                    return;
                  }
                  console.log('🟢 STEP 2: StopItemV2 - onSelect called', {
                    index,
                    suggestion,
                    center: suggestion.center,
                    latitude: suggestion.center[1],
                    longitude: suggestion.center[0],
                  });
                  const updates = {
                    locationName: suggestion.place_name || suggestion.text,
                    latitude: suggestion.center[1],
                    longitude: suggestion.center[0],
                  };
                  console.log('🟢 STEP 2: StopItemV2 - Calling onUpdate with', updates);
                  onUpdate(index, updates);

                  // Animate map to selected location
                  if (map && isMapLoaded && suggestion.center && suggestion.center[0] && suggestion.center[1]) {
                    try {
                      map.flyTo({
                        center: [suggestion.center[0], suggestion.center[1]], // [longitude, latitude]
                        zoom: 14,
                        duration: 1500, // Animation duration in milliseconds
                        essential: true, // Animation is essential (won't be interrupted)
                      });
                      console.log('🗺️ Map animated to location', {
                        center: [suggestion.center[0], suggestion.center[1]],
                        zoom: 14,
                      });
                    } catch (error) {
                      console.error('❌ Failed to animate map:', error);
                    }
                  }
                }}
                placeholder="Address"
                accessToken={mapboxAccessToken}
                disabled={isDropoff && isDropoffDisabled}
              />
            </div>
          ) : (
            <input
              type="text"
              value={stop.locationName || ''}
              onChange={(e) => {
                if (isDropoff && isDropoffDisabled) {
                  toast.error('Please set the departure time for the previous stop before setting the dropoff location');
                  return;
                }
                onUpdate(index, { locationName: e.target.value });
              }}
              onClick={() => {
                if (isDropoff && isDropoffDisabled) {
                  toast.error('Please set the departure time for the previous stop before setting the dropoff location');
                }
              }}
              placeholder="Address"
              disabled={isDropoff && isDropoffDisabled}
              className={cn(
                "w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]",
                isDropoff && isDropoffDisabled && 'cursor-not-allowed opacity-60 bg-gray-100'
              )}
            />
          )}
        </div>

        {/* Date and Time Inputs - Hidden for dropoff stops */}
        {!isDropoff && (
          <div className="flex gap-2">
            {/* Date Input */}
            <div className="relative flex-1">
              <input
                type="date"
                value={formatDate(stop.arrivalTime)}
                onChange={(e) => {
                  const newDate = e.target.value;
                  if (!newDate) {
                    onUpdate(index, { arrivalTime: '' });
                    return;
                  }
                  const currentTime = stop.arrivalTime ? formatTime(stop.arrivalTime) : minTime;
                  const newDateTime = parseDate(newDate, currentTime || minTime, stop.arrivalTime);
                  onUpdate(index, { arrivalTime: newDateTime });
                }}
                min={minDate}
                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] appearance-none"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Time Input */}
            <div className="relative flex-1">
              <input
                type="time"
                value={formatTime(stop.arrivalTime)}
                onChange={(e) => {
                  const newTime = e.target.value;
                  if (!newTime) {
                    // If time is cleared, keep date but clear time
                    const currentDate = stop.arrivalTime ? formatDate(stop.arrivalTime) : minDate;
                    if (currentDate) {
                      const newDateTime = parseDate(currentDate, minTime, stop.arrivalTime);
                      onUpdate(index, { arrivalTime: newDateTime });
                    } else {
                      onUpdate(index, { arrivalTime: '' });
                    }
                    return;
                  }
                  const currentDate = stop.arrivalTime ? formatDate(stop.arrivalTime) : minDate;
                  const selectedDate = currentDate || minDate;
                  const newDateTime = parseDate(selectedDate, newTime, stop.arrivalTime);
                  onUpdate(index, { arrivalTime: newDateTime });
                }}
                min={(() => {
                  // If selected date is today, use minTime, otherwise allow any time
                  const currentDate = stop.arrivalTime ? formatDate(stop.arrivalTime) : minDate;
                  return currentDate === minDate ? minTime : '00:00';
                })()}
                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] appearance-none"
              />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>
    );
};

