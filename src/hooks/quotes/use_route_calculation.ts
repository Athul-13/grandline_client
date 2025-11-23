import { useState, useCallback, useRef, useEffect } from 'react';
import {
  calculateRoute,
  calculateDistance,
  type RouteCoordinates,
  type RouteResponse,
} from '../../services/api/mapbox_directions_service';
import type { ItineraryStopDto } from '../../types/quotes/itinerary';

interface RouteCacheEntry {
  route: RouteResponse;
  timestamp: number;
}

interface UseRouteCalculationOptions {
  accessToken: string;
  debounceMs?: number;
  timeoutMs?: number;
  minDistanceMeters?: number; // Minimum distance to calculate route (skip if closer)
}

interface RouteCalculationState {
  route: RouteResponse | null;
  isCalculating: boolean;
  error: string | null;
}

/**
 * Hook for calculating routes with debouncing, caching, and cancellation
 */
export const useRouteCalculation = (options: UseRouteCalculationOptions) => {
  const {
    accessToken,
    debounceMs = 500,
    timeoutMs = 7000,
    minDistanceMeters = 100,
  } = options;

  const [state, setState] = useState<RouteCalculationState>({
    route: null,
    isCalculating: false,
    error: null,
  });

  const cacheRef = useRef<Map<string, RouteCacheEntry>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Generate cache key from coordinates
   */
  const getCacheKey = useCallback((coordinates: RouteCoordinates[]): string => {
    return coordinates
      .map((coord) => `${coord.longitude.toFixed(6)},${coord.latitude.toFixed(6)}`)
      .join('|');
  }, []);

  /**
   * Check if stops are too close (should skip route calculation)
   */
  const shouldSkipRoute = useCallback(
    (coordinates: RouteCoordinates[]): boolean => {
      if (coordinates.length < 2) return true;

      // Check if any consecutive stops are too close
      for (let i = 0; i < coordinates.length - 1; i++) {
        const distance = calculateDistance(coordinates[i], coordinates[i + 1]);
        if (distance < minDistanceMeters) {
          return true;
        }
      }
      return false;
    },
    [minDistanceMeters]
  );

  /**
   * Calculate route (internal, not debounced)
   */
  const calculateRouteInternal = useCallback(
    async (coordinates: RouteCoordinates[]): Promise<void> => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Check if should skip (too close)
      if (shouldSkipRoute(coordinates)) {
        setState({
          route: null,
          isCalculating: false,
          error: null,
        });
        return;
      }

      // Check cache
      const cacheKey = getCacheKey(coordinates);
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        // Check if cache is still valid (within 5 minutes)
        const cacheAge = Date.now() - cached.timestamp;
        if (cacheAge < 5 * 60 * 1000) {
          setState({
            route: cached.route,
            isCalculating: false,
            error: null,
          });
          return;
        }
      }

      // Create new abort controller
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setState((prev) => ({
        ...prev,
        isCalculating: true,
        error: null,
      }));

      try {
        // Create timeout
        const timeoutId = setTimeout(() => {
          abortController.abort();
          setState((prev) => ({
            ...prev,
            isCalculating: false,
            error: 'Route calculation timed out',
          }));
        }, timeoutMs);

        const route = await calculateRoute(
          coordinates,
          accessToken,
          {
            profile: 'driving',
            geometries: 'geojson',
            overview: 'full',
          },
          abortController.signal
        );

        clearTimeout(timeoutId);

        // Cache the result
        cacheRef.current.set(cacheKey, {
          route,
          timestamp: Date.now(),
        });

        // Only update if not aborted
        if (!abortController.signal.aborted) {
          setState({
            route,
            isCalculating: false,
            error: null,
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Request was cancelled, don't update state
          return;
        }

        setState({
          route: null,
          isCalculating: false,
          error: error instanceof Error ? error.message : 'Failed to calculate route',
        });
      } finally {
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null;
        }
      }
    },
    [accessToken, timeoutMs, shouldSkipRoute, getCacheKey]
  );

  /**
   * Calculate route (debounced)
   */
  const calculateRouteDebounced = useCallback(
    (coordinates: RouteCoordinates[]) => {
      // Clear existing debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new debounce timeout
      debounceTimeoutRef.current = setTimeout(() => {
        calculateRouteInternal(coordinates);
        debounceTimeoutRef.current = null;
      }, debounceMs);
    },
    [calculateRouteInternal, debounceMs]
  );

  /**
   * Cancel current calculation
   * Note: Does NOT update state to avoid infinite loops
   * State will be updated naturally when calculation completes or fails
   */
  const cancelCalculation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    // Don't update state here - let the calculation error handler or completion handle it
    // This prevents infinite loops when cancelCalculation is called from effects
  }, []);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  /**
   * Convert stops to coordinates
   */
  const stopsToCoordinates = useCallback(
    (stops: ItineraryStopDto[]): RouteCoordinates[] => {
      return stops
        .filter((stop) => stop.latitude !== 0 && stop.longitude !== 0)
        .map((stop) => ({
          longitude: stop.longitude,
          latitude: stop.latitude,
        }));
    },
    []
  );

  /**
   * Calculate route from stops
   */
  const calculateRouteFromStops = useCallback(
    (stops: ItineraryStopDto[]) => {
      const coordinates = stopsToCoordinates(stops);
      if (coordinates.length >= 2) {
        calculateRouteDebounced(coordinates);
      } else {
        setState({
          route: null,
          isCalculating: false,
          error: null,
        });
      }
    },
    [stopsToCoordinates, calculateRouteDebounced]
  );

  // Cleanup on unmount - don't include cancelCalculation in deps to avoid infinite loop
  useEffect(() => {
    return () => {
      // Direct cleanup without calling cancelCalculation (which updates state)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    };
  }, []); // Empty deps - only run on unmount

  return {
    route: state.route,
    isCalculating: state.isCalculating,
    error: state.error,
    calculateRoute: calculateRouteFromStops,
    cancelCalculation,
    clearCache,
  };
};

