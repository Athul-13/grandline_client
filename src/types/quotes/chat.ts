/**
 * Chat Types
 * Types for quote chat/negotiation features (for later phase)
 */

/**
 * Chat Message
 */
export interface ChatMessage {
  messageId: string;
  quoteId: string;
  senderId: string;
  senderRole: 'user' | 'admin';
  message: string;
  isRead: boolean;
  createdAt: Date | string;
}

/**
 * Get Chat Messages Response
 * GET /api/v1/quotes/:id/chat
 */
export interface GetChatMessagesResponse {
  messages: ChatMessage[];
}

/**
 * Send Chat Message Request
 * POST /api/v1/quotes/:id/chat
 */
export interface SendChatMessageRequest {
  message: string;
}

/**
 * Send Chat Message Response
 * POST /api/v1/quotes/:id/chat
 */
export interface SendChatMessageResponse {
  message: ChatMessage;
}

/**
 * Unread Count Response
 */
export interface UnreadCountResponse {
  unreadCount: number;
}

