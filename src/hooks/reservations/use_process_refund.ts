import { useState } from 'react';
import { adminReservationService } from '../../services/api/admin_reservation_service';
import type { ProcessReservationRefundRequest } from '../../types/reservations/admin_reservation';
import type { AdminReservationDetailsResponse } from '../../types/reservations/admin_reservation';

interface UseProcessRefundReturn {
  processRefund: (id: string, data: ProcessReservationRefundRequest) => Promise<{ reservation: AdminReservationDetailsResponse; refundId: string } | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for processing reservation refund (admin only)
 */
export const useProcessRefund = (): UseProcessRefundReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processRefund = async (
    id: string,
    data: ProcessReservationRefundRequest
  ): Promise<{ reservation: AdminReservationDetailsResponse; refundId: string } | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminReservationService.processRefund(id, data);
      return response;
    } catch (err) {
      console.error('Failed to process refund:', err);
      setError(err instanceof Error ? err.message : 'Failed to process refund');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processRefund,
    isLoading,
    error,
  };
};

