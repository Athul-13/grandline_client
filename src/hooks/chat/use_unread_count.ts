import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../../services/api/chat_service';

interface UseUnreadCountParams {
  chatId?: string | null; // If provided, get count for specific chat; otherwise get total
  pollInterval?: number; // Poll interval in milliseconds (default: 30000 = 30 seconds)
}

interface UseUnreadCountReturn {
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for tracking unread message counts
 * Supports both per-chat and total unread counts
 */
export const useUnreadCount = (params?: UseUnreadCountParams): UseUnreadCountReturn => {
  const { chatId, pollInterval = 30000 } = params || {};

  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (chatId) {
        // Get unread count for specific chat
        const response = await chatService.getUnreadCount(chatId);
        setUnreadCount(response.unreadCount);
      } else {
        // Get total unread count across all chats
        const response = await chatService.getTotalUnreadCount();
        setUnreadCount(response.totalUnreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch unread count');
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [chatId]);

  // Fetch on mount and when chatId changes
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Set up polling if pollInterval is provided
  useEffect(() => {
    if (pollInterval <= 0) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval, fetchUnreadCount]);

  return {
    unreadCount,
    isLoading,
    error,
    refetch: fetchUnreadCount,
  };
};

