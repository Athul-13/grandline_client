import React from 'react';
import { VehicleTypeFormModal } from '../forms/vehicle_type_form_modal';
import { AmenityFormModal } from '../forms/amenity_form_modal';
import { VehicleFormModal } from '../forms/vehicle_form_modal';
import { ConfirmationModal } from '../../common/modals/confirmation_modal';
import type { VehicleType } from '../../types/fleet/vehicle_type';
import type { Vehicle } from '../../types/fleet/vehicle';
import type { Amenity } from '../../types/fleet/amenity';

interface FleetModalsProps {
  // Vehicle Type Modal
  showVehicleTypeModal: boolean;
  editingVehicleType?: VehicleType;
  onCloseVehicleTypeModal: () => void;
  // Amenity Modal
  showAmenityModal: boolean;
  editingAmenity?: Amenity;
  onCloseAmenityModal: () => void;
  // Vehicle Modal
  showVehicleModal: boolean;
  editingVehicle?: Vehicle;
  onCloseVehicleModal: () => void;
  onVehicleSuccess?: () => void;
  // Delete Modals
  showDeleteModal: boolean;
  deletingVehicleType?: VehicleType;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => Promise<void>;
  isDeletingVehicleType: boolean;
  showDeleteAmenityModal: boolean;
  deletingAmenity?: Amenity;
  onCloseDeleteAmenityModal: () => void;
  onConfirmDeleteAmenity: () => Promise<void>;
  isDeletingAmenity: boolean;
}

/**
 * Fleet Modals Component
 * Groups all modals used in fleet management
 */
export const FleetModals: React.FC<FleetModalsProps> = ({
  showVehicleTypeModal,
  editingVehicleType,
  onCloseVehicleTypeModal,
  showAmenityModal,
  editingAmenity,
  onCloseAmenityModal,
  showVehicleModal,
  editingVehicle,
  onCloseVehicleModal,
  onVehicleSuccess,
  showDeleteModal,
  deletingVehicleType,
  onCloseDeleteModal,
  onConfirmDelete,
  isDeletingVehicleType,
  showDeleteAmenityModal,
  deletingAmenity,
  onCloseDeleteAmenityModal,
  onConfirmDeleteAmenity,
  isDeletingAmenity,
}) => {
  return (
    <>
      {/* Vehicle Type Form Modal */}
      <VehicleTypeFormModal
        isOpen={showVehicleTypeModal}
        onClose={onCloseVehicleTypeModal}
        mode={editingVehicleType ? 'edit' : 'add'}
        vehicleType={editingVehicleType}
      />

      {/* Amenity Form Modal */}
      <AmenityFormModal
        isOpen={showAmenityModal}
        onClose={onCloseAmenityModal}
        mode={editingAmenity ? 'edit' : 'add'}
        amenity={editingAmenity}
      />

      {/* Vehicle Form Modal */}
      <VehicleFormModal
        isOpen={showVehicleModal}
        onClose={onCloseVehicleModal}
        mode={editingVehicle ? 'edit' : 'add'}
        vehicle={editingVehicle}
        onSuccess={onVehicleSuccess}
      />

      {/* Delete Category Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={onCloseDeleteModal}
        onConfirm={onConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingVehicleType?.name}"?`}
        warning={
          deletingVehicleType && deletingVehicleType.vehicleCount > 0
            ? `This category has ${deletingVehicleType.vehicleCount} vehicle(s). Deleting it may affect those vehicles.`
            : undefined
        }
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeletingVehicleType}
        variant="danger"
      />

      {/* Delete Amenity Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteAmenityModal}
        onClose={onCloseDeleteAmenityModal}
        onConfirm={onConfirmDeleteAmenity}
        title="Delete Amenity"
        message={`Are you sure you want to delete "${deletingAmenity?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeletingAmenity}
        variant="danger"
      />
    </>
  );
};

