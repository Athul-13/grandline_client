import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import type { VehicleType } from '../../../types/fleet/vehicle_type';

interface VehicleTypeListCardProps {
  vehicleType: VehicleType;
  onEdit: (vehicleType: VehicleType) => void;
  onDelete: (vehicleType: VehicleType) => void;
}

/**
 * Vehicle Type List Card Component
 * Displays vehicle type information in list view (horizontal layout)
 */
export const VehicleTypeListCard: React.FC<VehicleTypeListCardProps> = ({
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
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm p-4 border border-[var(--color-border)] hover:shadow-md transition-shadow flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-base text-[var(--color-text-primary)]">
            {vehicleType.name}
          </h3>
          <span className="text-xs">
            <span className="text-[var(--color-primary)] font-medium">Vehicles:</span> <span className="font-medium text-[var(--color-text-primary)]">{vehicleType.vehicleCount}</span>
          </span>
        </div>
        {vehicleType.description && (
          <div>
            <p
              ref={descriptionRef}
              className={`text-sm text-[var(--color-text-secondary)] ${isExpanded ? '' : 'line-clamp-1'}`}
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
      </div>

      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => onEdit(vehicleType)}
          className="p-2 rounded hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
          title="Edit category"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(vehicleType)}
          className="p-2 rounded hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-red-600"
          title="Delete category"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

