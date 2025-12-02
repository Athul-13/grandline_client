import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '../../services/api/driver_service';
import type { UpdateDriverStatusRequest } from '../../types/drivers/admin_driver';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage } from '../../utils/error_sanitizer';

interface UseBulkDriverActionsReturn {
  bulkDelete: (driverIds: string[]) => Promise<void>;
  bulkUpdateStatus: (driverIds: string[], status: UpdateDriverStatusRequest['status']) => Promise<void>;
  isDeleting: boolean;
  isUpdatingStatus: boolean;
}

/**
 * Hook for bulk driver actions (delete and status update)
 */
export const useBulkDriverActions = (): UseBulkDriverActionsReturn => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: (driverId: string) => driverService.deleteDriver(driverId),
    onError: (error) => {
      const errorMessage = sanitizeErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  const statusMutation = useMutation<{ success: boolean; message: string }, Error, { driverId: string; status: UpdateDriverStatusRequest['status'] }>({
    mutationFn: ({ driverId, status }) => driverService.updateDriverStatus(driverId, { status }),
    onError: (error) => {
      const errorMessage = sanitizeErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  const bulkDelete = async (driverIds: string[]): Promise<void> => {
    if (driverIds.length === 0) return;

    try {
      // Execute all delete operations in parallel
      const results = await Promise.allSettled(
        driverIds.map((driverId) => deleteMutation.mutateAsync(driverId))
      );

      // Count successes and failures
      const successes = results.filter((r) => r.status === 'fulfilled').length;
      const failures = results.filter((r) => r.status === 'rejected').length;

      if (successes > 0) {
        toast.success(`Successfully deleted ${successes} driver${successes > 1 ? 's' : ''}`);
        // Invalidate driver list to reflect changes
        queryClient.invalidateQueries({ queryKey: ['adminDrivers'] });
      }

      if (failures > 0) {
        toast.error(`Failed to delete ${failures} driver${failures > 1 ? 's' : ''}`);
      }
    } catch (error) {
      const errorMessage = sanitizeErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const bulkUpdateStatus = async (driverIds: string[], status: UpdateDriverStatusRequest['status']): Promise<void> => {
    if (driverIds.length === 0) return;

    try {
      // Execute all status update operations in parallel
      const results = await Promise.allSettled(
        driverIds.map((driverId) => statusMutation.mutateAsync({ driverId, status }))
      );

      // Count successes and failures
      const successes = results.filter((r) => r.status === 'fulfilled').length;
      const failures = results.filter((r) => r.status === 'rejected').length;

      if (successes > 0) {
        toast.success(`Successfully updated status for ${successes} driver${successes > 1 ? 's' : ''}`);
        // Invalidate driver list and details to reflect changes
        queryClient.invalidateQueries({ queryKey: ['adminDrivers'] });
        driverIds.forEach((driverId) => {
          queryClient.invalidateQueries({ queryKey: ['adminDriverDetails', driverId] });
        });
      }

      if (failures > 0) {
        toast.error(`Failed to update status for ${failures} driver${failures > 1 ? 's' : ''}`);
      }
    } catch (error) {
      const errorMessage = sanitizeErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  return {
    bulkDelete,
    bulkUpdateStatus,
    isDeleting: deleteMutation.isPending,
    isUpdatingStatus: statusMutation.isPending,
  };
};

