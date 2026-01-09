import { useMutation, useQueryClient } from '@tanstack/react-query';
import { amenityService } from '../../services/api/amenity_service';
import { fleetQueryKeys } from '../../utils/fleet_query_keys';
import type {
  Amenity,
  CreateAmenityRequest,
  CreateAmenityResponse,
  UpdateAmenityRequest,
  UpdateAmenityResponse,
} from '../../types/fleet/amenity';

/**
 * Custom hook to manage amenity mutations (create, update, delete)
 * Uses TanStack Query mutation for automatic cache management and state updates
 */
export const useAmenityMutations = () => {
  const queryClient = useQueryClient();

  // Create amenity mutation with optimistic update
  const createAmenity = useMutation<
    CreateAmenityResponse,
    Error,
    CreateAmenityRequest,
    { previousQueries: Array<[unknown, unknown]>; previousAllQueries: Array<[unknown, unknown]> }
  >({
    mutationFn: async (data: CreateAmenityRequest) => {
      return await amenityService.createAmenity(data);
    },
    onMutate: async (newAmenity) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fleetQueryKeys.amenities.all() });

      // Snapshot the previous value
      const previousQueries = queryClient.getQueriesData({ 
        queryKey: fleetQueryKeys.amenities.lists() 
      });
      const previousAllQueries = queryClient.getQueriesData({ 
        queryKey: fleetQueryKeys.amenities.allList() 
      });

      // Optimistically update all amenity lists
      queryClient.setQueriesData<{ data: Amenity[]; pagination: unknown }>(
        { queryKey: fleetQueryKeys.amenities.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: [newAmenity as unknown as Amenity, ...old.data],
          };
        }
      );

      // Optimistically update all amenities list (non-paginated)
      queryClient.setQueriesData<Amenity[]>(
        { queryKey: fleetQueryKeys.amenities.allList() },
        (old) => {
          if (!old) return old;
          return [newAmenity as unknown as Amenity, ...old];
        }
      );

      return { previousQueries, previousAllQueries };
    },
    onError: (error, _newAmenity, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach((entry) => {
          const [queryKey, data] = entry;
          queryClient.setQueryData(queryKey as readonly unknown[], data);
        });
      }
      if (context?.previousAllQueries) {
        context.previousAllQueries.forEach((entry) => {
          const [queryKey, data] = entry;
          queryClient.setQueryData(queryKey as readonly unknown[], data);
        });
      }
      console.error('Create amenity failed:', error);
    },
    onSuccess: (response) => {
      // Update with actual server response
      queryClient.setQueriesData<{ data: Amenity[]; pagination: unknown }>(
        { queryKey: fleetQueryKeys.amenities.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((a) =>
              a.amenityId === response.amenity.amenityId ? response.amenity : a
            ),
          };
        }
      );
      queryClient.setQueriesData<Amenity[]>(
        { queryKey: fleetQueryKeys.amenities.allList() },
        (old) => {
          if (!old) return old;
          return old.map((a) =>
            a.amenityId === response.amenity.amenityId ? response.amenity : a
          );
        }
      );
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: fleetQueryKeys.amenities.all(),
        refetchType: 'active' 
      });
    },
  });

  // Update amenity mutation with optimistic update
  const updateAmenity = useMutation<
    UpdateAmenityResponse,
    Error,
    { id: string; data: UpdateAmenityRequest },
    { previousQueries: Array<[unknown, unknown]>; previousAllQueries: Array<[unknown, unknown]> }
  >({
    mutationFn: async ({ id, data }) => {
      return await amenityService.updateAmenity(id, data);
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fleetQueryKeys.amenities.all() });

      // Snapshot the previous value
      const previousQueries = queryClient.getQueriesData({ 
        queryKey: fleetQueryKeys.amenities.lists() 
      });
      const previousAllQueries = queryClient.getQueriesData({ 
        queryKey: fleetQueryKeys.amenities.allList() 
      });

      // Optimistically update all amenity lists
      queryClient.setQueriesData<{ data: Amenity[]; pagination: unknown }>(
        { queryKey: fleetQueryKeys.amenities.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((a) =>
              a.amenityId === id ? { ...a, ...data } : a
            ),
          };
        }
      );

      // Optimistically update all amenities list (non-paginated)
      queryClient.setQueriesData<Amenity[]>(
        { queryKey: fleetQueryKeys.amenities.allList() },
        (old) => {
          if (!old) return old;
          return old.map((a) =>
            a.amenityId === id ? { ...a, ...data } : a
          );
        }
      );

      return { previousQueries, previousAllQueries };
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach((entry) => {
          const [queryKey, data] = entry;
          queryClient.setQueryData(queryKey as readonly unknown[], data);
        });
      }
      if (context?.previousAllQueries) {
        context.previousAllQueries.forEach((entry) => {
          const [queryKey, data] = entry;
          queryClient.setQueryData(queryKey as readonly unknown[], data);
        });
      }
      console.error('Update amenity failed:', error);
    },
    onSuccess: (updatedAmenity) => {
      // Update with actual server response
      queryClient.setQueriesData<{ data: Amenity[]; pagination: unknown }>(
        { queryKey: fleetQueryKeys.amenities.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((a) =>
              a.amenityId === updatedAmenity.amenity.amenityId
                ? updatedAmenity.amenity
                : a
            ),
          };
        }
      );
      queryClient.setQueriesData<Amenity[]>(
        { queryKey: fleetQueryKeys.amenities.allList() },
        (old) => {
          if (!old) return old;
          return old.map((a) =>
            a.amenityId === updatedAmenity.amenity.amenityId
              ? updatedAmenity.amenity
              : a
          );
        }
      );
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: fleetQueryKeys.amenities.all(),
        refetchType: 'active' 
      });
    },
  });

  // Delete amenity mutation with optimistic update
  const deleteAmenity = useMutation<
    string,
    Error,
    string,
    { previousQueries: Array<[unknown, unknown]>; previousAllQueries: Array<[unknown, unknown]> }
  >({
    mutationFn: async (id: string) => {
      await amenityService.deleteAmenity(id);
      return id;
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fleetQueryKeys.amenities.all() });

      // Snapshot the previous value
      const previousQueries = queryClient.getQueriesData({ 
        queryKey: fleetQueryKeys.amenities.lists() 
      });
      const previousAllQueries = queryClient.getQueriesData({ 
        queryKey: fleetQueryKeys.amenities.allList() 
      });

      // Optimistically remove from all amenity lists
      queryClient.setQueriesData<{ data: Amenity[]; pagination: unknown }>(
        { queryKey: fleetQueryKeys.amenities.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((a) => a.amenityId !== id),
          };
        }
      );

      // Optimistically remove from all amenities list (non-paginated)
      queryClient.setQueriesData<Amenity[]>(
        { queryKey: fleetQueryKeys.amenities.allList() },
        (old) => {
          if (!old) return old;
          return old.filter((a) => a.amenityId !== id);
        }
      );

      return { previousQueries, previousAllQueries };
    },
    onError: (error, _id, context) => {
      // Rollback on error
      if (context?.previousQueries) {
        context.previousQueries.forEach((entry) => {
          const [queryKey, data] = entry;
          queryClient.setQueryData(queryKey as readonly unknown[], data);
        });
      }
      if (context?.previousAllQueries) {
        context.previousAllQueries.forEach((entry) => {
          const [queryKey, data] = entry;
          queryClient.setQueryData(queryKey as readonly unknown[], data);
        });
      }
      console.error('Delete amenity failed:', error);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: fleetQueryKeys.amenities.all(),
        refetchType: 'active' 
      });
    },
  });

  return {
    createAmenity,
    updateAmenity,
    deleteAmenity,
    // Convenience properties for loading states
    isCreating: createAmenity.isPending,
    isUpdating: updateAmenity.isPending,
    isDeleting: deleteAmenity.isPending,
    isPending: createAmenity.isPending || updateAmenity.isPending || deleteAmenity.isPending,
  };
};

