/**
 * Admin Dashboard Socket Service
 * Handles admin dashboard-related Socket.io events for real-time updates
 */

import { getSocketClient } from './socket_client';

/**
 * Admin Dashboard Socket Event Types
 */
export interface QuoteCreatedEvent {
  quoteId: string;
  userId: string;
  status: string;
  createdAt: string;
}

export interface QuoteUpdatedEvent {
  quoteId: string;
  userId: string;
  status: string;
  updatedAt: string;
}

export interface QuoteStatusChangedEvent {
  quoteId: string;
  userId: string;
  oldStatus: string;
  newStatus: string;
  updatedAt: string;
}

export interface ReservationCreatedEvent {
  reservationId: string;
  userId: string;
  quoteId: string;
  status: string;
  createdAt: string;
}

export interface ReservationUpdatedEvent {
  reservationId: string;
  userId: string;
  status: string;
  updatedAt: string;
}

export interface ReservationStatusChangedEvent {
  reservationId: string;
  userId: string;
  oldStatus: string;
  newStatus: string;
  updatedAt: string;
}

export interface UserCreatedEvent {
  userId: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
}

export interface UserUpdatedEvent {
  userId: string;
  email: string;
  status: string;
  role: string;
  isVerified: boolean;
  updatedAt: string;
}

export interface UserStatusChangedEvent {
  userId: string;
  oldStatus: string;
  newStatus: string;
  updatedAt: string;
}

export interface UserRoleChangedEvent {
  userId: string;
  oldRole: string;
  newRole: string;
  updatedAt: string;
}

export interface UserVerifiedEvent {
  userId: string;
  verifiedAt: string;
}

export interface UserDeletedEvent {
  userId: string;
  deletedAt: string;
}

export interface DriverCreatedEvent {
  driverId: string;
  fullName: string;
  status: string;
  createdAt: string;
}

export interface DriverUpdatedEvent {
  driverId: string;
  fullName: string;
  status: string;
  updatedAt: string;
}

export interface DriverStatusChangedEvent {
  driverId: string;
  oldStatus: string;
  newStatus: string;
  updatedAt: string;
}

export interface DriverDeletedEvent {
  driverId: string;
  deletedAt: string;
}

/**
 * Admin Dashboard Socket Service
 * Provides methods for admin dashboard real-time updates
 */
