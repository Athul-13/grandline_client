import { useEffect, useRef } from 'react';
import type { ItineraryStopDto } from '../../types/quotes/itinerary';
import { StopType } from '../../types/quotes/itinerary';

interface UseItineraryAutoUpdateProps {
  outboundStops: ItineraryStopDto[];
  returnStops: ItineraryStopDto[];
  tripType: 'one_way' | 'two_way';
  onReturnStopsChange: (stops: ItineraryStopDto[]) => void;
  isReturnEnabled: boolean;
}

/**
 * Hook to auto-update return trip when outbound changes
 * Auto-populates return trip with last location -> first location
 */
export const useItineraryAutoUpdate = ({
  outboundStops,
  returnStops,
  tripType,
  onReturnStopsChange,
  isReturnEnabled,
}: UseItineraryAutoUpdateProps) => {
  const previousOutboundRef = useRef<ItineraryStopDto[]>([]);
  const hasAutoUpdatedRef = useRef(false);

  useEffect(() => {
    // Only auto-update for two-way trips when return is enabled
    if (tripType !== 'two_way' || !isReturnEnabled) {
      return;
    }

    // Check if outbound has changed
    const outboundChanged =
      previousOutboundRef.current.length !== outboundStops.length ||
      previousOutboundRef.current.some(
        (stop, index) =>
          stop.locationName !== outboundStops[index]?.locationName ||
          stop.latitude !== outboundStops[index]?.latitude ||
          stop.longitude !== outboundStops[index]?.longitude
      );

    if (!outboundChanged) {
      return;
    }

    // Find first and last locations from outbound
    const pickupStop = outboundStops.find((s) => s.stopType === StopType.PICKUP);
    const lastStop = outboundStops[outboundStops.length - 1];

    if (!pickupStop || !lastStop) {
      return;
    }

    // Only auto-update if return stops are empty or haven't been manually edited
    if (returnStops.length === 0 || !hasAutoUpdatedRef.current) {
      const newReturnStops: ItineraryStopDto[] = [
        // Pickup from last location
        {
          locationName: lastStop.locationName,
          latitude: lastStop.latitude,
          longitude: lastStop.longitude,
          arrivalTime: new Date().toISOString(),
          departureTime: null,
          isDriverStaying: false,
          stayingDuration: null,
          stopType: StopType.PICKUP,
        },
        // Dropoff at first location
        {
          locationName: pickupStop.locationName,
          latitude: pickupStop.latitude,
          longitude: pickupStop.longitude,
          arrivalTime: new Date().toISOString(),
          departureTime: null,
          isDriverStaying: false,
          stayingDuration: null,
          stopType: StopType.DROPOFF,
        },
      ];

      onReturnStopsChange(newReturnStops);
      hasAutoUpdatedRef.current = true;
    }

    // Update previous outbound reference
    previousOutboundRef.current = [...outboundStops];
  }, [outboundStops, returnStops, tripType, isReturnEnabled, onReturnStopsChange]);

  // Reset auto-update flag when return is disabled
  useEffect(() => {
    if (!isReturnEnabled) {
      hasAutoUpdatedRef.current = false;
    }
  }, [isReturnEnabled]);
};

