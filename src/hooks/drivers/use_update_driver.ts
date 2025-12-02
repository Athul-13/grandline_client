import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '../../services/api/driver_service';
import type { UpdateDriverRequest, UpdateDriverResponse } from '../../types/drivers/admin_driver';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage } from '../../utils/error_sanitizer';

interface UseUpdateDriverParams {
  driverId: string;
  onSuccess?: () => void;
}

/**
 * Hook for updating driver details
 */
export const useUpdateDriver = ({ driverId, onSuccess }: UseUpdateDriverParams) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateDriverResponse, Error, UpdateDriverRequest>({
    mutationFn: (data: UpdateDriverRequest) => driverService.updateDriver(driverId, data),
    onSuccess: (response) => {
      toast.success(response.message || 'Driver updated successfully!');
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