export const adminDashboardSocketService = {
  /**
   * Listen for quote created events
   * Server → Client: admin:quote-created
   */
  onQuoteCreated: (callback: (data: QuoteCreatedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:quote-created', callback);
    return () => socket.off('admin:quote-created', callback);
  },

  /**
   * Listen for quote updated events
   * Server → Client: admin:quote-updated
   */
  onQuoteUpdated: (callback: (data: QuoteUpdatedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:quote-updated', callback);
    return () => socket.off('admin:quote-updated', callback);
  },

  /**
   * Listen for quote status changed events
   * Server → Client: admin:quote-status-changed
   */
  onQuoteStatusChanged: (callback: (data: QuoteStatusChangedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:quote-status-changed', callback);
    return () => socket.off('admin:quote-status-changed', callback);
  },

  /**
   * Listen for reservation created events
   * Server → Client: admin:reservation-created
   */
  onReservationCreated: (callback: (data: ReservationCreatedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:reservation-created', callback);
    return () => socket.off('admin:reservation-created', callback);
  },

  /**
   * Listen for reservation updated events
   * Server → Client: admin:reservation-updated
   */
  onReservationUpdated: (callback: (data: ReservationUpdatedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:reservation-updated', callback);
    return () => socket.off('admin:reservation-updated', callback);
  },

  /**
   * Listen for reservation status changed events
   * Server → Client: admin:reservation-status-changed
   */
  onReservationStatusChanged: (
    callback: (data: ReservationStatusChangedEvent) => void
  ): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:reservation-status-changed', callback);
    return () => socket.off('admin:reservation-status-changed', callback);
  },

  /**
   * Listen for user created events
   * Server → Client: admin:user-created
   */
  onUserCreated: (callback: (data: UserCreatedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:user-created', callback);
    return () => socket.off('admin:user-created', callback);
  },

  /**
   * Listen for user updated events
   * Server → Client: admin:user-updated
   */
  onUserUpdated: (callback: (data: UserUpdatedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:user-updated', callback);
    return () => socket.off('admin:user-updated', callback);
  },

  /**
   * Listen for user status changed events
   * Server → Client: admin:user-status-changed
   */
  onUserStatusChanged: (callback: (data: UserStatusChangedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:user-status-changed', callback);
    return () => socket.off('admin:user-status-changed', callback);
  },

  /**
   * Listen for user role changed events
   * Server → Client: admin:user-role-changed
   */
  onUserRoleChanged: (callback: (data: UserRoleChangedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:user-role-changed', callback);
    return () => socket.off('admin:user-role-changed', callback);
  },

  /**
   * Listen for user verified events
   * Server → Client: admin:user-verified
   */
  onUserVerified: (callback: (data: UserVerifiedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:user-verified', callback);
    return () => socket.off('admin:user-verified', callback);
  },

  /**
   * Listen for user deleted events
   * Server → Client: admin:user-deleted
   */
  onUserDeleted: (callback: (data: UserDeletedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:user-deleted', callback);
    return () => socket.off('admin:user-deleted', callback);
  },

  /**
   * Listen for driver created events
   * Server → Client: admin:driver-created
   */
  onDriverCreated: (callback: (data: DriverCreatedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:driver-created', callback);
    return () => socket.off('admin:driver-created', callback);
  },

  /**
   * Listen for driver updated events
   * Server → Client: admin:driver-updated
   */
  onDriverUpdated: (callback: (data: DriverUpdatedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:driver-updated', callback);
    return () => socket.off('admin:driver-updated', callback);
  },

  /**
   * Listen for driver status changed events
   * Server → Client: admin:driver-status-changed
   */
  onDriverStatusChanged: (callback: (data: DriverStatusChangedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:driver-status-changed', callback);
    return () => socket.off('admin:driver-status-changed', callback);
  },

  /**
   * Listen for driver deleted events
   * Server → Client: admin:driver-deleted
   */
  onDriverDeleted: (callback: (data: DriverDeletedEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('admin:driver-deleted', callback);
    return () => socket.off('admin:driver-deleted', callback);
  },

  /**
   * Listen for all dashboard update events
   * Convenience method that listens to all quote, reservation, user, and driver events
   */
  onDashboardUpdate: (
    callback: () => void
  ): (() => void) => {
    const socket = getSocketClient();
    
    const handlers = [
      () => socket.on('admin:quote-created', callback),
      () => socket.on('admin:quote-updated', callback),
      () => socket.on('admin:quote-status-changed', callback),
      () => socket.on('admin:reservation-created', callback),
      () => socket.on('admin:reservation-updated', callback),
      () => socket.on('admin:reservation-status-changed', callback),
      () => socket.on('admin:user-created', callback),
      () => socket.on('admin:user-updated', callback),
      () => socket.on('admin:user-status-changed', callback),
      () => socket.on('admin:user-role-changed', callback),
      () => socket.on('admin:user-verified', callback),
      () => socket.on('admin:user-deleted', callback),
      () => socket.on('admin:driver-created', callback),
      () => socket.on('admin:driver-updated', callback),
      () => socket.on('admin:driver-status-changed', callback),
      () => socket.on('admin:driver-deleted', callback),
    ];

    handlers.forEach(handler => handler());

    return () => {
      socket.off('admin:quote-created', callback);
      socket.off('admin:quote-updated', callback);
      socket.off('admin:quote-status-changed', callback);
      socket.off('admin:reservation-created', callback);
      socket.off('admin:reservation-updated', callback);
      socket.off('admin:reservation-status-changed', callback);
      socket.off('admin:user-created', callback);
      socket.off('admin:user-updated', callback);
      socket.off('admin:user-status-changed', callback);
      socket.off('admin:user-role-changed', callback);
      socket.off('admin:user-verified', callback);
      socket.off('admin:user-deleted', callback);
      socket.off('admin:driver-created', callback);
      socket.off('admin:driver-updated', callback);
      socket.off('admin:driver-status-changed', callback);
      socket.off('admin:driver-deleted', callback);
    };
  },
};

