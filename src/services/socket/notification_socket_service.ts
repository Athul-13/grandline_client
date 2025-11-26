/**
 * Notification Socket Service
 * Handles notification-related Socket.io events
 */

import { getSocketClient } from './socket_client';
import type {
  NotificationReceivedEvent,
  UnreadCountUpdatedEvent,
  GetUnreadCountRequest,
  SocketError,
} from '../../types/notifications/notification_socket_events';

/**
 * Notification Socket Service
 * Provides methods for notification-related socket operations
 */
export const notificationSocketService = {
  /**
   * Request unread notification count
   * Client → Server: get-unread-count
   * Server → Client: unread-count-updated
   */
  getUnreadCount: (
    onUpdated?: (data: UnreadCountUpdatedEvent) => void,
    onError?: (error: SocketError) => void
  ): void => {
    const socket = getSocketClient();

    const handleUpdated = (data: UnreadCountUpdatedEvent) => {
      socket.off('unread-count-updated', handleUpdated);
      socket.off('error', handleError);
      onUpdated?.(data);
    };

    const handleError = (error: SocketError) => {
      socket.off('unread-count-updated', handleUpdated);
      socket.off('error', handleError);
      onError?.(error);
    };

    socket.once('unread-count-updated', handleUpdated);
    socket.once('error', handleError);

    socket.emit('get-unread-count', {} as GetUnreadCountRequest);
  },

  /**
   * Listen for new notifications
   * Server → Client: notification-received
   */
  onNotificationReceived: (
    callback: (notification: NotificationReceivedEvent) => void
  ): (() => void) => {
    const socket = getSocketClient();
    socket.on('notification-received', callback);
    return () => socket.off('notification-received', callback);
  },

  /**
   * Listen for unread count updates
   * Server → Client: unread-count-updated
   */
  onUnreadCountUpdated: (
    callback: (data: UnreadCountUpdatedEvent) => void
  ): (() => void) => {
    const socket = getSocketClient();
    socket.on('unread-count-updated', callback);
    return () => socket.off('unread-count-updated', callback);
  },

  /**
   * Listen for socket errors
   * Server → Client: error
   */
  onError: (callback: (error: SocketError) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('error', callback);
    return () => socket.off('error', callback);
  },
};

