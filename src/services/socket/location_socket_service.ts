/**
 * Location Socket Service
 * Handles location update socket events for real-time driver tracking
 */

import { getSocketClient } from './socket_client';

/**
 * Location update event payload (from server)
 */
export interface LocationUpdateEvent {
  reservationId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: string; // ISO string
}

/**
 * Location Socket Service
 * Provides methods for location-related socket operations
 */
export const locationSocketService = {
  /**
   * Listen for location update events
   * Server → Client: location:update
   * Emitted to admin:dashboard, user:{userId}, and driver:{driverId} rooms
   * 
   * @param callback Function to call when location update is received
   * @returns Unsubscribe function
   */
  onLocationUpdate: (callback: (data: LocationUpdateEvent) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('location:update', callback);
    return () => socket.off('location:update', callback);
  },

  /**
   * Listen for trip started events
   * Server → Client: trip:started
   * Indicates a trip has started and location tracking may begin
   * 
   * @param callback Function to call when trip is started
   * @returns Unsubscribe function
   */
  onTripStarted: (callback: (data: { reservationId: string; driverId: string; userId?: string; startedAt: string }) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('trip:started', callback);
    return () => socket.off('trip:started', callback);
  },

  /**
   * Listen for trip ended events
   * Server → Client: trip:ended
   * Indicates a trip has ended and location tracking should stop
   * 
   * @param callback Function to call when trip is ended
   * @returns Unsubscribe function
   */
  onTripEnded: (callback: (data: { reservationId: string; driverId: string; userId?: string; completedAt: string }) => void): (() => void) => {
    const socket = getSocketClient();
    socket.on('trip:ended', callback);
    return () => socket.off('trip:ended', callback);
  },
};

