/**
 * Notification Socket Event Types
 * Types for notification-related Socket.io events matching the API documentation
 */

import type { Notification } from './notification';

/**
 * Get Unread Count Request
 * Client → Server: get-unread-count
 */
export type GetUnreadCountRequest = Record<string, never>;

/**
 * Notification Received Event
 * Server → Client: notification-received
 */
export type NotificationReceivedEvent = Notification;

/**
 * Unread Count Updated Event
 * Server → Client: unread-count-updated
 */
export interface UnreadCountUpdatedEvent {
  unreadCount: number;
}

