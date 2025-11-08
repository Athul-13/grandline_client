import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleTypeService } from '../../services/api/vehicle_type_service';
import type {
  VehicleType,
  CreateVehicleTypeRequest,
  CreateVehicleTypeResponse,
  UpdateVehicleTypeRequest,
} from '../../types/fleet/vehicle_type';

/**
 * Custom hook to manage vehicle type mutations (create, update, delete)
 * Uses TanStack Query mutation for automatic cache management and state updates
 */
export const useVehicleTypeMutations = () => {
  const queryClient = useQueryClient();

  // Create vehicle type mutation
  const createVehicleType = useMutation<
    CreateVehicleTypeResponse,
    Error,
    CreateVehicleTypeRequest
  >({
    mutationFn: async (data: CreateVehicleTypeRequest) => {
      return await vehicleTypeService.createVehicleType(data);
    },
    onSuccess: () => {
      // Invalidate and refetch vehicle types list
      queryClient.invalidateQueries({ queryKey: ['vehicleTypes'] });
    },
    onError: (error: Error) => {
      console.error('Create vehicle type failed:', error);
    },
  });

  // Update vehicle type mutation
  const updateVehicleType = useMutation<
    VehicleType,
    Error,
    { id: string; data: UpdateVehicleTypeRequest }
  >({
    mutationFn: async ({ id, data }) => {
      return await vehicleTypeService.updateVehicleType(id, data);
    },
    onSuccess: () => {
      // Invalidate and refetch vehicle types list
      queryClient.invalidateQueries({ queryKey: ['vehicleTypes'] });
    },
    onError: (error: Error) => {
      console.error('Update vehicle type failed:', error);
    },
  });

  // Delete vehicle type mutation
  const deleteVehicleType = useMutation<string, Error, string>({
    mutationFn: async (id: string) => {
      await vehicleTypeService.deleteVehicleType(id);
      return id;
    },
    onSuccess: () => {
      // Invalidate and refetch vehicle types list
      queryClient.invalidateQueries({ queryKey: ['vehicleTypes'] });
    },
    onError: (error: Error) => {
      console.error('Delete vehicle type failed:', error);
    },
  });

  return {
    createVehicleType,
    updateVehicleType,
    deleteVehicleType,
    // Convenience properties for loading states
    isCreating: createVehicleType.isPending,
    isUpdating: updateVehicleType.isPending,
    isDeleting: deleteVehicleType.isPending,
    isPending: createVehicleType.isPending || updateVehicleType.isPending || deleteVehicleType.isPending,
  };
};

