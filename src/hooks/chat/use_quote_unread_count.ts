import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../../services/api/chat_service';
import { chatSocketService } from '../../services/socket/chat_socket_service';
import { useSocketConnection } from './use_socket_connection';
import type { UnreadCountUpdatedEvent } from '../../types/chat/chat_socket_events';

interface UseQuoteUnreadCountParams {
  quoteId: string;
}

interface UseQuoteUnreadCountReturn {
  unreadCount: number;
  isLoading: boolean;
}

/**
 * Hook for tracking unread message count for a specific quote
 * Fetches chat by context and then gets unread count
 */
export const useQuoteUnreadCount = (params: UseQuoteUnreadCountParams): UseQuoteUnreadCountReturn => {
  const { quoteId } = params;

  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    setIsLoading(true);

    try {
      // First, get chat by context
      const chatResponse = await chatService.getChatByContext({
        contextType: 'quote',
        contextId: quoteId,
      });

      if (chatResponse.chat?.chatId) {
        setChatId(chatResponse.chat.chatId);
        // Get unread count for this chat
        const countResponse = await chatService.getUnreadCount(chatResponse.chat.chatId);
        setUnreadCount(countResponse.unreadCount);
      } else {
        setChatId(null);
        setUnreadCount(0);
      }
    } catch {
      // Chat doesn't exist yet or error - no unread messages
      setChatId(null);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [quoteId]);

  // Fetch on mount and when quoteId changes
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Set up socket listener for real-time unread count updates
  const { isConnected } = useSocketConnection();

  useEffect(() => {
    if (!isConnected || !chatId) return;

    // Listen for unread count updates
    const cleanup = chatSocketService.onUnreadCountUpdated((data: UnreadCountUpdatedEvent) => {
      // Only update if it's for this chat
      if (data.chatId === chatId) {
        setUnreadCount(data.unreadCount);
      }
    });

    return cleanup;
  }, [isConnected, chatId]);

  return {
    unreadCount,
    isLoading,
  };
};

