import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { cn } from '../../../../utils/cn';
import type { ItineraryStopDto } from '../../../../types/quotes/itinerary';
import { formatDate, formatTime, parseDate } from '../../../../utils/date_utils';
import { AddressAutocomplete } from './address_autocomplete';
import { FormDateInput } from '../../../../components/common/forms/form_date_input';
import { FormTimeInput } from '../../../../components/common/forms/form_time_input';
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

  // Memoize min date/time for validation - departureTime must be at least 1 hour from now
  const minDate = useMemo(() => {
    const now = new Date();
    // Add 1 hour to ensure departureTime is at least 1 hour from now
    now.setHours(now.getHours() + 1);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);
  
  const minTime = useMemo(() => {
    const now = new Date();
    // Add 1 hour to ensure departureTime is at least 1 hour from now
    now.setHours(now.getHours() + 1);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }, []);

  // For intermediate stops, calculate min departure time based on arrival time + staying duration
  // This is ready for when departure time inputs are added
  // Note: minDepartureDateTime calculation will be used when departure time inputs are implemented

  return (
      <div
        draggable={!isPickup && !isDropoff}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        className={cn(
          'relative bg-[var(--color-bg-card)] dark:bg-[var(--color-bg-card)] rounded-lg border-2 p-4 transition-all',
          isPickup
            ? 'border-green-500 dark:border-green-600 bg-green-50/30 dark:bg-green-900/20'
            : isDropoff
              ? 'border-red-500 dark:border-red-600 bg-red-50/30 dark:bg-red-900/20'
              : 'border-blue-500 dark:border-blue-600 bg-blue-50/30 dark:bg-blue-900/20 cursor-move',
          isDragging && 'opacity-50',
          isDraggedOver && 'border-[var(--color-primary)] border-2 bg-[var(--color-primary)]/5 dark:bg-[var(--color-primary)]/10'
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
            <h3 className="font-semibold text-[var(--color-text-primary)]">
              {isPickup ? 'Pickup Location' : isDropoff ? 'Dropoff Location' : `Stop ${stopNumber || ''}`}
            </h3>
          </div>
          {/* Remove Button - only for intermediate stops or if canRemove */}
          {!isPickup && !isDropoff && canRemove && (
            <button
              onClick={() => onRemove(index)}
              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
              type="button"
            >
              Remove
            </button>
          )}
          {(isPickup || isDropoff) && canRemove && (
            <button
              onClick={() => onRemove(index)}
              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
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
                  const updates = {
                    locationName: suggestion.place_name || suggestion.text,
                    latitude: suggestion.center[1],
                    longitude: suggestion.center[0],
                  };
                  onUpdate(index, updates);

                  // Animate map to selected location
                  if (map && isMapLoaded && suggestion.center && suggestion.center[0] && suggestion.center[1]) {
                    try {
                      map.flyTo({
                        center: [suggestion.center[0], suggestion.center[1]],
                        zoom: 14,
                        duration: 1500,
                        essential: true,
                      });
                    } catch {
                      // Silently handle animation errors
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
                "w-full px-3 py-2 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]",
                isDropoff && isDropoffDisabled && 'cursor-not-allowed opacity-60 bg-[var(--color-bg-secondary)]'
              )}
            />
          )}
        </div>

        {/* Date and Time Inputs - Show departureTime for pickup and intermediate stops, hidden for dropoff */}
        {!isDropoff && (
          <div className="flex gap-3">
            {/* Date Input */}
            <div className="flex-1">
              <FormDateInput
                label=""
                value={formatDate(stop.departureTime || '')}
                onChange={(e) => {
                  const newDate = e.target.value;
                  if (!newDate) {
                    onUpdate(index, { departureTime: null });
                    // Clear arrivalTime if departureTime is cleared
                    if (isPickup) {
                      onUpdate(index, { arrivalTime: '' });
                    }
                    return;
                  }
                  const currentTime = stop.departureTime ? formatTime(stop.departureTime) : minTime;
                  const newDepartureDateTime = parseDate(newDate, currentTime || minTime, stop.departureTime || undefined);
                  
                  const updates: Partial<ItineraryStopDto> = { departureTime: newDepartureDateTime };
                  
                  // For pickup: auto-calculate arrivalTime = departureTime - 30 minutes
                  if (isPickup && newDepartureDateTime) {
                    const departureDate = new Date(newDepartureDateTime);
                    departureDate.setMinutes(departureDate.getMinutes() - 30);
                    updates.arrivalTime = departureDate.toISOString();
                  }
                  
                  onUpdate(index, updates);
                }}
                min={minDate}
                className="[&>label]:hidden"
              />
            </div>

            {/* Time Input */}
            <div className="flex-1">
              <FormTimeInput
                label=""
                value={formatTime(stop.departureTime || '')}
                selectedDate={stop.departureTime ? formatDate(stop.departureTime) : minDate}
                onChange={(e) => {
                  const newTime = e.target.value;
                  if (!newTime) {
                    const currentDate = stop.departureTime ? formatDate(stop.departureTime) : minDate;
                    if (currentDate) {
                      const newDateTime = parseDate(currentDate, minTime, stop.departureTime || undefined);
                      const updates: Partial<ItineraryStopDto> = { departureTime: newDateTime };
                      
                      // For pickup: clear arrivalTime if departureTime is cleared
                      if (isPickup) {
                        updates.arrivalTime = '';
                      }
                      
                      onUpdate(index, updates);
                    } else {
                      const updates: Partial<ItineraryStopDto> = { departureTime: null };
                      if (isPickup) {
                        updates.arrivalTime = '';
                      }
                      onUpdate(index, updates);
                    }
                    return;
                  }
                  const currentDate = stop.departureTime ? formatDate(stop.departureTime) : minDate;
                  const selectedDate = currentDate || minDate;
                  const newDepartureDateTime = parseDate(selectedDate, newTime, stop.departureTime || undefined);
                  
                  const updates: Partial<ItineraryStopDto> = { departureTime: newDepartureDateTime };
                  
                  // For pickup: auto-calculate arrivalTime = departureTime - 30 minutes
                  if (isPickup && newDepartureDateTime) {
                    const departureDate = new Date(newDepartureDateTime);
                    departureDate.setMinutes(departureDate.getMinutes() - 30);
                    updates.arrivalTime = departureDate.toISOString();
                  }
                  
                  onUpdate(index, updates);
                }}
                min={(() => {
                  const currentDate = stop.departureTime ? formatDate(stop.departureTime) : minDate;
                  return currentDate === minDate ? minTime : '00:00';
                })()}
                className="[&>label]:hidden"
              />
            </div>
          </div>
        )}
      </div>
    );
};

