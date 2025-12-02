import { useState } from 'react';
import { driverService } from '../../services/api/driver_service';
import type { CreateDriverRequest, CreateDriverResponse } from '../../types/drivers/admin_driver';

interface UseCreateDriverReturn {
  createDriver: (data: CreateDriverRequest) => Promise<CreateDriverResponse>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for creating a driver
 */
export const useCreateDriver = (): UseCreateDriverReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDriver = async (data: CreateDriverRequest): Promise<CreateDriverResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await driverService.createDriver(data);
      setIsLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create driver';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  return {
    createDriver,
    isLoading,
    error,
  };
};

