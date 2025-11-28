import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppSelector } from '../../store/hooks';
import { getSocketClient, disconnectSocket } from '../../services/socket/socket_client';
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

  const { isAuthenticated, isLoading: isAuthLoading } = useAppSelector((state) => state.auth);

  // Use refs to track event listeners and prevent duplicate setups
  const listenersSetupRef = useRef(false);
  const socketRef = useRef<Socket | null>(null);

  const setupEventListeners = useCallback((socketInstance: Socket) => {
    if (listenersSetupRef.current) {
      return;
    }

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

    listenersSetupRef.current = true;
  }, []);

  const removeEventListeners = useCallback((socketInstance: Socket) => {
    socketInstance.off('connect');
    socketInstance.off('disconnect');
    socketInstance.off('connect_error');
    socketInstance.off('reconnect');
    socketInstance.off('reconnect_failed');
    listenersSetupRef.current = false;
  }, []);

  const initializeSocket = useCallback(() => {
    if (!isAuthenticated) {
      return;
    }

    if (socketRef.current && socketRef.current.connected) {
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      const socketInstance = getSocketClient();
      socketRef.current = socketInstance;
      setSocket(socketInstance);

      setIsConnected(socketInstance.connected);

      // Setup event listeners (only once)
      setupEventListeners(socketInstance);
    } catch (err) {
      console.error('Failed to initialize socket:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize socket');
      setIsConnecting(false);
    }
  }, [isAuthenticated, setupEventListeners]);

  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
    } else {
      initializeSocket();
    }
  }, [initializeSocket]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (isAuthenticated) {
      initializeSocket();
    } else {
      // Disconnect socket when not authenticated (e.g., on logout)
      // Remove event listeners first to prevent errors
      if (socketRef.current) {
        removeEventListeners(socketRef.current);
        socketRef.current = null;
      }
      
      // Disconnect and clean up socket instance
      disconnectSocket();
      
      // Clear all state
      setSocket(null);
      setIsConnected(false);
      setIsConnecting(false);
      setError(null);
      listenersSetupRef.current = false;
    }

    // Cleanup on unmount or when auth changes
    return () => {
      if (socketRef.current) {
        removeEventListeners(socketRef.current);
        socketRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAuthLoading]); // initializeSocket and removeEventListeners are stable callbacks

  return {
    socket,
    isConnected,
    isConnecting,
    error,
    reconnect,
  };
};

