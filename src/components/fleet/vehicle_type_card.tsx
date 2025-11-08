import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import type { VehicleType } from '../../types/fleet/vehicle_type';

interface VehicleTypeCardProps {
  vehicleType: VehicleType;
  onEdit: (vehicleType: VehicleType) => void;
  onDelete: (vehicleType: VehicleType) => void;
}

/**
 * Vehicle Type Card Component
 * Displays vehicle type information in grid view
 */
export const VehicleTypeCard: React.FC<VehicleTypeCardProps> = ({
  vehicleType,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const checkTruncation = useCallback(() => {
    if (descriptionRef.current && vehicleType.description) {
      // Check if description is actually truncated (only when not expanded)
      if (!isExpanded) {
        const isTruncated = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
        setShowReadMore(isTruncated);
      } else {
        // When expanded, always show "Show less" button if description exists
        setShowReadMore(true);
      }
    }
  }, [vehicleType.description, isExpanded]);

  useEffect(() => {
    checkTruncation();
  }, [checkTruncation]);

  // Handle resize to re-check truncation when card size changes
  useEffect(() => {
    if (!descriptionRef.current || !vehicleType.description) return;

    const resizeObserver = new ResizeObserver(() => {
      checkTruncation();
    });

    resizeObserver.observe(descriptionRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [checkTruncation, vehicleType.description]);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full self-start flex flex-col bg-[var(--color-bg-card)] rounded-lg shadow-sm p-4 border border-[var(--color-border)] hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-base text-[var(--color-text-primary)] flex-1">
          {vehicleType.name}
        </h3>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => onEdit(vehicleType)}
            className="p-1.5 rounded hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            title="Edit category"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(vehicleType)}
            className="p-1.5 rounded hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-red-600"
            title="Delete category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {vehicleType.description && (
        <div className="mb-3">
          <p
            ref={descriptionRef}
            className={`text-sm text-[var(--color-text-secondary)] ${isExpanded ? '' : 'line-clamp-3'}`}
          >
            {vehicleType.description}
          </p>
          {showReadMore && (
            <button
              onClick={toggleDescription}
              className="mt-1 text-xs text-[var(--color-primary)] hover:underline font-medium"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
        <span className="text-xs text-[var(--color-text-muted)]">
          Vehicles: <span className="font-medium text-[var(--color-text-primary)]">{vehicleType.vehicleCount}</span>
        </span>
      </div>
    </div>
  );
};

