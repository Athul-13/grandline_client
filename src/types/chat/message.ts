/**
 * Message Types
 * Types for chat messages matching the API documentation
 */

/**
 * Message Delivery Status
 * Indicates the delivery state of a message
 */
export const MessageDeliveryStatus = {
  SENT: 'sent',        // Message saved to database (single tick)
  DELIVERED: 'delivered',  // Recipient is online (double gray tick)
  READ: 'read'         // Recipient actively viewing chat (double blue tick)
} as const;

export type MessageDeliveryStatusType = typeof MessageDeliveryStatus[keyof typeof MessageDeliveryStatus];

/**
 * Message Interface
 * Represents a chat message
 */
export interface Message {
  messageId: string;
  chatId: string;
  senderId: string;
  content: string;
  deliveryStatus: MessageDeliveryStatusType;
  createdAt: string | Date;
  readAt: string | Date | null;
  readBy: string | null;
}

/**
 * Send Message Request
 * POST /messages
 */
export interface SendMessageRequest {
  chatId: string;
  content: string;  // Max 5000 characters
}

/**
 * Send Message Response
 * POST /messages
 */
export interface SendMessageResponse {
  messageId: string;
  chatId: string;
  senderId: string;
  content: string;
  deliveryStatus: MessageDeliveryStatusType;
  createdAt: string;
  readAt: null;
  readBy: null;
}

/**
 * Get Chat Messages Response
 * GET /messages/chat/:chatId
 */
export interface GetChatMessagesResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Get Chat Messages Params
 */
export interface GetChatMessagesParams {
  page?: number;  // Default: 1, min: 1
  limit?: number;  // Default: 20, min: 1, max: 100
}

/**
 * Mark Messages as Read Response
 * POST /messages/chat/:chatId/mark-read
 */
export interface MarkMessagesAsReadResponse {
  message: string;
  unreadCount: number;
}

/**
 * Unread Count Response
 * GET /messages/chat/:chatId/unread-count
 */
export interface ChatUnreadCountResponse {
  chatId: string;
  unreadCount: number;
}

/**
 * Total Unread Count Response
 * GET /messages/unread-count
 */
export interface TotalUnreadCountResponse {
  totalUnreadCount: number;
}

