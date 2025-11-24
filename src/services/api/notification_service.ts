import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  GetUserNotificationsParams,
  GetUserNotificationsResponse,
  CreateNotificationRequest,
  CreateNotificationResponse,
  MarkNotificationAsReadResponse,
  MarkAllNotificationsAsReadResponse,
  UnreadNotificationCountResponse,
} from '../../types/notifications/notification';

/**
 * Notification Service
 * Handles notification-related API calls
 */
export const notificationService = {
  /**
   * Get notifications for the authenticated user with pagination and filtering
   * GET /notifications?page=1&limit=20&unreadOnly=true&type=chat_message
   */
  getNotifications: async (
    params?: GetUserNotificationsParams
  ): Promise<GetUserNotificationsResponse> => {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page !== undefined) {
        queryParams.append('page', String(params.page));
      }
      if (params.limit !== undefined) {
        queryParams.append('limit', String(params.limit));
      }
      if (params.unreadOnly !== undefined) {
        queryParams.append('unreadOnly', String(params.unreadOnly));
      }
      if (params.type !== undefined) {
        queryParams.append('type', params.type);
      }
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_ENDPOINTS.notifications.list}?${queryString}`
      : API_ENDPOINTS.notifications.list;

    const response = await grandlineAxiosClient.get<GetUserNotificationsResponse>(url);
    return response.data;
  },

  /**
   * Create a new notification (typically used by system/admin)
   * POST /notifications
   */
  createNotification: async (
    data: CreateNotificationRequest
  ): Promise<CreateNotificationResponse> => {
    const response = await grandlineAxiosClient.post<CreateNotificationResponse>(
      API_ENDPOINTS.notifications.create,
      data
    );
    return response.data;
  },

  /**
   * Mark a specific notification as read
   * POST /notifications/:notificationId/mark-read
   */
  markNotificationAsRead: async (
    notificationId: string
  ): Promise<MarkNotificationAsReadResponse> => {
    const response = await grandlineAxiosClient.post<MarkNotificationAsReadResponse>(
      API_ENDPOINTS.notifications.markRead(notificationId)
    );
    return response.data;
  },

  /**
   * Mark all notifications as read for the authenticated user
   * POST /notifications/mark-all-read
   */
  markAllNotificationsAsRead: async (): Promise<MarkAllNotificationsAsReadResponse> => {
    const response = await grandlineAxiosClient.post<MarkAllNotificationsAsReadResponse>(
      API_ENDPOINTS.notifications.markAllRead
    );
    return response.data;
  },

  /**
   * Get unread notification count for the authenticated user
   * GET /notifications/unread-count
   */
  getUnreadCount: async (): Promise<UnreadNotificationCountResponse> => {
    const response = await grandlineAxiosClient.get<UnreadNotificationCountResponse>(
      API_ENDPOINTS.notifications.unreadCount
    );
    return response.data;
  },
};

