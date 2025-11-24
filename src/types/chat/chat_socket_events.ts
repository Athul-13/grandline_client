/**
 * Chat Socket Event Types
 * Types for chat-related Socket.io events matching the API documentation
 */

import type { Chat } from './chat';
import type { Message } from './message';

/**
 * Socket Error
 * Error structure for socket events
 */
export interface SocketError {
  message: string;
  code?: string;
}

// ==================== Chat Socket Events ====================

/**
 * Join Chat Request
 * Client → Server: join-chat
 */
export interface JoinChatRequest {
  chatId: string;
}

/**
 * Join Chat Response
 * Server → Client: chat-joined
 */
export interface JoinChatResponse {
  chatId: string;
}

/**
 * Leave Chat Request
 * Client → Server: leave-chat
 */
export interface LeaveChatRequest {
  chatId: string;
}

/**
 * Leave Chat Response
 * Server → Client: chat-left
 */
export interface LeaveChatResponse {
  chatId: string;
}

/**
 * Create Chat via Socket Request
 * Client → Server: create-chat
 */
export interface CreateChatSocketRequest {
  contextType: string;
  contextId: string;
  participantType: string;
  participants: Array<{
    userId: string;
    participantType: string;
  }>;
}

/**
 * Create Chat via Socket Response
 * Server → Client: chat-created
 */
export type CreateChatSocketResponse = Chat;

/**
 * User Online Event
 * Server → Client: user-online
 */
export interface UserOnlineEvent {
  userId: string;
  chatId: string;
}

// ==================== Message Socket Events ====================

/**
 * Send Message via Socket Request
 * Client → Server: send-message
 */
export interface SendMessageSocketRequest {
  chatId: string;
  content: string;  // Max 5000 characters
}

/**
 * Message Sent Event
 * Server → Client: message-sent
 */
export type MessageSentEvent = Message;

/**
 * Message Delivered Event
 * Server → Client: message-delivered
 */
export interface MessageDeliveredEvent {
  messageId: string;
  chatId: string;
}

/**
 * Message Read Event
 * Server → Client: message-read
 */
export interface MessageReadEvent {
  messageId: string;
  chatId: string;
  readBy: string;
}

/**
 * Typing Start Request
 * Client → Server: typing-start
 */
export interface TypingStartRequest {
  chatId: string;
}

/**
 * Typing Stop Request
 * Client → Server: typing-stop
 */
export interface TypingStopRequest {
  chatId: string;
}

/**
 * Typing Event
 * Server → Client: typing
 */
export interface TypingEvent {
  chatId: string;
  userId: string;
}

/**
 * Typing Stopped Event
 * Server → Client: typing-stopped
 */
export interface TypingStoppedEvent {
  chatId: string;
  userId: string;
}

/**
 * Mark as Read via Socket Request
 * Client → Server: mark-as-read
 */
export interface MarkAsReadSocketRequest {
  chatId: string;
}

