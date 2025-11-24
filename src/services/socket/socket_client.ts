/**
 * Socket.io Client
 * Main Socket.io connection setup with authentication
 */

import { io, type Socket } from 'socket.io-client';
import { API_BASE_URL } from '../../constants/api';

/**
 * Socket.io Client Instance
 * Singleton instance for the application
 */
let socketInstance: Socket | null = null;

/**
 * Get or create Socket.io client instance
 * Uses JWT from cookies (withCredentials: true)
 */
export const getSocketClient = (): Socket => {
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  // Create new socket connection
  socketInstance = io(API_BASE_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  // Connection event handlers
  socketInstance.on('connect', () => {
    console.log('Socket.io connected:', socketInstance?.id);
  });

  socketInstance.on('disconnect', (reason) => {
    console.log('Socket.io disconnected:', reason);
  });

  socketInstance.on('connect_error', (error) => {
    console.error('Socket.io connection error:', error);
  });

  socketInstance.on('reconnect', (attemptNumber) => {
    console.log('Socket.io reconnected after', attemptNumber, 'attempts');
  });

  socketInstance.on('reconnect_attempt', (attemptNumber) => {
    console.log('Socket.io reconnection attempt:', attemptNumber);
  });

  socketInstance.on('reconnect_error', (error) => {
    console.error('Socket.io reconnection error:', error);
  });

  socketInstance.on('reconnect_failed', () => {
    console.error('Socket.io reconnection failed');
  });

  return socketInstance;
};

/**
 * Disconnect Socket.io client
 */
export const disconnectSocket = (): void => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

/**
 * Check if socket is connected
 */
export const isSocketConnected = (): boolean => {
  return socketInstance?.connected ?? false;
};

