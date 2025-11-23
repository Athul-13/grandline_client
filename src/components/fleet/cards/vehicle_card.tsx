import React, { useState, useEffect } from 'react';
import { Edit, Trash2, ChevronDown, ChevronUp, Users, IndianRupee } from 'lucide-react';
import type { Vehicle } from '../../types/fleet/vehicle';
import { VehicleStatus } from '../../types/fleet/vehicle';
import { ImageGalleryModal } from '../../common/modals/image_gallery_modal';
import { cn } from '../../utils/cn';
import { useSearchContext } from '../../hooks/use_search_context';
import { highlightSearchTerm, matchesSearch } from '../../utils/highlight_search';

interface VehicleCardProps {
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
 * Vehicle Card Component
 * Displays vehicle information in grid view with expandable details
 */
export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onEdit,
  onDelete,
}) => {
  const { searchQuery } = useSearchContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  // Auto-expand if plate number matches search query
  useEffect(() => {
    if (searchQuery.trim() && matchesSearch(vehicle.plateNumber, searchQuery)) {
      setIsExpanded(true);
    }
  }, [searchQuery, vehicle.plateNumber]);

  // Default placeholder image if no images provided
  const defaultImage = 'https://via.placeholder.com/400x250?text=No+Image';
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
      <div className="w-full self-start flex flex-col bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
        {/* First Row - Image and Right Content */}
        <div className="flex flex-row p-4">
          {/* Vehicle Image - Left Side */}
          <div
            className={cn(
              'relative w-24 h-24 flex-shrink-0 bg-[var(--color-bg-secondary)] cursor-pointer overflow-hidden group rounded-lg',
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
                  View
                </span>
              </div>
            )}
          </div>

          {/* Right Content - Status, Actions, and Metrics */}
          <div className="flex-1  flex flex-col min-w-0 ps-4">
            {/* Status Badge and Action Buttons - Top Row */}
            <div className="mb-2 flex items-center">
              <span
                className={cn(
                  'px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap inline-block',
                  getStatusBadgeClass(vehicle.status)
                )}
              >
                {formatStatus(vehicle.status)}
              </span>
              {(onEdit || onDelete) && (
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(vehicle)}
                      className="p-1.5 rounded hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                      title="Edit vehicle"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(vehicle)}
                      className="p-1.5 rounded hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-red-600"
                      title="Delete vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Key Metrics - Seats and Base Price */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                <Users className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="font-medium text-[var(--color-text-primary)]">{vehicle.capacity}</span>
                <span className="text-xs">seats</span>
              </div>
              {vehicle.baseFare && (
                <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                  <IndianRupee className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="font-medium text-[var(--color-text-primary)]">₹{vehicle.baseFare}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section - Full Width (Name, Year, Expandable Details, View Details Button) */}
        <div className="px-4 pb-4 border-t border-[var(--color-border)]">
          {/* Name and Year */}
          <div className="pt-3">
            <h3 className="font-semibold text-base text-[var(--color-text-primary)] truncate mb-0.5">
              {highlightSearchTerm(vehicle.vehicleModel, searchQuery)}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {vehicle.year}
            </p>
          </div>

          {/* Expandable Details Section */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-[var(--color-border)] space-y-1.5 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[var(--color-text-secondary)]">Plate:</span>
                  <span className="ml-1 font-medium text-[var(--color-text-primary)]">
                    {highlightSearchTerm(vehicle.plateNumber, searchQuery)}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--color-text-secondary)]">Type:</span>
                  <span className="ml-1 font-medium text-[var(--color-text-primary)]">
                    {highlightSearchTerm(
                      vehicle.vehicleType?.name || vehicle.vehicleTypeId,
                      searchQuery
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--color-text-secondary)]">Fuel:</span>
                  <span className="ml-1 font-medium text-[var(--color-text-primary)]">{vehicle.fuelConsumption} L/100km</span>
                </div>
                <div>
                  <span className="text-[var(--color-text-secondary)]">Maintenance:</span>
                  <span className="ml-1 font-medium text-[var(--color-text-primary)]">₹{vehicle.maintenance}</span>
                </div>
              </div>
            </div>
          )}

          {/* View Details Button */}
          <button
            onClick={toggleExpanded}
            className="mt-3 flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline font-medium transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                View Details
              </>
            )}
          </button>
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

