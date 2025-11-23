import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import type { Amenity } from '../../../types/fleet/amenity';

interface AmenityCardProps {
  amenity: Amenity;
  onEdit: (amenity: Amenity) => void;
  onDelete: (amenity: Amenity) => void;
}

/**
 * Amenity Card Component
 * Displays amenity information in grid view
 */
export const AmenityCard: React.FC<AmenityCardProps> = ({
  amenity,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full self-start flex flex-col bg-[var(--color-bg-card)] rounded-lg shadow-sm p-4 border border-[var(--color-border)] hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-base text-[var(--color-text-primary)] flex-1">
          {amenity.name}
        </h3>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => onEdit(amenity)}
            className="p-1.5 rounded hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            title="Edit amenity"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(amenity)}
            className="p-1.5 rounded hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-red-600"
            title="Delete amenity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {amenity.price !== null && amenity.price !== undefined && (
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
          <span className="text-xs">
            <span className="text-[var(--color-primary)] font-medium">Price:</span>{' '}
            <span className="font-medium text-[var(--color-text-primary)]">₹{amenity.price}</span>
          </span>
        </div>
      )}
    </div>
  );
};

