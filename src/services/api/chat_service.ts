import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  GetChatByContextParams,
  GetChatByContextResponse,
  GetUserChatsResponse,
  CreateChatRequest,
  CreateChatResponse,
} from '../../types/chat/chat';
import type {
  SendMessageRequest,
  SendMessageResponse,
  GetChatMessagesParams,
  GetChatMessagesResponse,
  MarkMessagesAsReadResponse,
  ChatUnreadCountResponse,
  TotalUnreadCountResponse,
} from '../../types/chat/message';

/**
 * Chat Service
 * Handles chat-related API calls
 */
export const chatService = {
  /**
   * Get chat by context (e.g., quote)
   * GET /chats/by-context?contextType=quote&contextId=quote_123
   */
  getChatByContext: async (params: GetChatByContextParams): Promise<GetChatByContextResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('contextType', params.contextType);
    queryParams.append('contextId', params.contextId);

    const response = await grandlineAxiosClient.get<GetChatByContextResponse>(
      `${API_ENDPOINTS.chat.byContext}?${queryParams.toString()}`
    );
    return response.data;
  },

  /**
   * Get all chats for the authenticated user
   * GET /chats
   */
  getUserChats: async (): Promise<GetUserChatsResponse> => {
    const response = await grandlineAxiosClient.get<GetUserChatsResponse>(API_ENDPOINTS.chat.list);
    return response.data;
  },

  /**
   * Create a new chat
   * POST /chats
   */
  createChat: async (data: CreateChatRequest): Promise<CreateChatResponse> => {
    const response = await grandlineAxiosClient.post<CreateChatResponse>(
      API_ENDPOINTS.chat.create,
      data
    );
    return response.data;
  },

  /**
   * Send a message in a chat
   * POST /messages
   * Note: Server auto-creates chat if it doesn't exist
   */
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await grandlineAxiosClient.post<SendMessageResponse>(
      API_ENDPOINTS.messages.send,
      data
    );
    return response.data;
  },

  /**
   * Get messages for a specific chat with pagination
   * GET /messages/chat/:chatId?page=1&limit=20
   */
  getChatMessages: async (
    chatId: string,
    params?: GetChatMessagesParams
  ): Promise<GetChatMessagesResponse> => {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page !== undefined) {
        queryParams.append('page', String(params.page));
      }
      if (params.limit !== undefined) {
        queryParams.append('limit', String(params.limit));
      }
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_ENDPOINTS.messages.getByChat(chatId)}?${queryString}`
      : API_ENDPOINTS.messages.getByChat(chatId);

    const response = await grandlineAxiosClient.get<GetChatMessagesResponse>(url);
    return response.data;
  },

  /**
   * Mark all unread messages in a chat as read
   * POST /messages/chat/:chatId/mark-read
   */
  markMessagesAsRead: async (chatId: string): Promise<MarkMessagesAsReadResponse> => {
    const response = await grandlineAxiosClient.post<MarkMessagesAsReadResponse>(
      API_ENDPOINTS.messages.markRead(chatId)
    );
    return response.data;
  },

  /**
   * Get unread message count for a specific chat
   * GET /messages/chat/:chatId/unread-count
   */
  getUnreadCount: async (chatId: string): Promise<ChatUnreadCountResponse> => {
    const response = await grandlineAxiosClient.get<ChatUnreadCountResponse>(
      API_ENDPOINTS.messages.unreadCount(chatId)
    );
    return response.data;
  },

  /**
   * Get total unread message count across all chats
   * GET /messages/unread-count
   */
  getTotalUnreadCount: async (): Promise<TotalUnreadCountResponse> => {
    const response = await grandlineAxiosClient.get<TotalUnreadCountResponse>(
      API_ENDPOINTS.messages.totalUnreadCount
    );
    return response.data;
  },
};

