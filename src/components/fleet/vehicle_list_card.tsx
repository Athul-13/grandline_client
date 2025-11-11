import React, { useState } from 'react';
import { Edit, Trash2, ChevronDown, ChevronUp, Users, IndianRupee } from 'lucide-react';
import type { Vehicle } from '../../types/fleet/vehicle';
import { VehicleStatus } from '../../types/fleet/vehicle';
import { ImageGalleryModal } from '../common/image_gallery_modal';
import { cn } from '../../utils/cn';
import { useSearchContext } from '../../hooks/use_search_context';
import { highlightSearchTerm } from '../../utils/highlight_search';

interface VehicleListCardProps {
  vehicle: Vehicle;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}

/**
 * Get status badge styling based on vehicle status
 */
const getStatusBadgeClass = (status: string): string => {
  const statusLower = status.toLowerCase();
  if (statusLower === 'available' || statusLower === VehicleStatus.AVAILABLE) {
    return 'bg-[var(--color-status-available-bg)] text-[var(--color-status-available-text)]';
  }
  if (statusLower === 'in_service' || statusLower === 'in use' || statusLower === VehicleStatus.IN_SERVICE) {
    return 'bg-[var(--color-status-in-service-bg)] text-[var(--color-status-in-service-text)]';
  }
  if (statusLower === 'maintenance' || statusLower === VehicleStatus.MAINTENANCE) {
    return 'bg-[var(--color-status-maintenance-bg)] text-[var(--color-status-maintenance-text)]';
  }
  if (statusLower === 'retired' || statusLower === VehicleStatus.RETIRED) {
    return 'bg-[var(--color-status-retired-bg)] text-[var(--color-status-retired-text)]';
  }
  return 'bg-[var(--color-status-retired-bg)] text-[var(--color-status-retired-text)]';
};

/**
 * Format status text for display
 */
const formatStatus = (status: string): string => {
  const statusLower = status.toLowerCase();
  if (statusLower === 'in_service' || statusLower === 'in use') {
    return 'In Service';
  }
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
};

/**
 * Vehicle List Card Component
 * Displays vehicle information in list view with expandable details
 */
export const VehicleListCard: React.FC<VehicleListCardProps> = ({
  vehicle,
  onEdit,
  onDelete,
}) => {
  const { searchQuery } = useSearchContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  // Default placeholder image if no images provided
  const defaultImage = 'https://via.placeholder.com/150x100?text=No+Image';
  const vehicleImages = vehicle.imageUrls || [];
  const displayImage = vehicleImages.length > 0 ? vehicleImages[0] : defaultImage;
  const hasImages = vehicleImages.length > 0;

  const handleImageClick = () => {
    if (hasImages) {
      setGalleryInitialIndex(0);
      setIsGalleryOpen(true);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow overflow-hidden">
        <div className="flex items-center gap-3 py-3 px-3">
          {/* Vehicle Image Thumbnail - Smaller */}
          <div
            className={cn(
              'relative w-16 h-16 flex-shrink-0 bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden cursor-pointer group',
              !hasImages && 'cursor-default'
            )}
            onClick={handleImageClick}
          >
            <img
              src={displayImage}
              alt={vehicle.vehicleModel}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
            />
            {hasImages && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium transition-opacity">
                  {vehicleImages.length > 1 ? `${vehicleImages.length}` : 'View'}
                </span>
              </div>
            )}
          </div>

          {/* Main Content - Compact */}
          <div className="flex-1 min-w-0">
            {/* Header Row - Compact Single Line */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-[var(--color-text-primary)] truncate">
                  {highlightSearchTerm(vehicle.vehicleModel, searchQuery)}
                </h3>
                <span className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap">
                  {vehicle.year}
                </span>
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap',
                    getStatusBadgeClass(vehicle.status)
                  )}
                >
                  {formatStatus(vehicle.status)}
                </span>
                {/* Inline metrics */}
                <span className="text-xs text-[var(--color-text-secondary)]">
                  <Users className="w-3 h-3 inline mr-0.5 text-[var(--color-primary)]" />
                  <span className="font-medium text-[var(--color-text-primary)]">{vehicle.capacity}</span>
                  {vehicle.baseFare && (
                    <>
                      <span className="mx-1">•</span>
                      <IndianRupee className="w-3 h-3 inline mr-0.5 text-[var(--color-primary)]" />
                      <span className="font-medium text-[var(--color-text-primary)]">₹{vehicle.baseFare}</span>
                    </>
                  )}
                  <span className="mx-1">•</span>
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {highlightSearchTerm(vehicle.plateNumber, searchQuery)}
                  </span>
                  <span className="mx-1">•</span>
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {highlightSearchTerm(
                      vehicle.vehicleType?.name || vehicle.vehicleTypeId,
                      searchQuery
                    )}
                  </span>
                </span>
              </div>
              {(onEdit || onDelete) && (
                <div className="flex items-center gap-0.5 ml-2 flex-shrink-0">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(vehicle)}
                      className="p-1 rounded hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                      title="Edit vehicle"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(vehicle)}
                      className="p-1 rounded hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-red-600"
                      title="Delete vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Expandable Details - Compact */}
            {isExpanded && (
              <div className="pt-1.5 mt-1.5 border-t border-[var(--color-border)] space-y-1 text-xs">
                <div className="flex items-center gap-3 flex-wrap">
                  <div>
                    <span className="text-[var(--color-text-secondary)]">Fuel: </span>
                    <span className="font-medium text-[var(--color-text-primary)]">{vehicle.fuelConsumption} L/100km</span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-secondary)]">Maintenance: </span>
                    <span className="font-medium text-[var(--color-text-primary)]">₹{vehicle.maintenance}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Expand/Collapse Button - Compact */}
            <button
              onClick={toggleExpanded}
              className="mt-1 flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline font-medium transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  More Details
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {hasImages && (
        <ImageGalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          images={vehicleImages}
          initialIndex={galleryInitialIndex}
          title={vehicle.vehicleModel}
        />
      )}
    </>
  );
};

