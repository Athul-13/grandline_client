import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../../services/api/vehicle_service';
import { fleetQueryKeys } from '../../utils/fleet_query_keys';
import type {
  Vehicle,
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

  // Create vehicle mutation with optimistic update
  const createVehicle = useMutation<
    CreateVehicleResponse,
    Error,
    CreateVehicleRequest,
    { previousQueries: Array<[unknown, unknown]> }
  >({
    mutationFn: async (data: CreateVehicleRequest) => {
      return await vehicleService.createVehicle(data);
    },
    onMutate: async (newVehicle) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fleetQueryKeys.vehicles.all() });

      // Snapshot the previous value
      const previousQueries = queryClient.getQueriesData({ 
        queryKey: fleetQueryKeys.vehicles.lists() 
      });

      // Optimistically update all vehicle lists
      queryClient.setQueriesData<{ data: Vehicle[]; pagination: unknown }>(
        { queryKey: fleetQueryKeys.vehicles.lists() },
        (old) => {
          if (!old) return old;
          // Add new vehicle to the beginning of the list
          return {
            ...old,
            data: [newVehicle as unknown as Vehicle, ...old.data],
          };
        }
      );

      return { previousQueries };
    },
    onError: (error, newVehicle, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach((entry) => {
          const [queryKey, data] = entry;
          queryClient.setQueryData(queryKey as readonly unknown[], data);
        });
      }
      console.error('Create vehicle failed:', error);
    },
    onSuccess: (response) => {
      // Update with actual server response
      queryClient.setQueriesData<{ data: Vehicle[]; pagination: unknown }>(
        { queryKey: fleetQueryKeys.vehicles.lists() },
        (old) => {
          if (!old) return old;
          // Replace optimistic item with actual response
          return {
            ...old,
            data: old.data.map((v) =>
              v.vehicleId === response.vehicle.vehicleId
                ? response.vehicle
                : v
            ),
          };
        }
      );
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: fleetQueryKeys.vehicles.all(),
        refetchType: 'active' 
      });
    },
  });

  // Update vehicle mutation with optimistic update
  const updateVehicle = useMutation<
    UpdateVehicleResponse,
    Error,
    { id: string; data: UpdateVehicleRequest },
    { previousQueries: Array<[unknown, unknown]> }
  >({
    mutationFn: async ({ id, data }) => {
      return await vehicleService.updateVehicle(id, data);
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fleetQueryKeys.vehicles.all() });

      // Snapshot the previous value
      const previousQueries = queryClient.getQueriesData({ 
        queryKey: fleetQueryKeys.vehicles.lists() 
      });

      // Optimistically update all vehicle lists
      queryClient.setQueriesData<{ data: Vehicle[]; pagination: unknown }>(
        { queryKey: fleetQueryKeys.vehicles.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((v) =>
              v.vehicleId === id
                ? { ...v, ...data } // Optimistic update
                : v
            ),
          };
        }
      );

      return { previousQueries };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach((entry) => {
          const [queryKey, data] = entry;
          queryClient.setQueryData(queryKey as readonly unknown[], data);
        });
      }
      console.error('Update vehicle failed:', error);
    },
    onSuccess: (updatedVehicle) => {
      // Update with actual server response
      queryClient.setQueriesData<{ data: Vehicle[]; pagination: unknown }>(
        { queryKey: fleetQueryKeys.vehicles.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((v) =>
              v.vehicleId === updatedVehicle.vehicle.vehicleId
                ? updatedVehicle.vehicle
                : v
            ),
          };
        }
      );
    },
    onSettled: () => {
      // Refetch to ensure consistency (only active queries)
      queryClient.invalidateQueries({ 
        queryKey: fleetQueryKeys.vehicles.all(),
        refetchType: 'active' 
      });
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

