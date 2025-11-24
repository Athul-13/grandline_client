import type {
  Notification,
  GetUserNotificationsParams,
} from '../types/notifications/notification';

/**
 * Notification Context Value Interface
 * Exported separately to avoid Fast Refresh issues
 */
export interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (params?: GetUserNotificationsParams) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetchUnreadCount: () => Promise<void>;
}

