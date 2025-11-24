/**
 * Chat Types
 * Types for chat conversations matching the API documentation
 */

/**
 * Participant Type
 * Defines the type of chat participants
 */
export const ParticipantType = {
  ADMIN_USER: 'admin_user',      // Chat between admin and user
  ADMIN_DRIVER: 'admin_driver',  // Chat between admin and driver
  DRIVER_USER: 'driver_user'     // Chat between driver and user
} as const;

export type ParticipantTypeType = typeof ParticipantType[keyof typeof ParticipantType];

/**
 * Chat Participant
 * Represents a participant in a chat
 */
export interface ChatParticipant {
  userId: string;
  participantType: ParticipantTypeType;
}

/**
 * Chat Interface
 * Represents a chat conversation
 */
export interface Chat {
  chatId: string;
  contextType: string;  // e.g., 'quote'
  contextId: string;    // e.g., quote ID
  participantType: ParticipantTypeType;
  participants: ChatParticipant[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Create Chat Request
 * POST /chats
 */
export interface CreateChatRequest {
  contextType: string;
  contextId: string;
  participantType: ParticipantTypeType;
  participants: ChatParticipant[];
}

/**
 * Create Chat Response
 * POST /chats
 */
export interface CreateChatResponse {
  chatId: string;
  contextType: string;
  contextId: string;
  participantType: ParticipantTypeType;
  participants: ChatParticipant[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Get User Chats Response
 * GET /chats
 */
export interface GetUserChatsResponse {
  chats: Chat[];
  total: number;
}

/**
 * Get Chat by Context Response
 * GET /chats/by-context
 */
export interface GetChatByContextResponse {
  chat: Chat | null;
}

/**
 * Get Chat by Context Params
 */
export interface GetChatByContextParams {
  contextType: string;  // e.g., 'quote'
  contextId: string;   // e.g., quote ID
}

