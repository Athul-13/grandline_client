import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../../services/api/chat_service';
import { chatSocketService } from '../../services/socket/chat_socket_service';
import type { Chat } from '../../types/chat/chat';

interface UseChatForQuoteParams {
  quoteId: string;
  userId?: string; // User ID from the quote (for future use when creating chats)
  currentUserId?: string; // Current authenticated user ID (for future use)
  currentUserRole?: 'user' | 'admin'; // Current user role (for future use)
}

interface UseChatForQuoteReturn {
  chat: Chat | null;
  isLoading: boolean;
  error: string | null;
  isJoined: boolean;
  joinChat: () => Promise<void>;
  leaveChat: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Main hook for quote chat
 * Gets or creates chat, manages socket room joining/leaving
 */
export const useChatForQuote = (params: UseChatForQuoteParams): UseChatForQuoteReturn => {
  const { quoteId } = params;
  // userId, currentUserId, currentUserRole reserved for future use when creating chats

  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  const fetchChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.getChatByContext({
        contextType: 'quote',
        contextId: quoteId,
      });

      setChat(response.chat);
    } catch (err) {
      console.error('Failed to fetch chat:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch chat');
      setChat(null);
    } finally {
      setIsLoading(false);
    }
  }, [quoteId]);

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
        console.error('Failed to join chat:', err);
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
        console.error('Failed to leave chat:', err);
      }
    );
  }, [chat?.chatId, isJoined]);

  // Fetch chat on mount or when quoteId changes
  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  // Auto-join chat when it's available
  useEffect(() => {
    if (chat?.chatId && !isJoined) {
      joinChat();
    }
  }, [chat?.chatId, isJoined, joinChat]);

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

