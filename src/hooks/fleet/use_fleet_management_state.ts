import { useState } from 'react';
import type { VehicleType } from '../../types/fleet/vehicle_type';
import type { Vehicle } from '../../types/fleet/vehicle';
import type { Amenity } from '../../types/fleet/amenity';

type SortField = 'status' | 'vehicleTypeId' | 'year' | 'capacity' | 'vehicleModel' | 'maintenance' | 'fuelConsumption';
type SortDirection = 'asc' | 'desc';

/**
 * Custom hook for managing fleet management page state
 * Centralizes all modal and editing state management
 */
export const useFleetManagementState = () => {
  // Sort state
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Modal states
  const [showVehicleTypeModal, setShowVehicleTypeModal] = useState(false);
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAmenityModal, setShowDeleteAmenityModal] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  // Editing states
  const [editingVehicleType, setEditingVehicleType] = useState<VehicleType | undefined>(undefined);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | undefined>(undefined);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>(undefined);
  const [deletingVehicleType, setDeletingVehicleType] = useState<VehicleType | undefined>(undefined);
  const [deletingAmenity, setDeletingAmenity] = useState<Amenity | undefined>(undefined);

  // Sort handlers
  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleSortFieldChange = (field: SortField) => {
    setSortField(field);
  };

  // Modal handlers
  const openVehicleTypeModal = (vehicleType?: VehicleType) => {
    setEditingVehicleType(vehicleType);
    setShowVehicleTypeModal(true);
  };

  const closeVehicleTypeModal = () => {
    setShowVehicleTypeModal(false);
    setEditingVehicleType(undefined);
  };

  const openAmenityModal = (amenity?: Amenity) => {
    setEditingAmenity(amenity);
    setShowAmenityModal(true);
  };

  const closeAmenityModal = () => {
    setShowAmenityModal(false);
    setEditingAmenity(undefined);
  };

  const openVehicleModal = (vehicle?: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowVehicleModal(true);
  };

  const closeVehicleModal = () => {
    setShowVehicleModal(false);
    setEditingVehicle(undefined);
  };

  const openDeleteVehicleTypeModal = (vehicleType: VehicleType) => {
    setDeletingVehicleType(vehicleType);
    setShowDeleteModal(true);
  };

  const closeDeleteVehicleTypeModal = () => {
    setShowDeleteModal(false);
    setDeletingVehicleType(undefined);
  };

  const openDeleteAmenityModal = (amenity: Amenity) => {
    setDeletingAmenity(amenity);
    setShowDeleteAmenityModal(true);
  };

  const closeDeleteAmenityModal = () => {
    setShowDeleteAmenityModal(false);
    setDeletingAmenity(undefined);
  };

  return {
    // Sort state
    sortField,
    sortDirection,
    // Modal states
    showVehicleTypeModal,
    showAmenityModal,
    showVehicleModal,
    showDeleteModal,
    showDeleteAmenityModal,
    showFilterSidebar,
    // Editing states
    editingVehicleType,
    editingAmenity,
    editingVehicle,
    deletingVehicleType,
    deletingAmenity,
    // Sort handlers
    toggleSortDirection,
    handleSortFieldChange,
    setSortField,
    setSortDirection,
    // Modal handlers
    openVehicleTypeModal,
    closeVehicleTypeModal,
    openAmenityModal,
    closeAmenityModal,
    openVehicleModal,
    closeVehicleModal,
    openDeleteVehicleTypeModal,
    closeDeleteVehicleTypeModal,
    openDeleteAmenityModal,
    closeDeleteAmenityModal,
    setShowFilterSidebar,
  };
};

