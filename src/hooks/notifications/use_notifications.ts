import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../../services/api/notification_service';
import type {
  GetUserNotificationsParams,
  GetUserNotificationsResponse,
} from '../../types/notifications/notification';

interface UseNotificationsParams extends GetUserNotificationsParams {
  autoFetch?: boolean;
}

interface UseNotificationsReturn {
  notifications: GetUserNotificationsResponse['notifications'];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

/**
 * Hook for fetching and managing notifications
 */
export const useNotifications = (params?: UseNotificationsParams): UseNotificationsReturn => {
  const {
    page: initialPage = 1,
    limit: initialLimit = 20,
    unreadOnly = false,
    type,
    autoFetch = true,
  } = params || {};

  const [notifications, setNotifications] = useState<GetUserNotificationsResponse['notifications']>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [hasMore, setHasMore] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (pageNum: number = page, append = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await notificationService.getNotifications({
        page: pageNum,
        limit,
        unreadOnly,
        type,
      });

      if (append) {
        setNotifications((prev) => [...prev, ...response.notifications]);
      } else {
        setNotifications(response.notifications);
      }

      setTotal(response.total);
      setHasMore(response.hasMore);
      setUnreadCount(response.unreadCount);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, unreadOnly, type]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    await fetchNotifications(page + 1, true);
  }, [hasMore, isLoading, page, fetchNotifications]);

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
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      throw err;
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchNotifications(1, false);
    }
  }, [autoFetch, fetchNotifications]);

  return {
    notifications,
    total,
    page,
    limit,
    hasMore,
    unreadCount,
    isLoading,
    error,
    fetchNotifications: () => fetchNotifications(1, false),
    loadMore,
    markAsRead,
    markAllAsRead,
  };
};

