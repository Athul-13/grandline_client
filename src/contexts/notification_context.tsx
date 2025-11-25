import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { useAppSelector } from '../store/hooks';
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

  // Check authentication status
  const { isAuthenticated, isLoading: isAuthLoading } = useAppSelector((state) => state.auth);
  const { isConnected } = useSocketConnection();

  // Fetch notifications
  const fetchNotifications = useCallback(async (params?: GetUserNotificationsParams) => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await notificationService.getNotifications(params);
      // For page 1, replace the array. For subsequent pages, append (handled by caller if needed)
      const page = params?.page || 1;
      if (page === 1) {
        setNotifications(response.notifications);
      } else {
        // For pagination, append new notifications (avoiding duplicates)
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.notificationId));
          const newNotifications = response.notifications.filter(
            (n) => !existingIds.has(n.notificationId)
          );
          return [...prev, ...newNotifications];
        });
      }
      setUnreadCount(response.unreadCount);
    } catch (err) {
      // Don't show error if it's a 401 (user not authenticated)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || errorMessage.includes('session')) {
        setNotifications([]);
        setUnreadCount(0);
        setError(null);
      } else {
        console.error('Failed to fetch notifications:', err);
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!isAuthenticated) return;

    try {
      await notificationService.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notificationId === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      // Don't log 401 errors
      const errorMessage = err instanceof Error ? err.message : '';
      if (!errorMessage.includes('401') && !errorMessage.includes('Unauthorized')) {
        console.error('Failed to mark notification as read:', err);
      }
    }
  }, [isAuthenticated]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      await notificationService.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      // Don't log 401 errors
      const errorMessage = err instanceof Error ? err.message : '';
      if (!errorMessage.includes('401') && !errorMessage.includes('Unauthorized')) {
        console.error('Failed to mark all notifications as read:', err);
      }
    }
  }, [isAuthenticated]);

  // Fetch unread count
  const refetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.unreadCount);
    } catch (err) {
      // Don't show error or log if it's a 401 (user not authenticated)
      const errorMessage = err instanceof Error ? err.message : '';
      if (!errorMessage.includes('401') && !errorMessage.includes('Unauthorized') && !errorMessage.includes('session')) {
        console.error('Failed to fetch unread count:', err);
      }
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  // Set up socket listeners for real-time notifications
  useEffect(() => {
    if (!isAuthenticated || !isConnected) return;

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
  }, [isAuthenticated, isConnected]);

  // Fetch initial unread count on mount (only when authenticated)
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      refetchUnreadCount();
    } else if (!isAuthLoading && !isAuthenticated) {
      // Clear notifications and unread count when not authenticated
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
    }
  }, [isAuthenticated, isAuthLoading, refetchUnreadCount]);

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

