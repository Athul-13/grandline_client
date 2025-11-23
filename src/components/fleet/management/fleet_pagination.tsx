import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Pagination } from '../../common/ui/pagination';
import { fleetQueryKeys } from '../../../utils/fleet_query_keys';
import { vehicleService } from '../../../services/api/vehicle_service';
import { vehicleTypeService } from '../../../services/api/vehicle_type_service';
import { amenityService } from '../../../services/api/amenity_service';

interface FleetPaginationProps {
  view: 'vehicles' | 'categories' | 'amenities';
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  filterParams?: Record<string, unknown>;
}

/**
 * Fleet Pagination Component
 * Conditional pagination based on current view with prefetching
 */
export const FleetPagination: React.FC<FleetPaginationProps> = ({
  view,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  filterParams,
}) => {
  const queryClient = useQueryClient();

  // Prefetch next/previous pages on hover
  const handleMouseEnter = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    const params = {
      page,
      limit: itemsPerPage,
      ...filterParams,
    };

    if (view === 'vehicles') {
      queryClient.prefetchQuery({
        queryKey: fleetQueryKeys.vehicles.list(params),
        queryFn: async () => {
          const response = await vehicleService.getVehicles(params);
          return {
            data: response.data,
            pagination: response.pagination,
          };
        },
      });
    } else if (view === 'categories') {
      queryClient.prefetchQuery({
        queryKey: fleetQueryKeys.vehicleTypes.list({ page, limit: itemsPerPage }),
        queryFn: async () => {
          const response = await vehicleTypeService.getVehicleTypes({ page, limit: itemsPerPage });
          return {
            data: response.data,
            pagination: response.pagination,
          };
        },
      });
    } else if (view === 'amenities') {
      queryClient.prefetchQuery({
        queryKey: fleetQueryKeys.amenities.list({ page, limit: itemsPerPage }),
        queryFn: async () => {
          const response = await amenityService.getAmenities({ page, limit: itemsPerPage });
          return {
            data: response.data,
            pagination: response.pagination,
          };
        },
      });
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageHover={handleMouseEnter}
      />
    </div>
  );
};

