import { useMutation, useQueryClient } from '@tanstack/react-query';
import { amenityService } from '../../services/api/amenity_service';
import type {
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

  // Create amenity mutation
  const createAmenity = useMutation<
    CreateAmenityResponse,
    Error,
    CreateAmenityRequest
  >({
    mutationFn: async (data: CreateAmenityRequest) => {
      return await amenityService.createAmenity(data);
    },
    onSuccess: () => {
      // Invalidate and refetch amenities list
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      queryClient.invalidateQueries({ queryKey: ['allAmenities'] });
    },
    onError: (error: Error) => {
      console.error('Create amenity failed:', error);
    },
  });

  // Update amenity mutation
  const updateAmenity = useMutation<
    UpdateAmenityResponse,
    Error,
    { id: string; data: UpdateAmenityRequest }
  >({
    mutationFn: async ({ id, data }) => {
      return await amenityService.updateAmenity(id, data);
    },
    onSuccess: () => {
      // Invalidate and refetch amenities list
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      queryClient.invalidateQueries({ queryKey: ['allAmenities'] });
    },
    onError: (error: Error) => {
      console.error('Update amenity failed:', error);
    },
  });

  // Delete amenity mutation
  const deleteAmenity = useMutation<string, Error, string>({
    mutationFn: async (id: string) => {
      await amenityService.deleteAmenity(id);
      return id;
    },
    onSuccess: () => {
      // Invalidate and refetch amenities list
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      queryClient.invalidateQueries({ queryKey: ['allAmenities'] });
    },
    onError: (error: Error) => {
      console.error('Delete amenity failed:', error);
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

