import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../../services/api/chat_service';
import { chatSocketService } from '../../services/socket/chat_socket_service';
import { useSocketConnection } from './use_socket_connection';
import type { UnreadCountUpdatedEvent } from '../../types/chat/chat_socket_events';

interface UseUnreadCountParams {
  chatId?: string | null; // If provided, get count for specific chat; otherwise get total
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
  const { chatId } = params || {};

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

  // Set up socket listener for real-time unread count updates
  const { isConnected } = useSocketConnection();

  useEffect(() => {
    if (!isConnected) return;

    // Listen for unread count updates
    const cleanup = chatSocketService.onUnreadCountUpdated((data: UnreadCountUpdatedEvent) => {
      // If chatId is provided, only update if it matches
      if (chatId && data.chatId !== chatId) {
        return;
      }

      // Update unread count
      if (chatId) {
        // Per-chat unread count
        setUnreadCount(data.unreadCount);
      } else {
        // Total unread count
        setUnreadCount(data.totalUnreadCount);
      }
    });

    return cleanup;
  }, [isConnected, chatId]);

  return {
    unreadCount,
    isLoading,
    error,
    refetch: fetchUnreadCount,
  };
};

