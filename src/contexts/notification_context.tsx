import { useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Notification } from '../types/notifications/notification';
import type { GetUserNotificationsParams } from '../types/notifications/notification';
import { notificationService } from '../services/api/notification_service';
import { notificationSocketService } from '../services/socket/notification_socket_service';
import { useSocketConnection } from '../hooks/chat/use_socket_connection';
import type {
  NotificationReceivedEvent,
  UnreadCountUpdatedEvent,
} from '../types/notifications/notification_socket_events';
import type { NotificationContextValue } from './notification_context_value';
import { NotificationContext } from './notification_context_instance';

interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * Notification Provider
 * Provides global notification state and socket integration
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isConnected } = useSocketConnection();

  // Fetch notifications
  const fetchNotifications = useCallback(async (params?: GetUserNotificationsParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await notificationService.getNotifications(params);
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notificationId === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, []);

  // Fetch unread count
  const refetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.unreadCount);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, []);

  // Set up socket listeners for real-time notifications
  useEffect(() => {
    if (!isConnected) return;

    // Listen for new notifications
    const cleanupNotificationReceived = notificationSocketService.onNotificationReceived(
      (notification: NotificationReceivedEvent) => {
        setNotifications((prev) => {
          // Avoid duplicates
          if (prev.some((n) => n.notificationId === notification.notificationId)) {
            return prev;
          }
          return [notification, ...prev];
        });
        if (!notification.isRead) {
          setUnreadCount((prev) => prev + 1);
        }
      }
    );

    // Listen for unread count updates
    const cleanupUnreadCountUpdated = notificationSocketService.onUnreadCountUpdated(
      (data: UnreadCountUpdatedEvent) => {
        setUnreadCount(data.unreadCount);
      }
    );

    // Request initial unread count
    notificationSocketService.getUnreadCount(
      (data) => {
        setUnreadCount(data.unreadCount);
      },
      (err) => {
        console.error('Failed to get unread count via socket:', err);
      }
    );

    return () => {
      cleanupNotificationReceived();
      cleanupUnreadCountUpdated();
    };
  }, [isConnected]);

  // Fetch initial unread count on mount
  useEffect(() => {
    refetchUnreadCount();
  }, [refetchUnreadCount]);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    refetchUnreadCount,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

