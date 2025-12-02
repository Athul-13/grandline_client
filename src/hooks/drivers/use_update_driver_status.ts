import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '../../services/api/driver_service';
import type { UpdateDriverStatusRequest, UpdateDriverStatusResponse } from '../../types/drivers/admin_driver';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage } from '../../utils/error_sanitizer';

interface UseUpdateDriverStatusParams {
  driverId: string;
  onSuccess?: () => void;
}

/**
 * Hook for updating driver status
 */
export const useUpdateDriverStatus = ({ driverId, onSuccess }: UseUpdateDriverStatusParams) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateDriverStatusResponse, Error, UpdateDriverStatusRequest>({
    mutationFn: (data: UpdateDriverStatusRequest) => driverService.updateDriverStatus(driverId, data),
    onSuccess: (response) => {
      toast.success(response.message || 'Driver status updated successfully!');
      // Invalidate and refetch driver details
      queryClient.invalidateQueries({ queryKey: ['adminDriverDetails', driverId] });
      // Invalidate driver list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['adminDrivers'] });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      const errorMessage = sanitizeErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};

