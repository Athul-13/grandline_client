import { useState } from 'react';
import { userService } from '../../services/api/user_service';

interface UseDeleteAccountReturn {
  deleteAccount: (password: string) => Promise<{ message: string } | null>;
  isLoading: boolean;
  error: string | null;
}

export const useDeleteAccount = (): UseDeleteAccountReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = async (password: string): Promise<{ message: string } | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userService.deleteAccount(password);
      return response;
    } catch (err: unknown) {
      const errorMessage = 
        (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (err as { message?: string })?.message ||
        'Failed to delete account';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteAccount, isLoading, error };
};

