import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '../../services/api/driver_service';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage } from '../../utils/error_sanitizer';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

interface UseDeleteDriverParams {
  driverId: string;
  onSuccess?: () => void;
}

/**
 * Hook for deleting a driver (soft delete)
 */
export const useDeleteDriver = ({ driverId, onSuccess }: UseDeleteDriverParams) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<{ success: boolean; message: string }, Error, void>({
    mutationFn: () => driverService.deleteDriver(driverId),
    onSuccess: (response) => {
      toast.success(response.message || 'Driver deleted successfully!');
      // Invalidate driver list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['adminDrivers'] });
      // Navigate back to driver list
      navigate(ROUTES.admin.driverManagement);
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

