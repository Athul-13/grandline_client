import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNotificationContext } from '../../../hooks/notifications/use_notification_context';
import { NotificationType } from '../../../types/notifications/notification';
import { Bell, MessageSquare } from 'lucide-react';

/**
 * Notification Toast Handler Component
 * Shows toast notifications when new notifications arrive (if chat not visible)
 * Should be placed at the app level to handle all notifications
 */
export const NotificationToastHandler: React.FC = () => {
  const { notifications } = useNotificationContext();
  const previousNotificationsRef = useRef<Set<string>>(new Set());
  const shownToastsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Track which notifications we've already shown
    const currentNotificationIds = new Set(notifications.map((n) => n.notificationId));

    // Find new notifications that haven't been shown yet
    notifications.forEach((notification) => {
      const isNew =
        !previousNotificationsRef.current.has(notification.notificationId) &&
        !shownToastsRef.current.has(notification.notificationId);

      if (isNew && !notification.isRead) {
        // Show toast for new unread notifications
        shownToastsRef.current.add(notification.notificationId);

        const getNotificationIcon = () => {
          switch (notification.type) {
            case NotificationType.CHAT_MESSAGE:
              return <MessageSquare className="w-5 h-5" />;
            default:
              return <Bell className="w-5 h-5" />;
          }
        };

        toast(
          () => (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{getNotificationIcon()}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {notification.title}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                  {notification.message}
                </p>
              </div>
            </div>
          ),
          {
            id: `notification-${notification.notificationId}`,
            duration: 5000,
            position: 'top-right',
            icon: getNotificationIcon(),
          }
        );
      }
    });

    // Update previous notifications set
    previousNotificationsRef.current = currentNotificationIds;

    // Clean up old shown toasts (keep only last 50)
    if (shownToastsRef.current.size > 50) {
      const toastIdsArray = Array.from(shownToastsRef.current);
      const toRemove = toastIdsArray.slice(0, toastIdsArray.length - 50);
      toRemove.forEach((id) => shownToastsRef.current.delete(id));
    }
  }, [notifications]);

  return null;
};

