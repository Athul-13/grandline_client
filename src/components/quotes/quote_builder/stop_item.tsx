import { useState } from 'react';
import { X, GripVertical } from 'lucide-react';
import { cn } from '../../../utils/cn';
import type { ItineraryStopDto } from '../../../types/quotes/itinerary';
import { StopType } from '../../../types/quotes/itinerary';

interface StopItemProps {
  stop: ItineraryStopDto;
  index: number;
  isDragging?: boolean;
  onUpdate: (index: number, updates: Partial<ItineraryStopDto>) => void;
  onRemove: (index: number) => void;
  onDragStart?: (index: number) => void;
  onDragEnd?: () => void;
  onDragOver?: (index: number) => void;
  onDrop?: (fromIndex: number, toIndex: number) => void;
}

/**
 * Stop Item Component
 * Individual stop in itinerary with drag & drop support
 */
export const StopItem: React.FC<StopItemProps> = ({
  stop,
  index,
  isDragging = false,
  onUpdate,
  onRemove,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
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

  const getStopLabel = () => {
    if (stop.stopType === StopType.PICKUP) return 'Pickup';
    if (stop.stopType === StopType.DROPOFF) return 'Dropoff';
    return `Stop ${index}`;
  };

  const formatDateTimeLocal = (isoString: string): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const parseDateTimeLocal = (value: string): string => {
    if (!value) return '';
    return new Date(value).toISOString();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={cn(
        'bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)] transition-all',
        isDragging && 'opacity-50',
        isDraggedOver && 'border-[var(--color-primary)] border-2 bg-[var(--color-primary)]/5'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div className="cursor-move mt-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Stop Content */}
        <div className="flex-1 space-y-3">
          {/* Stop Header */}
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-[var(--color-text-primary)]">{getStopLabel()}</h4>
            {stop.stopType === StopType.STOP && (
              <button
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Location
            </label>
            <input
              type="text"
              value={stop.locationName}
              onChange={(e) => onUpdate(index, { locationName: e.target.value })}
              className="w-full px-3 py-2 rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Location name"
            />
          </div>

          {/* Arrival Time */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Arrival Time
            </label>
            <input
              type="datetime-local"
              value={formatDateTimeLocal(stop.arrivalTime)}
              onChange={(e) =>
                onUpdate(index, { arrivalTime: parseDateTimeLocal(e.target.value) })
              }
              className="w-full px-3 py-2 rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* Driver Stay Checkbox */}
          {stop.stopType === StopType.STOP && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`driver-stay-${index}`}
                checked={stop.isDriverStaying}
                onChange={(e) => onUpdate(index, { isDriverStaying: e.target.checked })}
                className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <label
                htmlFor={`driver-stay-${index}`}
                className="text-sm text-[var(--color-text-secondary)] cursor-pointer"
              >
                Driver needs to stay here
              </label>
            </div>
          )}

          {/* Departure Time (if driver staying) */}
          {stop.isDriverStaying && stop.stopType === StopType.STOP && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                Departure Time
              </label>
              <input
                type="datetime-local"
                value={stop.departureTime ? formatDateTimeLocal(stop.departureTime) : ''}
                onChange={(e) =>
                  onUpdate(index, { departureTime: parseDateTimeLocal(e.target.value) })
                }
                className="w-full px-3 py-2 rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

