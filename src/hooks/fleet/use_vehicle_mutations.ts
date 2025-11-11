import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../../services/api/vehicle_service';
import type {
  CreateVehicleRequest,
  CreateVehicleResponse,
  UpdateVehicleRequest,
  UpdateVehicleResponse,
} from '../../types/fleet/vehicle';

/**
 * Custom hook to manage vehicle mutations (create, update)
 * Uses TanStack Query mutation for automatic cache management and state updates
 */
export const useVehicleMutations = () => {
  const queryClient = useQueryClient();

  // Create vehicle mutation
  const createVehicle = useMutation<
    CreateVehicleResponse,
    Error,
    CreateVehicleRequest
  >({
    mutationFn: async (data: CreateVehicleRequest) => {
      return await vehicleService.createVehicle(data);
    },
    onSuccess: () => {
      // Invalidate and refetch vehicles list
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (error: Error) => {
      console.error('Create vehicle failed:', error);
    },
  });

  // Update vehicle mutation
  const updateVehicle = useMutation<
    UpdateVehicleResponse,
    Error,
    { id: string; data: UpdateVehicleRequest }
  >({
    mutationFn: async ({ id, data }) => {
      return await vehicleService.updateVehicle(id, data);
    },
    onSuccess: () => {
      // Invalidate and refetch vehicles list
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (error: Error) => {
      console.error('Update vehicle failed:', error);
    },
  });

  return {
    createVehicle,
    updateVehicle,
    // Convenience properties for loading states
    isCreating: createVehicle.isPending,
    isUpdating: updateVehicle.isPending,
    isPending: createVehicle.isPending || updateVehicle.isPending,
  };
};

