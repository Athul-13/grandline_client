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

    // Set up one-time listeners
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
   */
  sendMessage: (
    chatId: string,
    content: string,
    onSent?: (message: MessageSentEvent) => void,
    onError?: (error: SocketError) => void
  ): void => {
    const socket = getSocketClient();

    const handleSent = (message: MessageSentEvent) => {
      socket.off('message-sent', handleSent);
      socket.off('error', handleError);
      onSent?.(message);
    };

    const handleError = (error: SocketError) => {
      socket.off('message-sent', handleSent);
      socket.off('error', handleError);
      onError?.(error);
    };

    socket.once('message-sent', handleSent);
    socket.once('error', handleError);

    socket.emit('send-message', { chatId, content } as SendMessageSocketRequest);
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
   * Server → Client: message-read
   */
  markAsRead: (
    chatId: string,
    onRead?: (data: MessageReadEvent) => void,
    onError?: (error: SocketError) => void
  ): void => {
    const socket = getSocketClient();

    const handleRead = (data: MessageReadEvent) => {
      socket.off('message-read', handleRead);
      socket.off('error', handleError);
      onRead?.(data);
    };

    const handleError = (error: SocketError) => {
      socket.off('message-read', handleRead);
      socket.off('error', handleError);
      onError?.(error);
    };

    socket.once('message-read', handleRead);
    socket.once('error', handleError);

    socket.emit('mark-as-read', { chatId } as MarkAsReadSocketRequest);
  },

  /**
   * Listen for new messages
   * Server → Client: message-sent
   */
  onMessageSent: (callback: (message: MessageSentEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('message-sent', callback);
    return () => socket.off('message-sent', callback);
  },

  /**
   * Listen for message delivered (double gray tick)
   * Server → Client: message-delivered
   */
  onMessageDelivered: (callback: (data: MessageDeliveredEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('message-delivered', callback);
    return () => socket.off('message-delivered', callback);
  },

  /**
   * Listen for message read (double blue tick)
   * Server → Client: message-read
   */
  onMessageRead: (callback: (data: MessageReadEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('message-read', callback);
    return () => socket.off('message-read', callback);
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
    socket.on('user-online', callback);
    return () => socket.off('user-online', callback);
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

