import { useState, useEffect, useRef, useCallback } from 'react';
import { searchLocations, type GeocodeSuggestion } from '../../services/api/mapbox_geocoding_service';

interface UseMapboxAutocompleteOptions {
  accessToken: string;
  query: string;
  minChars?: number;
  debounceMs?: number;
  proximity?: [number, number]; // [longitude, latitude] - for biasing results
  limit?: number;
}

/**
 * Hook for Mapbox Geocoding autocomplete
 * Provides suggestions with debouncing and loading state
 */
export const useMapboxAutocomplete = ({
  accessToken,
  query,
  minChars = 4,
  debounceMs = 300,
  proximity,
  limit = 10,
}: UseMapboxAutocompleteOptions) => {
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Check minimum characters
      if (!searchQuery || searchQuery.length < minChars) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      // Create new abort controller
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsLoading(true);
      setError(null);

      try {
        const results = await searchLocations(searchQuery, accessToken, {
          proximity,
          limit,
        });

        // Only update if not aborted
        if (!abortController.signal.aborted) {
          setSuggestions(results);
          setIsLoading(false);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was cancelled, don't update state
          return;
        }

        setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
        setSuggestions([]);
        setIsLoading(false);
      } finally {
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null;
        }
      }
    },
    [accessToken, minChars, proximity, limit]
  );

  useEffect(() => {
    // Clear existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new debounce timeout
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(query);
      debounceTimeoutRef.current = null;
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [query, debounceMs, fetchSuggestions]);

  // Clear suggestions when query is too short
  useEffect(() => {
    if (!query || query.length < minChars) {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [query, minChars]);

  return {
    suggestions,
    isLoading,
    error,
  };
};

