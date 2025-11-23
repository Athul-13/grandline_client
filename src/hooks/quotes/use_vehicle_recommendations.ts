import { useState, useEffect, useCallback } from 'react';
import { quoteService } from '../../services/api/quote_service';
import type { GetRecommendationsRequest, GetRecommendationsResponse } from '../../types/quotes/vehicle_recommendation';
import type { ItineraryStopDto } from '../../types/quotes/itinerary';
import { StopType } from '../../types/quotes/itinerary';
import type { TripTypeType } from '../../types/quotes/quote';

interface UseVehicleRecommendationsParams {
  passengerCount: number;
  itinerary: {
    outbound: ItineraryStopDto[];
    return?: ItineraryStopDto[];
  } | null;
  tripType: TripTypeType | null;
  enabled?: boolean; // Whether to auto-fetch on mount
}

/**
 * Hook for fetching vehicle recommendations
 */
export const useVehicleRecommendations = ({
  passengerCount,
  itinerary,
  tripType,
  enabled = true,
}: UseVehicleRecommendationsParams) => {
  const [recommendations, setRecommendations] = useState<GetRecommendationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Extract trip dates from itinerary
   */
  const extractTripDates = useCallback((): { tripStartDate: string; tripEndDate: string } | null => {
    if (!itinerary || !itinerary.outbound) {
      return null;
    }

    // Find pickup stop (trip start)
    const pickupStop = itinerary.outbound.find((stop) => stop.stopType === StopType.PICKUP);
    if (!pickupStop || !pickupStop.arrivalTime) {
      return null;
    }

    // Find dropoff stop
    let dropoffStop: ItineraryStopDto | undefined;
    
    if (tripType === 'two_way' && itinerary.return && itinerary.return.length > 0) {
      // For two-way trips, use return dropoff if available
      dropoffStop = itinerary.return.find((stop) => stop.stopType === StopType.DROPOFF);
    }
    
    // Fallback to outbound dropoff if return dropoff not found or one-way trip
    if (!dropoffStop) {
      dropoffStop = itinerary.outbound.find((stop) => stop.stopType === StopType.DROPOFF);
    }

    if (!dropoffStop || !dropoffStop.arrivalTime) {
      return null;
    }

    return {
      tripStartDate: pickupStop.arrivalTime,
      tripEndDate: dropoffStop.arrivalTime,
    };
  }, [itinerary, tripType]);

  /**
   * Fetch vehicle recommendations
   */
  const fetchRecommendations = useCallback(async () => {
    // Validate required data
    if (passengerCount <= 0) {
      setError('Passenger count is required');
      return;
    }

    if (!tripType) {
      setError('Trip type is required');
      return;
    }

    const dates = extractTripDates();
    if (!dates) {
      setError('Trip dates are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestData: GetRecommendationsRequest = {
        passengerCount,
        tripStartDate: dates.tripStartDate,
        tripEndDate: dates.tripEndDate,
        tripType,
      };

      const response = await quoteService.getRecommendations(requestData);
      setRecommendations(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch vehicle recommendations';
      setError(errorMessage);
      setRecommendations(null);
    } finally {
      setIsLoading(false);
    }
  }, [passengerCount, tripType, extractTripDates]);

  /**
   * Auto-fetch recommendations when enabled and data is ready
   */
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Only fetch if we have all required data
    if (passengerCount > 0 && tripType && itinerary && extractTripDates()) {
      fetchRecommendations();
    }
  }, [enabled, passengerCount, tripType, itinerary, extractTripDates, fetchRecommendations]);

  return {
    recommendations,
    isLoading,
    error,
    refetch: fetchRecommendations,
  };
};

