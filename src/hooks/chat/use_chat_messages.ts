import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService } from '../../services/api/chat_service';
import { chatSocketService } from '../../services/socket/chat_socket_service';
import { useSocketConnection } from './use_socket_connection';
import { useAppSelector } from '../../store/hooks';
import type { Message } from '../../types/chat/message';
import type {
  MessageSentEvent,
  MessageDeliveredEvent,
  MessageReadEvent,
  UserOnlineEvent,
  SocketError,
} from '../../types/chat/chat_socket_events';

interface UseChatMessagesParams {
  chatId: string | null;
  contextId?: string; // For creating chat on first message
  contextType?: string; // For creating chat on first message (default: 'quote')
  onChatCreated?: (chatId: string) => void; // Callback when chat is created after first message
  isJoined?: boolean; // Whether user has joined the chat room
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
  const { chatId, contextId, contextType = 'quote', onChatCreated, isJoined = false, page = 1, limit = 20, autoFetch = true } = params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);

  // Get current user ID for user-online event handling
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?.userId || '';

  // Check socket connection status
  const { isConnected } = useSocketConnection();

  const cleanupFunctionsRef = useRef<Array<() => void>>([]);

  const sortMessages = useCallback((msgs: Message[]): Message[] => {
    return [...msgs].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB; // Oldest first
    });
  }, []);

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
        setMessages((prev) => {
          const combined = [...response.messages, ...prev];
          return sortMessages(combined);
        });
      } else {
        setMessages(sortMessages(response.messages));
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
  }, [chatId, limit, sortMessages]);

  const sendMessage = useCallback(
    (content: string): Promise<void> => {
      if (!content.trim()) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        const messageData: {
          chatId?: string;
          contextType?: string;
          contextId?: string;
          content: string;
        } = {
          content,
        };

        if (chatId) {
          messageData.chatId = chatId;
        } else if (contextId) {
          // First message - send with context info (server auto-creates chat)
          messageData.contextType = contextType || 'quote';
          messageData.contextId = contextId;
        } else {
          reject(new Error('Cannot send message: chatId or (contextType + contextId) is required'));
          return;
        }

        chatSocketService.sendMessage(
          messageData,
          (message: MessageSentEvent) => {
            // Add message optimistically to UI (will be updated via socket event if duplicate)
            setMessages((prev) => {
              // Check if message already exists (from socket event)
              if (prev.some((m) => m.messageId === message.messageId)) {
                return prev;
              }
              const newMessage: Message = {
                messageId: message.messageId,
                chatId: message.chatId,
                senderId: message.senderId,
                content: message.content,
                deliveryStatus: message.deliveryStatus,
                createdAt: message.createdAt,
                readAt: message.readAt,
                readBy: message.readBy,
              };
              const updated = [...prev, newMessage];
              return sortMessages(updated);
            });

            // Notify parent that chat was created (so it can refetch chat and join room)
            if (!chatId && message.chatId && onChatCreated) {
              onChatCreated(message.chatId);
            }

            resolve();
          },
          (error: SocketError) => {
            console.error('Failed to send message via socket:', error);
            reject(new Error(error.message || 'Failed to send message'));
          }
        );
      });
    },
    [chatId, contextId, contextType, onChatCreated, sortMessages]
  );

  const markAsRead = useCallback(() => {
    if (!chatId) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      chatSocketService.markAsRead(
        chatId,
        (data: MessageReadEvent) => {
          // Only mark messages as read if they were sent TO the current user (not by current user)
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.senderId !== currentUserId && msg.chatId === data.chatId) {
                return { ...msg, deliveryStatus: 'read' as const, readBy: data.readBy, readAt: new Date() };
              }
              return msg;
            })
          );
          resolve();
        },
        (error: SocketError) => {
          console.error('Failed to mark messages as read via socket:', error);
          reject(new Error(error.message || 'Failed to mark messages as read'));
        }
      );
    });
  }, [chatId, currentUserId]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    await fetchMessages(currentPage + 1, true);
  }, [hasMore, isLoading, currentPage, fetchMessages]);

  const refetch = useCallback(async () => {
    await fetchMessages(1, false);
  }, [fetchMessages]);

  // Set up socket listeners for real-time updates
  // Listeners work globally (listen to all chats) and filter by chatId in handlers
  useEffect(() => {
    if (!isConnected) {
      cleanupFunctionsRef.current.forEach((cleanup) => cleanup());
      cleanupFunctionsRef.current = [];
      return;
    }

    cleanupFunctionsRef.current.forEach((cleanup) => cleanup());
    cleanupFunctionsRef.current = [];

    // Listen for new messages (works even when chatId is null - will filter in handler)
    const cleanupMessageSent = chatSocketService.onMessageSent((message: MessageSentEvent) => {
      const messageBelongsToCurrentChat = chatId ? message.chatId === chatId : false;
      
      // If chatId is null, we might be waiting for the first message
      // In this case, accept the message if:
      // 1. It's sent by current user (we just sent it)
      // 2. Or we have quoteId and this might be the first message creating the chat
      const isFirstMessage = !chatId && (message.senderId === currentUserId || contextId);
      
      if (!messageBelongsToCurrentChat && !isFirstMessage) {
        return;
      }

      setMessages((prev) => {
        // Avoid duplicates, but update if message already exists (socket might have newer data)
        const existingIndex = prev.findIndex((m) => m.messageId === message.messageId);
        if (existingIndex >= 0) {
          // Message already exists, update it in case socket has newer status
          const updated = [...prev];
          updated[existingIndex] = message;
          return sortMessages(updated);
        }
        const updated = [...prev, message];
        return sortMessages(updated);
      });

      // If this is the first message and we got a chatId from it, notify parent
      if (!chatId && message.chatId && onChatCreated) {
        onChatCreated(message.chatId);
      }
    });

    // Only update status for messages sent BY current user (for showing delivery status to sender)
    const cleanupMessageDelivered = chatSocketService.onMessageDelivered(
      (data: MessageDeliveredEvent) => {
        const messageBelongsToCurrentChat = chatId ? data.chatId === chatId : false;
        if (!messageBelongsToCurrentChat && chatId) {
          return;
        }

        setMessages((prev) =>
          prev.map((msg) => {
            // Only update status if message was sent BY current user and matches the delivered event
            if (msg.messageId === data.messageId && msg.senderId === currentUserId) {
              return { ...msg, deliveryStatus: 'delivered' as const };
            }
            return msg;
          })
        );
      }
    );

    // The message-read event is chat-level: all messages in the chat are marked as read
    // Only update status for messages sent BY current user (for showing read status to sender)
    const cleanupMessageRead = chatSocketService.onMessageRead((data: MessageReadEvent) => {
      if (!chatId || data.chatId !== chatId) return;

      setMessages((prev) =>
        prev.map((msg) => {
          // The server emits a chat-level event (all messages marked as read), not per-message
          if (msg.senderId === currentUserId && msg.chatId === data.chatId && msg.deliveryStatus !== 'read') {
            return { ...msg, deliveryStatus: 'read' as const, readBy: data.readBy, readAt: new Date() };
          }
          return msg;
        })
      );
    });

    // Sets all pending messages to DELIVERED when recipient comes online
    const cleanupUserOnline = chatSocketService.onUserOnline((data: UserOnlineEvent) => {
      if (!chatId || data.chatId !== chatId) return;

      // If the user who came online is NOT the current user, then they are the recipient
      // Update all messages sent by current user (to the recipient) to DELIVERED
      if (data.userId !== currentUserId) {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.senderId === currentUserId && msg.deliveryStatus === 'sent') {
              return { ...msg, deliveryStatus: 'delivered' as const };
            }
            return msg;
          })
        );
      }
    });

    cleanupFunctionsRef.current = [
      cleanupMessageSent,
      cleanupMessageDelivered,
      cleanupMessageRead,
      cleanupUserOnline,
    ];

    return () => {
      cleanupFunctionsRef.current.forEach((cleanup) => cleanup());
      cleanupFunctionsRef.current = [];
    };
  }, [chatId, sortMessages, currentUserId, contextId, onChatCreated, isConnected]);

  // Fetch messages on mount or when chatId changes
  useEffect(() => {
    if (autoFetch && chatId) {
      fetchMessages(1, false);
    }
  }, [chatId, autoFetch, fetchMessages]);

  // This handles the case where first message was sent before chatId existed
  useEffect(() => {
    if (!chatId) return;

    if (messages.length > 0) {
      const hasMessagesForThisChat = messages.some((msg) => msg.chatId === chatId);
      if (!hasMessagesForThisChat && autoFetch) {
        fetchMessages(1, false);
      } else {
        setMessages((prev) => sortMessages(prev));
      }
    } else if (autoFetch) {
      fetchMessages(1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, autoFetch]);

  // Auto-mark messages as read when user joins chat room (after messages are loaded)
  useEffect(() => {
    if (chatId && isJoined && messages.length > 0 && !isLoading) {
      const hasUnreadMessages = messages.some(
        (msg) => msg.senderId !== currentUserId && msg.deliveryStatus !== 'read'
      );
      if (hasUnreadMessages) {
        markAsRead();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, isJoined, messages.length, isLoading]);

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

