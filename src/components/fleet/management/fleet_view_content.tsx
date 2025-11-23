import React from 'react';
import { cn } from '../../utils/cn';
import { VehicleTypeCard } from '../cards/vehicle_type_card';
import { VehicleTypeListCard } from '../cards/vehicle_type_list_card';
import { AmenityCard } from '../cards/amenity_card';
import { VehicleCard } from '../cards/vehicle_card';
import { VehicleListCard } from '../cards/vehicle_list_card';
import type { VehicleType } from '../../types/fleet/vehicle_type';
import type { Vehicle } from '../../types/fleet/vehicle';
import type { Amenity } from '../../types/fleet/amenity';

type ViewMode = 'grid' | 'list';

interface FleetViewContentProps {
  view: 'vehicles' | 'categories' | 'amenities';
  viewMode: ViewMode;
  // Vehicles
  vehicles: Vehicle[];
  isLoadingVehicles: boolean;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicle: Vehicle) => void;
  // Categories
  vehicleTypes: VehicleType[];
  isLoadingVehicleTypes: boolean;
  onEditCategory: (vehicleType: VehicleType) => void;
  onDeleteCategory: (vehicleType: VehicleType) => void;
  // Amenities
  amenities: Amenity[];
  isLoadingAmenities: boolean;
  onEditAmenity: (amenity: Amenity) => void;
  onDeleteAmenity: (amenity: Amenity) => void;
}

/**
 * Fleet View Content Component
 * Renders vehicles, categories, or amenities based on current view
 */
export const FleetViewContent: React.FC<FleetViewContentProps> = ({
  view,
  viewMode,
  vehicles,
  isLoadingVehicles,
  onEditVehicle,
  onDeleteVehicle,
  vehicleTypes,
  isLoadingVehicleTypes,
  onEditCategory,
  onDeleteCategory,
  amenities,
  isLoadingAmenities,
  onEditAmenity,
  onDeleteAmenity,
}) => {
  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto',
        (viewMode === 'grid' || view === 'amenities')
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 items-start'
          : 'space-y-2'
      )}
    >
      {view === 'categories' ? (
        // Categories View
        isLoadingVehicleTypes ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <p className="text-[var(--color-text-secondary)]">Loading categories...</p>
          </div>
        ) : vehicleTypes.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <p className="text-[var(--color-text-secondary)]">No categories yet.</p>
          </div>
        ) : (
          <>
            {vehicleTypes.map((vehicleType) =>
              viewMode === 'grid' ? (
                <VehicleTypeCard
                  key={vehicleType.vehicleTypeId}
                  vehicleType={vehicleType}
                  onEdit={onEditCategory}
                  onDelete={onDeleteCategory}
                />
              ) : (
                <VehicleTypeListCard
                  key={vehicleType.vehicleTypeId}
                  vehicleType={vehicleType}
                  onEdit={onEditCategory}
                  onDelete={onDeleteCategory}
                />
              )
            )}
          </>
        )
      ) : view === 'amenities' ? (
        // Amenities View (grid only)
        isLoadingAmenities ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <p className="text-[var(--color-text-secondary)]">Loading amenities...</p>
          </div>
        ) : amenities.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <p className="text-[var(--color-text-secondary)]">No amenities yet.</p>
          </div>
        ) : (
          amenities.map((amenity) => (
            <AmenityCard
              key={amenity.amenityId}
              amenity={amenity}
              onEdit={onEditAmenity}
              onDelete={onDeleteAmenity}
            />
          ))
        )
      ) : (
        // Vehicles View
        isLoadingVehicles ? (
          <div
            className={cn(
              viewMode === 'grid' ? 'col-span-full' : '',
              'flex items-center justify-center py-12'
            )}
          >
            <p className="text-[var(--color-text-secondary)]">Loading vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div
            className={cn(
              viewMode === 'grid' ? 'col-span-full' : '',
              'flex items-center justify-center py-12'
            )}
          >
            <p className="text-[var(--color-text-secondary)]">No vehicles found.</p>
          </div>
        ) : (
          vehicles.map((vehicle) =>
            viewMode === 'grid' ? (
              <VehicleCard
                key={vehicle.vehicleId}
                vehicle={vehicle}
                onEdit={onEditVehicle}
                onDelete={onDeleteVehicle}
              />
            ) : (
              <VehicleListCard
                key={vehicle.vehicleId}
                vehicle={vehicle}
                onEdit={onEditVehicle}
                onDelete={onDeleteVehicle}
              />
            )
          )
        )
      )}
    </div>
  );
};

