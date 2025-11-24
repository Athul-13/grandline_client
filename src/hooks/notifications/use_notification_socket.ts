import { useEffect, useCallback } from 'react';
import { notificationSocketService } from '../../services/socket/notification_socket_service';
import { useSocketConnection } from '../chat/use_socket_connection';
import type {
  NotificationReceivedEvent,
  UnreadCountUpdatedEvent,
  SocketError,
} from '../../types/notifications/notification_socket_events';

interface UseNotificationSocketReturn {
  onNotificationReceived: (callback: (notification: NotificationReceivedEvent) => void) => void;
  onUnreadCountUpdated: (callback: (data: UnreadCountUpdatedEvent) => void) => void;
  requestUnreadCount: () => void;
}

/**
 * Hook for handling notification socket events
 * Manages real-time notification updates via Socket.io
 */
export const useNotificationSocket = (): UseNotificationSocketReturn => {
  const { isConnected } = useSocketConnection();

  const onNotificationReceived = useCallback(
    (callback: (notification: NotificationReceivedEvent) => void) => {
      if (!isConnected) return;

      const cleanup = notificationSocketService.onNotificationReceived(callback);
      return cleanup;
    },
    [isConnected]
  );

  const onUnreadCountUpdated = useCallback(
    (callback: (data: UnreadCountUpdatedEvent) => void) => {
      if (!isConnected) return;

      const cleanup = notificationSocketService.onUnreadCountUpdated(callback);
      return cleanup;
    },
    [isConnected]
  );

  const requestUnreadCount = useCallback(() => {
    if (!isConnected) return;

    notificationSocketService.getUnreadCount(
      () => {
        // Count updated via socket event
      },
      (error: SocketError) => {
        console.error('Failed to get unread count via socket:', error);
      }
    );
  }, [isConnected]);

  // Request unread count when socket connects
  useEffect(() => {
    if (isConnected) {
      requestUnreadCount();
    }
  }, [isConnected, requestUnreadCount]);

  return {
    onNotificationReceived,
    onUnreadCountUpdated,
    requestUnreadCount,
  };
};

