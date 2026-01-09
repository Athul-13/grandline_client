/**
 * Socket.io Client
 * Main Socket.io connection setup with authentication
 */

import { io, type Socket } from 'socket.io-client';
import { SOCKET_BASE_URL } from '../../constants/api';
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

  // If socket exists but not connected, return it (listeners will work once it connects)
  if (socketInstance) {
    return socketInstance;
  }

  socketInstance = io(SOCKET_BASE_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  socketInstance.on('connect_error', (error: Error) => {
    console.error('[SocketClient] Socket.io connection error:', error);
  });

  socketInstance.on('reconnect_error', (error: Error) => {
    console.error('[SocketClient] Socket.io reconnection error:', error);
  });

  socketInstance.on('reconnect_failed', () => {
    console.error('[SocketClient] Socket.io reconnection failed');
  });

  return socketInstance;
};

/**
 * Disconnect Socket.io client
 * Properly cleans up all event listeners and disconnects the socket
 */
export const disconnectSocket = (): void => {
  if (socketInstance) {
    // Remove all event listeners to prevent "disconnected port object" errors
    socketInstance.removeAllListeners();
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

