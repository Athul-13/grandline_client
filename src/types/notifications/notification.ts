/**
 * Notification Types
 * Types for notifications matching the API documentation
 */

/**
 * Notification Type
 * Defines the type of notification
 */
export const NotificationType = {
  CHAT_MESSAGE: 'chat_message'  // New chat message notification
} as const;

export type NotificationTypeType = typeof NotificationType[keyof typeof NotificationType];

/**
 * Notification Interface
 * Represents a notification
 */
export interface Notification {
  notificationId: string;
  userId: string;
  type: NotificationTypeType;
  title: string;
  message: string;
  data?: Record<string, unknown>;  // Additional data (e.g., chatId, messageId)
  isRead: boolean;
  createdAt: string | Date;
}

/**
 * Create Notification Request
 * POST /notifications (typically used by system/admin)
 */
export interface CreateNotificationRequest {
  userId: string;
  type: NotificationTypeType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Create Notification Response
 * POST /notifications
 */
export interface CreateNotificationResponse {
  notificationId: string;
  userId: string;
  type: NotificationTypeType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

/**
 * Get User Notifications Response
 * GET /notifications
 */
export interface GetUserNotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  unreadCount: number;
}

/**
 * Get User Notifications Params
 */
export interface GetUserNotificationsParams {
  page?: number;        // Default: 1, min: 1
  limit?: number;      // Default: 20, min: 1, max: 100
  unreadOnly?: boolean; // Default: false
  type?: NotificationTypeType;  // Filter by notification type
}

/**
 * Mark Notification as Read Response
 * POST /notifications/:notificationId/mark-read
 */
export interface MarkNotificationAsReadResponse {
  message: string;
  notification: Notification;
}

/**
 * Mark All Notifications as Read Response
 * POST /notifications/mark-all-read
 */
export interface MarkAllNotificationsAsReadResponse {
  message: string;
  markedCount: number;
}

/**
 * Unread Notification Count Response
 * GET /notifications/unread-count
 */
export interface UnreadNotificationCountResponse {
  unreadCount: number;
}

