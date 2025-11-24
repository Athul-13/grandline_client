import { useState, useEffect } from 'react';
import { Bell, CheckCheck, X, RefreshCw } from 'lucide-react';
import { useNotificationContext } from '../../../hooks/notifications/use_notification_context';
import { NotificationList } from './notification_list';
import { ErrorMessage } from '../../common/ui/error_message';
import { cn } from '../../../utils/cn';
import type { Notification } from '../../../types/notifications/notification';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationClick?: (notification: Notification) => void;
  className?: string;
}

/**
 * Notification Dropdown Component
 * Displays a dropdown with list of notifications, mark as read, and mark all as read
 */
export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  onNotificationClick,
  className,
}) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationContext();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications({ page: 1, limit });
      setPage(1);
      setHasMore(true);
    }
  }, [isOpen, fetchNotifications]);

  // Auto-refresh notifications list when new notifications arrive (if dropdown is open)
  useEffect(() => {
    if (isOpen && notifications.length > 0) {
      // Refresh the list to show new notifications at the top
      // The context already updates notifications via socket, so we just need to ensure we're showing the latest
      fetchNotifications({ page: 1, limit });
    }
  }, [notifications.length, isOpen, fetchNotifications, limit]);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    const nextPage = page + 1;
    try {
      await fetchNotifications({ page: nextPage, limit });
      setPage(nextPage);
      // Note: The API response should indicate if there are more notifications
      // For now, we'll assume hasMore based on the number of notifications returned
      // This should be updated based on actual API response structure
    } catch (error) {
      console.error('Failed to load more notifications:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick?.(notification);
    // Optionally close dropdown after clicking
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'absolute right-0 mt-2 w-80 bg-[var(--color-bg-card)] rounded-md shadow-lg border border-[var(--color-border)] z-50',
        'flex flex-col max-h-[500px]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[var(--color-text-primary)]" />
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => fetchNotifications({ page: 1, limit })}
            disabled={isLoading}
            className="p-1.5 rounded hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh"
          >
            <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="p-1.5 rounded hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 pt-2">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Notification List */}
      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        hasMore={hasMore}
        onMarkAsRead={markAsRead}
        onLoadMore={handleLoadMore}
        onNotificationClick={handleNotificationClick}
        className="flex-1 min-h-0"
      />
    </div>
  );
};

