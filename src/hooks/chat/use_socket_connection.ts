import { useEffect, useState, useCallback } from 'react';
import { getSocketClient } from '../../services/socket/socket_client';
import type { Socket } from 'socket.io-client';

interface UseSocketConnectionReturn {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnect: () => void;
}

/**
 * Hook for managing Socket.io connection lifecycle
 * Handles connection, disconnection, and reconnection
 */
export const useSocketConnection = (): UseSocketConnectionReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeSocket = useCallback(() => {
    try {
      setIsConnecting(true);
      setError(null);
      const socketInstance = getSocketClient();
      setSocket(socketInstance);

      // Set initial connection state
      setIsConnected(socketInstance.connected);

      // Listen for connection events
      socketInstance.on('connect', () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
      });

      socketInstance.on('disconnect', () => {
        setIsConnected(false);
        setIsConnecting(false);
      });

      socketInstance.on('connect_error', (err) => {
        setIsConnecting(false);
        setError(err.message || 'Connection error');
      });

      socketInstance.on('reconnect', () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
      });

      socketInstance.on('reconnect_failed', () => {
        setIsConnecting(false);
        setError('Reconnection failed');
      });
    } catch (err) {
      console.error('Failed to initialize socket:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize socket');
      setIsConnecting(false);
    }
  }, []);

  const reconnect = useCallback(() => {
    if (socket) {
      socket.connect();
    } else {
      initializeSocket();
    }
  }, [socket, initializeSocket]);

  useEffect(() => {
    initializeSocket();

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('reconnect');
        socket.off('reconnect_failed');
      }
    };
  }, [initializeSocket]);

  return {
    socket,
    isConnected,
    isConnecting,
    error,
    reconnect,
  };
};

