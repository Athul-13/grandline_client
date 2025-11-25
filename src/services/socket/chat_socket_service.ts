/**
 * Chat Socket Service
 * Handles chat-related Socket.io events
 */

import { getSocketClient } from './socket_client';
import type {
  JoinChatRequest,
  JoinChatResponse,
  LeaveChatRequest,
  LeaveChatResponse,
  SendMessageSocketRequest,
  MessageSentEvent,
  MessageDeliveredEvent,
  MessageReadEvent,
  TypingStartRequest,
  TypingStopRequest,
  TypingEvent,
  TypingStoppedEvent,
  MarkAsReadSocketRequest,
  UserOnlineEvent,
  UnreadCountUpdatedEvent,
  SocketError,
} from '../../types/chat/chat_socket_events';

/**
 * Chat Socket Service
 * Provides methods for chat-related socket operations
 */
export const chatSocketService = {
  /**
   * Join a chat room
   * Client → Server: join-chat
   * Server → Client: chat-joined
   */
  joinChat: (
    chatId: string,
    onJoined?: (data: JoinChatResponse) => void,
    onError?: (error: SocketError) => void
  ): void => {
    const socket = getSocketClient();

    const handleJoined = (data: JoinChatResponse) => {
      socket.off('chat-joined', handleJoined);
      socket.off('error', handleError);
      onJoined?.(data);
    };

    const handleError = (error: SocketError) => {
      socket.off('chat-joined', handleJoined);
      socket.off('error', handleError);
      onError?.(error);
    };

    socket.once('chat-joined', handleJoined);
    socket.once('error', handleError);

    socket.emit('join-chat', { chatId } as JoinChatRequest);
  },

  /**
   * Leave a chat room
   * Client → Server: leave-chat
   * Server → Client: chat-left
   */
  leaveChat: (
    chatId: string,
    onLeft?: (data: LeaveChatResponse) => void,
    onError?: (error: SocketError) => void
  ): void => {
    const socket = getSocketClient();

    const handleLeft = (data: LeaveChatResponse) => {
      socket.off('chat-left', handleLeft);
      socket.off('error', handleError);
      onLeft?.(data);
    };

    const handleError = (error: SocketError) => {
      socket.off('chat-left', handleLeft);
      socket.off('error', handleError);
      onError?.(error);
    };

    socket.once('chat-left', handleLeft);
    socket.once('error', handleError);

    socket.emit('leave-chat', { chatId } as LeaveChatRequest);
  },

  /**
   * Send a message via socket
   * Client → Server: send-message
   * Server → Client: message-sent
   * Supports both existing chats (chatId) and new chats (contextType + contextId)
   */
  sendMessage: (
    data: {
      chatId?: string;
      contextType?: string;
      contextId?: string;
      content: string;
    },
    onSent?: (message: MessageSentEvent) => void,
    onError?: (error: SocketError) => void
  ): void => {
    const socket = getSocketClient();

    if (!socket.connected) {
      console.error('[ChatSocketService] Cannot send message: socket not connected');
      onError?.({ message: 'Socket not connected', code: 'NOT_CONNECTED' });
      return;
    }

    const handleSent = (message: MessageSentEvent) => {
      socket.off('message-sent', handleSent);
      socket.off('error', handleError);
      onSent?.(message);
    };

    const handleError = (error: SocketError) => {
      console.error('[ChatSocketService] Error sending message:', error);
      socket.off('message-sent', handleSent);
      socket.off('error', handleError);
      onError?.(error);
    };

    socket.once('message-sent', handleSent);
    socket.once('error', handleError);

    socket.emit('send-message', data as SendMessageSocketRequest);
  },

  /**
   * Start typing indicator
   * Client → Server: typing-start
   */
  startTyping: (chatId: string): void => {
    const socket = getSocketClient();
    socket.emit('typing-start', { chatId } as TypingStartRequest);
  },

  /**
   * Stop typing indicator
   * Client → Server: typing-stop
   */
  stopTyping: (chatId: string): void => {
    const socket = getSocketClient();
    socket.emit('typing-stop', { chatId } as TypingStopRequest);
  },

  /**
   * Mark messages as read via socket
   * Client → Server: mark-as-read
   * Server → Client: message-read (emitted for all messages in chat)
   */
  markAsRead: (
    chatId: string,
    onRead?: (data: MessageReadEvent) => void,
    onError?: (error: SocketError) => void
  ): void => {
    const socket = getSocketClient();

    const handleRead = (data: MessageReadEvent) => {
      if (data.chatId === chatId) {
        onRead?.(data);
      }
    };

    const handleError = (error: SocketError) => {
      socket.off('message-read', handleRead);
      socket.off('error', handleError);
      onError?.(error);
    };

    // Keep listener active (not once) since multiple messages may be marked as read
    socket.on('message-read', handleRead);
    socket.once('error', handleError);

    socket.emit('mark-as-read', { chatId } as MarkAsReadSocketRequest);

    // Clean up listener after a short delay (messages should be marked quickly)
    setTimeout(() => {
      socket.off('message-read', handleRead);
      socket.off('error', handleError);
    }, 2000);
  },

  /**
   * Listen for new messages
   * Server → Client: message-sent
   */
  onMessageSent: (callback: (message: MessageSentEvent) => void): (() => void) => {
    const socket = getSocketClient();
    
    if (!socket.connected) {
      console.warn('[ChatSocketService] Socket not connected when setting up message-sent listener');
    }
    
    // Store the actual listener function so we can properly remove it
    const listener = (message: MessageSentEvent) => {
      callback(message);
    };
    
    socket.on('message-sent', listener);
    
    return () => {
      socket.off('message-sent', listener);
    };
  },

  /**
   * Listen for message delivered (double gray tick)
   * Server → Client: message-delivered
   */
  onMessageDelivered: (callback: (data: MessageDeliveredEvent) => void): (() => void) => {
    const socket = getSocketClient();
    
    if (!socket.connected) {
      console.warn('[ChatSocketService] Socket not connected when setting up message-delivered listener');
    }
    
    // Store the actual listener function so we can properly remove it
    const listener = (data: MessageDeliveredEvent) => {
      callback(data);
    };
    
    socket.on('message-delivered', listener);
    
    return () => {
      socket.off('message-delivered', listener);
    };
  },

  /**
   * Listen for message read (double blue tick)
   * Server → Client: message-read
   */
  onMessageRead: (callback: (data: MessageReadEvent) => void): (() => void) => {
    const socket = getSocketClient();
    
    if (!socket.connected) {
      console.warn('[ChatSocketService] Socket not connected when setting up message-read listener');
    }
    
    // Store the actual listener function so we can properly remove it
    const listener = (data: MessageReadEvent) => {
      callback(data);
    };
    
    socket.on('message-read', listener);
    
    return () => {
      socket.off('message-read', listener);
    };
  },

  /**
   * Listen for typing indicator
   * Server → Client: typing
   */
  onTyping: (callback: (data: TypingEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('typing', callback);
    return () => socket.off('typing', callback);
  },

  /**
   * Listen for typing stopped
   * Server → Client: typing-stopped
   */
  onTypingStopped: (callback: (data: TypingStoppedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('typing-stopped', callback);
    return () => socket.off('typing-stopped', callback);
  },

  /**
   * Listen for user online event (for double gray tick)
   * Server → Client: user-online
   */
  onUserOnline: (callback: (data: UserOnlineEvent) => void): (() => void) => {
    const socket = getSocketClient();
    
    if (!socket.connected) {
      console.warn('[ChatSocketService] Socket not connected when setting up user-online listener');
    }
    
    // Store the actual listener function so we can properly remove it
    const listener = (data: UserOnlineEvent) => {
      callback(data);
    };
    
    socket.on('user-online', listener);
    
    return () => {
      socket.off('user-online', listener);
    };
  },

  /**
   * Listen for unread count updates
   * Server → Client: unread-count-updated
   */
  onUnreadCountUpdated: (callback: (data: UnreadCountUpdatedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    
    if (!socket.connected) {
      console.warn('[ChatSocketService] Socket not connected when setting up unread-count-updated listener');
    }
    
    socket.on('unread-count-updated', callback);
    
    return () => {
      socket.off('unread-count-updated', callback);
    };
  },

  /**
   * Listen for socket errors
   * Server → Client: error
   */
  onError: (callback: (error: SocketError) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('error', callback);
    return () => socket.off('error', callback);
  },
};

