import { formatDistanceToNow } from 'date-fns';
import type { Notification } from '../../../types/notifications/notification';
import { NotificationType } from '../../../types/notifications/notification';
import { MessageSquare } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => void;
  onClick?: (notification: Notification) => void;
}

/**
 * Notification Item Component
 * Displays a single notification with type, title, message, and timestamp
 */
export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onClick,
}) => {
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.notificationId);
    }
    onClick?.(notification);
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case NotificationType.CHAT_MESSAGE:
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };


  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full text-left px-4 py-2 hover:bg-[var(--color-bg-hover)] transition-colors',
        'border-b border-[var(--color-border)] last:border-b-0',
        !notification.isRead && 'bg-[var(--color-primary)]/5'
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* Icon */}
        <div
          className={cn(
            'flex-shrink-0 p-1.5 rounded-lg',
            'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          )}
        >
          {getNotificationIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight">
                {notification.title}
              </p>
            </div>
            {!notification.isRead && (
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[var(--color-primary)] mt-1" />
            )}
          </div>
          <div title={notification.message}>
            <p className="text-sm text-[var(--color-text-primary)] line-clamp-2 leading-snug">
              {notification.message}
            </p>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{timeAgo}</p>
        </div>
      </div>
    </button>
  );
};

