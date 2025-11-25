import { useEffect, useRef } from 'react';
import { NotificationItem } from './notification_item';
import type { Notification } from '../../../types/notifications/notification';
import { cn } from '../../../utils/cn';

interface NotificationListProps {
  notifications: Notification[];
  isLoading?: boolean;
  hasMore?: boolean;
  onMarkAsRead: (notificationId: string) => void;
  onLoadMore?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  className?: string;
}

/**
 * Notification List Component
 * Displays a scrollable list of notifications with infinite scroll support
 */
export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  isLoading = false,
  hasMore = false,
  onMarkAsRead,
  onLoadMore,
  onNotificationClick,
  className,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  // Infinite scroll: observe the load more trigger
  // Add a small delay to prevent immediate triggering when component mounts
  useEffect(() => {
    if (!hasMore || isLoading || !onLoadMore) return;

    // Prevent observer from triggering immediately on mount
    if (!hasInitializedRef.current) {
      const timer = setTimeout(() => {
        hasInitializedRef.current = true;
      }, 500);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasInitializedRef.current) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  // Reset initialization flag when notifications change significantly
  useEffect(() => {
    if (notifications.length === 0) {
      hasInitializedRef.current = false;
    }
  }, [notifications.length]);

  if (isLoading && notifications.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <div className="text-sm text-[var(--color-text-secondary)]">Loading notifications...</div>
      </div>
    );
  }

  if (notifications.length === 0 && !isLoading) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-8 px-4', className)}>
        <div className="text-sm text-[var(--color-text-secondary)] text-center">
          No notifications yet
        </div>
        <div className="text-xs text-[var(--color-text-secondary)] mt-1 text-center">
          You'll see notifications here when you receive them
        </div>
      </div>
    );
  }

  return (
    <div ref={listRef} className={cn('overflow-y-auto', className)}>
      <div className="divide-y divide-[var(--color-border)]">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.notificationId}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onClick={onNotificationClick}
          />
        ))}
      </div>

      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="py-2 text-center">
          {isLoading && (
            <div className="text-xs text-[var(--color-text-secondary)]">Loading more...</div>
          )}
        </div>
      )}
    </div>
  );
};

