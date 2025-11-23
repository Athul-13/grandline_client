import React from 'react';
import { cn } from '../../utils/cn';
import type { Amenity } from '../../types/fleet/amenity';

interface AmenitiesSelectorProps {
  amenities: Amenity[];
  selectedAmenityIds: string[];
  onToggle: (amenityId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * Amenities Selector Component
 * Reusable component for selecting amenities in forms
 */
export const AmenitiesSelector: React.FC<AmenitiesSelectorProps> = ({
  amenities,
  selectedAmenityIds,
  onToggle,
  isLoading = false,
  disabled = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-[var(--color-text-secondary)]">Loading amenities...</p>
      </div>
    );
  }

  if (amenities.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-[var(--color-text-secondary)]">No amenities available</p>
      </div>
    );
  }

  return (
    <div className="max-h-48 overflow-y-auto border border-[var(--color-border)] rounded-lg p-3 bg-[var(--color-bg-card)]">
      <div className="space-y-2">
        {amenities.map((amenity) => (
          <label
            key={amenity.amenityId}
            className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-bg-hover)] p-2 rounded transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedAmenityIds.includes(amenity.amenityId)}
              onChange={() => onToggle(amenity.amenityId)}
              disabled={disabled}
              className={cn(
                'w-4 h-4 rounded border-[var(--color-border)]',
                'text-[var(--color-primary)] focus:ring-[var(--color-primary)]',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            />
            <span className="text-sm text-[var(--color-text-primary)]">{amenity.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

