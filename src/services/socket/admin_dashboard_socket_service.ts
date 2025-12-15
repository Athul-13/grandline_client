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
   * Listen for all dashboard update events
   * Convenience method that listens to all quote and reservation events
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
    ];

    handlers.forEach(handler => handler());

    return () => {
      socket.off('admin:quote-created', callback);
      socket.off('admin:quote-updated', callback);
      socket.off('admin:quote-status-changed', callback);
      socket.off('admin:reservation-created', callback);
      socket.off('admin:reservation-updated', callback);
      socket.off('admin:reservation-status-changed', callback);
    };
  },
};

