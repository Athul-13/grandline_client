/**
 * Hook for subscribing to location updates via WebSocket
 * Handles subscription, cleanup, and reconnection
 */

import { useEffect, useRef, useCallback } from 'react';
import { locationSocketService, type LocationUpdateEvent } from '../../services/socket/location_socket_service';
import { isSocketConnected, getSocketClient } from '../../services/socket/socket_client';

export interface UseLocationUpdatesOptions {
  /**
   * Filter location updates by reservation ID
   * If provided, only updates for this reservation will be processed
   */
  reservationId?: string;
  /**
   * Filter location updates by driver ID
   * If provided, only updates for this driver will be processed
   */
  driverId?: string;
  /**
   * Callback when location update is received
   */
  onLocationUpdate: (data: LocationUpdateEvent) => void;
  /**
   * Callback when trip ends (to clean up markers)
   */
  onTripEnded?: (reservationId: string) => void;
  /**
   * Whether subscription is enabled
   */
  enabled?: boolean;
}

/**
 * Hook to subscribe to real-time location updates
 * 
 * Automatically:
 * - Subscribes to location:update events
 * - Filters by reservationId or driverId if provided
 * - Handles socket reconnection
 * - Cleans up on unmount
 * 
 * @param options Configuration options
 * @returns Subscription state
 */
export const useLocationUpdates = (options: UseLocationUpdatesOptions) => {
  const { reservationId, driverId, onLocationUpdate, onTripEnded, enabled = true } = options;
  const callbackRef = useRef(onLocationUpdate);
  const tripEndedCallbackRef = useRef(onTripEnded);
  const unsubscribeLocationRef = useRef<(() => void) | null>(null);
  const unsubscribeTripEndedRef = useRef<(() => void) | null>(null);

  // Keep callbacks up to date
  useEffect(() => {
    callbackRef.current = onLocationUpdate;
  }, [onLocationUpdate]);

  useEffect(() => {
    tripEndedCallbackRef.current = onTripEnded;
  }, [onTripEnded]);

  // Handle location updates with filtering
  const handleLocationUpdate = useCallback(
    (data: LocationUpdateEvent) => {
      // Filter by reservationId if provided
      if (reservationId && data.reservationId !== reservationId) {
        return;
      }

      // Filter by driverId if provided
      if (driverId && data.driverId !== driverId) {
        return;
      }

      // Call callback with filtered data
      callbackRef.current(data);
    },
    [reservationId, driverId]
  );

  // Handle trip ended
  const handleTripEnded = useCallback(
    (data: { reservationId: string; driverId: string; userId?: string; completedAt: string }) => {
      // Only process if it matches our filter
      if (reservationId && data.reservationId !== reservationId) {
        return;
      }
      if (driverId && data.driverId !== driverId) {
        return;
      }

      tripEndedCallbackRef.current?.(data.reservationId);
    },
    [reservationId, driverId]
  );

  // Subscribe to location updates
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Only subscribe if socket is connected
    if (!isSocketConnected()) {
      console.warn('[useLocationUpdates] Socket not connected, location updates will not be received');
      return;
    }

    // Subscribe to location updates
    unsubscribeLocationRef.current = locationSocketService.onLocationUpdate(handleLocationUpdate);

    // Subscribe to trip ended events
    unsubscribeTripEndedRef.current = locationSocketService.onTripEnded(handleTripEnded);

    return () => {
      if (unsubscribeLocationRef.current) {
        unsubscribeLocationRef.current();
        unsubscribeLocationRef.current = null;
      }
      if (unsubscribeTripEndedRef.current) {
        unsubscribeTripEndedRef.current();
        unsubscribeTripEndedRef.current = null;
      }
    };
  }, [enabled, handleLocationUpdate, handleTripEnded]);

  // Handle socket reconnection
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const socket = getSocketClient();
    const handleReconnect = () => {
      console.log('[useLocationUpdates] Socket reconnected, resubscribing to location updates');
      
      // Resubscribe
      if (unsubscribeLocationRef.current) {
        unsubscribeLocationRef.current();
      }
      if (unsubscribeTripEndedRef.current) {
        unsubscribeTripEndedRef.current();
      }

      unsubscribeLocationRef.current = locationSocketService.onLocationUpdate(handleLocationUpdate);
      unsubscribeTripEndedRef.current = locationSocketService.onTripEnded(handleTripEnded);
    };

    socket.on('connect', handleReconnect);

    return () => {
      socket.off('connect', handleReconnect);
    };
  }, [enabled, handleLocationUpdate, handleTripEnded]);

  return {
    isSubscribed: enabled && isSocketConnected(),
  };
};

