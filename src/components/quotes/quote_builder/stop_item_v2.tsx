import { useState, useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '../../../utils/cn';
import type { ItineraryStopDto } from '../../../types/quotes/itinerary';
import { formatDate, formatTime, parseDate } from '../../../utils/date_utils';
import { AddressAutocomplete } from './address_autocomplete';
import type { GeocodeSuggestion } from '../../../services/api/mapbox_geocoding_service';

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
  onLocationSelect?: (suggestion: GeocodeSuggestion) => void; // Callback when location is selected from autocomplete
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
  onLocationSelect,
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

  // Memoize min date/time for validation - always use current time
  const minDate = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);
  const minTime = useMemo(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }, []);

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
            <AddressAutocomplete
              value={stop.locationName || ''}
              onChange={(value) => onUpdate(index, { locationName: value })}
              onSelect={(suggestion) => {
                onUpdate(index, {
                  locationName: suggestion.place_name || suggestion.text,
                  latitude: suggestion.center[1],
                  longitude: suggestion.center[0],
                });
                if (onLocationSelect) {
                  onLocationSelect(suggestion);
                }
              }}
              placeholder="Address"
              accessToken={mapboxAccessToken}
            />
          ) : (
            <input
              type="text"
              value={stop.locationName || ''}
              onChange={(e) => onUpdate(index, { locationName: e.target.value })}
              placeholder="Address"
              className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />
          )}
        </div>

        {/* Date and Time Inputs */}
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
                const newDateTime = parseDate(currentDate || minDate, newTime, stop.arrivalTime);
                onUpdate(index, { arrivalTime: newDateTime });
              }}
              min={minTime}
              className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] appearance-none"
            />
            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    );
};

