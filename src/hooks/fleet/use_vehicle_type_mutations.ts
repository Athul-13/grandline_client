import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleTypeService } from '../../services/api/vehicle_type_service';
import { fleetQueryKeys } from '../../utils/fleet_query_keys';
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

  // Create vehicle type mutation with optimistic update
  const createVehicleType = useMutation<
    CreateVehicleTypeResponse,
    Error,
    CreateVehicleTypeRequest,
    { previousQueries: Array<[unknown, unknown]>; previousAllQuery: VehicleType[] | undefined }
  >({
    mutationFn: async (data: CreateVehicleTypeRequest) => {
      return await vehicleTypeService.createVehicleType(data);
    },
    onMutate: async (newVehicleType) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fleetQueryKeys.vehicleTypes.all() });

      // Snapshot the previous value
      const previousQueries = queryClient.getQueriesData({ 
        queryKey: fleetQueryKeys.vehicleTypes.lists() 
      });

      // Optimistically update all vehicle type lists
      queryClient.setQueriesData<{ data: VehicleType[]; pagination: unknown }>(
        { queryKey: fleetQueryKeys.vehicleTypes.lists() },
        (old) => {
          if (!old) return old;
          // Add new vehicle type to the beginning of the list
          return {
            ...old,
            data: [newVehicleType as unknown as VehicleType, ...old.data],
          };
        }
      );

      // Optimistically update all vehicle types list (non-paginated)
      const previousAllQuery = queryClient.getQueryData<VehicleType[]>(
        fleetQueryKeys.vehicleTypes.allList()
      );
      
      queryClient.setQueryData<VehicleType[]>(
        fleetQueryKeys.vehicleTypes.allList(),
        (old) => {
          if (!old) return old;
          return [newVehicleType as unknown as VehicleType, ...old];
        }
      );

      return { previousQueries, previousAllQuery };
    },
    onError: (error, newVehicleType, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach((entry) => {
          const [queryKey, data] = entry;
          queryClient.setQueryData(queryKey as readonly unknown[], data);
        });
      }
      if (context?.previousAllQuery !== undefined) {
        queryClient.setQueryData(fleetQueryKeys.vehicleTypes.allList(), context.previousAllQuery);
      }
      console.error('Create vehicle type failed:', error);
    },
    onSuccess: (response) => {
      // Update with actual server response
      queryClient.setQueriesData<{ data: VehicleType[]; pagination: unknown }>(
        { queryKey: fleetQueryKeys.vehicleTypes.lists() },
        (old) => {
          if (!old) return old;
          // Replace optimistic item with actual response
          return {
            ...old,
            data: old.data.map((vt) =>
              vt.vehicleTypeId === response.vehicleType.vehicleTypeId
                ? response.vehicleType
                : vt
            ),
          };
        }
      );
      queryClient.setQueryData<VehicleType[]>(
        fleetQueryKeys.vehicleTypes.allList(),
        (old) => {
          if (!old) return old;
          return old.map((vt) =>
            vt.vehicleTypeId === response.vehicleType.vehicleTypeId
              ? response.vehicleType
              : vt
          );
        }
      );
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: fleetQueryKeys.vehicleTypes.all(),
        refetchType: 'active' 
      });
    },
  });

  // Update vehicle type mutation with optimistic update
  const updateVehicleType = useMutation<
    VehicleType,
    Error,
    { id: string; data: UpdateVehicleTypeRequest },
    { previousQueries: Array<[unknown, unknown]>; previousAllQuery: VehicleType[] | undefined }
  >({
    mutationFn: async ({ id, data }) => {
      return await vehicleTypeService.updateVehicleType(id, data);
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fleetQueryKeys.vehicleTypes.all() });

      // Snapshot the previous value
      const previousQueries = queryClient.getQueriesData({ 
        queryKey: fleetQueryKeys.vehicleTypes.lists() 
      });
      const previousAllQuery = queryClient.getQueryData<VehicleType[]>(
        fleetQueryKeys.vehicleTypes.allList()
      );

      // Optimistically update all vehicle type lists
      queryClient.setQueriesData<{ data: VehicleType[]; pagination: unknown }>(
        { queryKey: fleetQueryKeys.vehicleTypes.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((vt) =>
              vt.vehicleTypeId === id
                ? { ...vt, ...data } // Optimistic update
                : vt
            ),
          };
        }
      );

      // Optimistically update all vehicle types list (non-paginated)
      queryClient.setQueryData<VehicleType[]>(
        fleetQueryKeys.vehicleTypes.allList(),
        (old) => {
          if (!old) return old;
          return old.map((vt) =>
            vt.vehicleTypeId === id ? { ...vt, ...data } : vt
          );
        }
      );

      return { previousQueries, previousAllQuery };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach((entry) => {
          const [queryKey, data] = entry;
          queryClient.setQueryData(queryKey as readonly unknown[], data);
        });
      }
      if (context?.previousAllQuery !== undefined) {
        queryClient.setQueryData(fleetQueryKeys.vehicleTypes.allList(), context.previousAllQuery);
      }
      console.error('Update vehicle type failed:', error);
    },
    onSuccess: (updatedVehicleType) => {
      // Update with actual server response
      queryClient.setQueriesData<{ data: VehicleType[]; pagination: unknown }>(
        { queryKey: fleetQueryKeys.vehicleTypes.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((vt) =>
              vt.vehicleTypeId === updatedVehicleType.vehicleTypeId
                ? updatedVehicleType
                : vt
            ),
          };
        }
      );
    },
    onSettled: () => {
      // Refetch to ensure consistency (only active queries)
      queryClient.invalidateQueries({ 
        queryKey: fleetQueryKeys.vehicleTypes.all(),
        refetchType: 'active' 
      });
    },
  });

  // Delete vehicle type mutation with optimistic update
  const deleteVehicleType = useMutation<
    string,
    Error,
    string,
    { previousQueries: Array<[unknown, unknown]>; previousAllQuery: VehicleType[] | undefined }
  >({
    mutationFn: async (id: string) => {
      await vehicleTypeService.deleteVehicleType(id);
      return id;
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fleetQueryKeys.vehicleTypes.all() });

      // Snapshot the previous value
      const previousQueries = queryClient.getQueriesData({ 
        queryKey: fleetQueryKeys.vehicleTypes.lists() 
      });
      const previousAllQuery = queryClient.getQueryData<VehicleType[]>(
        fleetQueryKeys.vehicleTypes.allList()
      );

      // Optimistically remove from all vehicle type lists
      queryClient.setQueriesData<{ data: VehicleType[]; pagination: unknown }>(
        { queryKey: fleetQueryKeys.vehicleTypes.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((vt) => vt.vehicleTypeId !== id),
          };
        }
      );

      // Optimistically remove from all vehicle types list (non-paginated)
      queryClient.setQueryData<VehicleType[]>(
        fleetQueryKeys.vehicleTypes.allList(),
        (old) => {
          if (!old) return old;
          return old.filter((vt) => vt.vehicleTypeId !== id);
        }
      );

      return { previousQueries, previousAllQuery };
    },
    onError: (error, id, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach((entry) => {
          const [queryKey, data] = entry;
          queryClient.setQueryData(queryKey as readonly unknown[], data);
        });
      }
      if (context?.previousAllQuery !== undefined) {
        queryClient.setQueryData(fleetQueryKeys.vehicleTypes.allList(), context.previousAllQuery);
      }
      console.error('Delete vehicle type failed:', error);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: fleetQueryKeys.vehicleTypes.all(),
        refetchType: 'active' 
      });
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

