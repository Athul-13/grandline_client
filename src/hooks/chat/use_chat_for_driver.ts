import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../../services/api/chat_service';
import { chatSocketService } from '../../services/socket/chat_socket_service';
import type { Chat } from '../../types/chat/chat';

interface UseChatForDriverParams {
  driverId: string;
  autoJoin?: boolean; // Whether to automatically join chat room when chat is available (default: false)
}

interface UseChatForDriverReturn {
  chat: Chat | null;
  isLoading: boolean;
  error: string | null;
  isJoined: boolean;
  joinChat: () => Promise<void>;
  leaveChat: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook for driver chat
 * Gets or creates chat for admin-to-driver communication, manages socket room joining/leaving
 */
export const useChatForDriver = (params: UseChatForDriverParams): UseChatForDriverReturn => {
  const { driverId, autoJoin = false } = params;

  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  const fetchChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.getChatByContext({
        contextType: 'driver',
        contextId: driverId,
      });

      setChat(response.chat);
    } catch (err) {
      console.error('Failed to fetch driver chat:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch driver chat');
      setChat(null);
    } finally {
      setIsLoading(false);
    }
  }, [driverId]);

  const joinChat = useCallback(async () => {
    if (!chat?.chatId) {
      // Chat doesn't exist yet - it will be created when first message is sent
      return;
    }

    chatSocketService.joinChat(
      chat.chatId,
      () => {
        setIsJoined(true);
      },
      (err) => {
        console.error('Failed to join driver chat:', err);
        setError(err.message);
      }
    );
  }, [chat?.chatId]);

  const leaveChat = useCallback(async () => {
    if (!chat?.chatId || !isJoined) return;

    chatSocketService.leaveChat(
      chat.chatId,
      () => {
        setIsJoined(false);
      },
      (err) => {
        console.error('Failed to leave driver chat:', err);
      }
    );
  }, [chat?.chatId, isJoined]);

  // Fetch chat on mount or when driverId changes
  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  // Auto-join chat when it's available (only if autoJoin is true)
  useEffect(() => {
    if (autoJoin && chat?.chatId && !isJoined) {
      joinChat();
    }
  }, [autoJoin, chat?.chatId, isJoined, joinChat]);

  // Cleanup: leave chat on unmount
  useEffect(() => {
    return () => {
      if (chat?.chatId && isJoined) {
        leaveChat();
      }
    };
  }, [chat?.chatId, isJoined, leaveChat]);

  return {
    chat,
    isLoading,
    error,
    isJoined,
    joinChat,
    leaveChat,
    refetch: fetchChat,
  };
};

