import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService } from '../../services/api/chat_service';
import { chatSocketService } from '../../services/socket/chat_socket_service';
import type { Message } from '../../types/chat/message';
import type { MessageSentEvent, MessageDeliveredEvent, MessageReadEvent } from '../../types/chat/chat_socket_events';

interface UseChatMessagesParams {
  chatId: string | null;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseChatMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  sendMessage: (content: string) => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing chat messages with real-time updates
 */
export const useChatMessages = (params: UseChatMessagesParams): UseChatMessagesReturn => {
  const { chatId, page = 1, limit = 20, autoFetch = true } = params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);

  const cleanupFunctionsRef = useRef<Array<() => void>>([]);

  const fetchMessages = useCallback(async (pageNum: number, append = false) => {
    if (!chatId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.getChatMessages(chatId, {
        page: pageNum,
        limit,
      });

      if (append) {
        setMessages((prev) => [...response.messages, ...prev]);
      } else {
        setMessages(response.messages);
      }

      setHasMore(response.hasMore);
      setTotal(response.total);
      setCurrentPage(pageNum);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  }, [chatId, limit]);

  const sendMessage = useCallback(async (content: string) => {
    if (!chatId || !content.trim()) return;

    try {
      // Send via REST API (server auto-creates chat if needed)
      await chatService.sendMessage({ chatId, content });
      // Real-time update will come via socket event
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  }, [chatId]);

  const markAsRead = useCallback(async () => {
    if (!chatId) return;

    try {
      await chatService.markMessagesAsRead(chatId);
      // Update local messages to mark as read
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          deliveryStatus: 'read' as const,
        }))
      );
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  }, [chatId]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    await fetchMessages(currentPage + 1, true);
  }, [hasMore, isLoading, currentPage, fetchMessages]);

  const refetch = useCallback(async () => {
    await fetchMessages(1, false);
  }, [fetchMessages]);

  // Set up socket listeners for real-time updates
  useEffect(() => {
    if (!chatId) {
      // Cleanup listeners when chatId changes
      cleanupFunctionsRef.current.forEach((cleanup) => cleanup());
      cleanupFunctionsRef.current = [];
      return;
    }

    // Listen for new messages
    const cleanupMessageSent = chatSocketService.onMessageSent((message: MessageSentEvent) => {
      if (message.chatId === chatId) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.messageId === message.messageId)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    });

    // Listen for message delivered (double gray tick)
    const cleanupMessageDelivered = chatSocketService.onMessageDelivered(
      (data: MessageDeliveredEvent) => {
        if (data.chatId === chatId) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.messageId === data.messageId
                ? { ...msg, deliveryStatus: 'delivered' as const }
                : msg
            )
          );
        }
      }
    );

    // Listen for message read (double blue tick)
    const cleanupMessageRead = chatSocketService.onMessageRead((data: MessageReadEvent) => {
      if (data.chatId === chatId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === data.messageId
              ? { ...msg, deliveryStatus: 'read' as const, readBy: data.readBy, readAt: new Date() }
              : msg
          )
        );
      }
    });

    cleanupFunctionsRef.current = [
      cleanupMessageSent,
      cleanupMessageDelivered,
      cleanupMessageRead,
    ];

    return () => {
      cleanupFunctionsRef.current.forEach((cleanup) => cleanup());
      cleanupFunctionsRef.current = [];
    };
  }, [chatId]);

  // Fetch messages on mount or when chatId changes
  useEffect(() => {
    if (autoFetch && chatId) {
      fetchMessages(1, false);
    }
  }, [chatId, autoFetch, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    hasMore,
    total,
    sendMessage,
    loadMore,
    markAsRead,
    refetch,
  };
};

