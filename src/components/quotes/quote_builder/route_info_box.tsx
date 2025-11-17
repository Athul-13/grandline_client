import { useMemo, useRef } from 'react';
import { formatDuration } from '../../../services/api/mapbox_directions_service';
import type { RouteResponse } from '../../../services/api/mapbox_directions_service';
import type { ItineraryStopDto } from '../../../types/quotes/itinerary';
import { StopType } from '../../../types/quotes/itinerary';
import { formatShortDate, format12HourTime, addDurationToDate } from '../../../utils/date_utils';

interface RouteInfoBoxProps {
  route: RouteResponse | null;
  isCalculating: boolean;
  stops: ItineraryStopDto[];
  className?: string;
}

/**
 * Route Info Box Component
 * Displays progressive itinerary information:
 * - Stage 1: Pickup location only
 * - Stage 2: Pickup location + date/time
 * - Stage 3: Full itinerary (pickup + intermediate stops + dropoff + travel duration)
 */
export const RouteInfoBox: React.FC<RouteInfoBoxProps> = ({
  route,
  isCalculating,
  stops,
  className = '',
}) => {
  // Don't show on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Refs for measuring positions (kept for potential future use)
  const pickupTimeRef = useRef<HTMLDivElement>(null);
  const dropoffTimeRef = useRef<HTMLDivElement>(null);

  // Get pickup and dropoff stops
  const pickupStop = stops.find((s) => s.stopType === StopType.PICKUP);
  const dropoffStop = stops.find((s) => s.stopType === StopType.DROPOFF);
  // Only show intermediate stops with valid coordinates (actually selected)
  const intermediateStops = stops.filter(
    (s) => s.stopType === StopType.STOP && 
    s.latitude !== 0 && s.longitude !== 0 && 
    s.locationName && s.locationName.trim() !== ''
  );

  // Calculate dropoff time from pickup time + route duration
  const calculatedDropoffTime = useMemo(() => {
    if (pickupStop?.arrivalTime && route?.duration) {
      return addDurationToDate(pickupStop.arrivalTime, route.duration);
    }
    return null;
  }, [pickupStop?.arrivalTime, route?.duration]);

  // Determine what to show based on available information
  // Only show if location has valid coordinates (actually selected, not just typed)
  const hasPickupLocation = pickupStop && pickupStop.locationName && 
    pickupStop.latitude !== 0 && pickupStop.longitude !== 0;
  const hasPickupDateTime = pickupStop?.arrivalTime && pickupStop.arrivalTime !== '';
  const hasDropoffLocation = dropoffStop && dropoffStop.locationName && 
    dropoffStop.latitude !== 0 && dropoffStop.longitude !== 0;
  const hasRoute = route && route.duration > 0;

  // Don't show on mobile
  if (isMobile) {
    return null;
  }

  // Don't show if no information available
  if (!hasPickupLocation && !hasDropoffLocation) {
    return null;
  }

  return (
    <div
      className={`absolute top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[300px] max-w-[300px] ${className}`}
      style={{ left: '420px' }} 
    >
      {isCalculating ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-primary)]"></div>
          <span className="text-sm text-gray-600">Calculating route...</span>
        </div>
      ) : (
        <div className="relative">
          {/* Pickup Section */}
          {hasPickupLocation && (
            <div className="flex items-start gap-3 relative mb-4">
              {/* Time and Date */}
              {hasPickupDateTime ? (
                <div ref={pickupTimeRef} className="flex-shrink-0 text-right min-w-[80px] pr-3 relative">
                  <div className="text-sm font-semibold text-gray-900">
                    {format12HourTime(pickupStop.arrivalTime)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatShortDate(pickupStop.arrivalTime)}
                  </div>
                </div>
              ) : (
                <div className="flex-shrink-0 min-w-[80px]" />
              )}
              
              {/* Icon and Location */}
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-white mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900">
                    Pickup
                  </div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2" title={pickupStop.locationName}>
                    {pickupStop.locationName}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Travel Duration Line (from pickup to first intermediate stop) */}
          {intermediateStops.length > 0 && hasPickupLocation && hasPickupDateTime && route?.legs?.[0] && (
            <div className="relative flex flex-col items-start mb-4">
              <div className="relative z-10 px-2 py-1 bg-white my-2">
                <div className="text-xs font-medium text-blue-600">
                  {formatDuration(route.legs[0].duration)}
                </div>
                {/* Top line */}
                <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-px h-5 bg-gray-300"></div>
                {/* Bottom line */}
                <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-px h-5 bg-gray-300"></div>
              </div>
            </div>
          )}

          {/* Intermediate Stops with Travel Durations */}
          {intermediateStops.map((stop, index) => {
            const hasArrivalTime = stop.arrivalTime && stop.arrivalTime !== '';
            const hasDepartureTime = stop.departureTime && stop.departureTime !== '';
            const stayingDuration = stop.stayingDuration || 0;
            
            // Calculate travel duration from previous intermediate stop to this one
            // Route legs: leg[0] = pickup to first stop, leg[1] = first stop to second stop, etc.
            // For intermediate stop at index i, the travel from previous stop uses leg[i]
            // But we only show duration line if there's a previous intermediate stop (index > 0)
            const segmentDuration = index > 0 && route?.legs?.[index]?.duration 
              ? route.legs[index].duration 
              : 0;

            return (
              <div key={index}>
                {/* Travel Duration Line (from previous intermediate stop to this one) */}
                {index > 0 && hasArrivalTime && segmentDuration > 0 && (
                  <div className="relative flex flex-col items-start mb-4">
                    <div className="relative z-10 px-2 py-1 bg-white my-2">
                      <div className="text-xs font-medium text-blue-600">
                        {formatDuration(segmentDuration)}
                      </div>
                      {/* Top line */}
                      <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-px h-5 bg-gray-300"></div>
                      {/* Bottom line */}
                      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-px h-5 bg-gray-300"></div>
                    </div>
                  </div>
                )}

                {/* Stop Arrival Section */}
                {hasArrivalTime && (
                  <div className="flex items-start gap-3 relative mb-4">
                    {/* Time and Date */}
                    <div className="flex-shrink-0 text-right min-w-[80px] pr-3 relative">
                      <div className="text-sm font-semibold text-gray-900">
                        {format12HourTime(stop.arrivalTime)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatShortDate(stop.arrivalTime)}
                      </div>
                    </div>

                    {/* Icon and Location */}
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <div className="w-3 h-3 rounded-full bg-blue-400 border-2 border-blue-200 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900">
                          Stop {index + 1}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2" title={stop.locationName}>
                          {stop.locationName}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stay Duration Line (between arrival and departure at same stop) */}
                {hasArrivalTime && hasDepartureTime && stayingDuration > 0 && (
                  <div className="relative flex flex-col items-start mb-4">
                    <div className="relative z-10 px-2 py-1 bg-white my-2">
                      <div className="text-xs font-medium text-gray-500">
                        Stay at the destination
                      </div>
                      <div className="text-xs font-medium text-blue-600 mt-1">
                        {formatDuration(stayingDuration * 60)}
                      </div>
                      {/* Top line (dashed) */}
                      <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-0.5 h-5" style={{ borderLeft: '1px dashed #d1d5db' }}></div>
                      {/* Bottom line (dashed) */}
                      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-0.5 h-5" style={{ borderLeft: '1px dashed #d1d5db' }}></div>
                    </div>
                  </div>
                )}

                {/* Stop Departure Section (same location, different time) */}
                {hasDepartureTime && (
                  <div className="flex items-start gap-3 relative mb-4">
                    {/* Time and Date */}
                    <div className="flex-shrink-0 text-right min-w-[80px] pr-3 relative">
                      <div className="text-sm font-semibold text-gray-900">
                        {format12HourTime(stop.departureTime)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatShortDate(stop.departureTime)}
                      </div>
                    </div>

                    {/* Icon and Location */}
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <div className="w-3 h-3 rounded-full border-2 border-blue-400 bg-white mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900">
                          Pickup
                        </div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2" title={stop.locationName}>
                          {stop.locationName}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Travel Duration Line (from last stop to dropoff) */}
          {hasPickupLocation && hasDropoffLocation && hasRoute && hasPickupDateTime && calculatedDropoffTime && (
            <div className="relative flex flex-col items-start mb-4">
              {/* Calculate duration from last stop to dropoff */}
              {(() => {
                // If there are intermediate stops, use leg[intermediateStops.length]
                // Otherwise (no intermediate stops), use leg[0] which is pickup to dropoff
                const lastSegmentDuration = route?.legs
                  ? (intermediateStops.length > 0 
                      ? route.legs[intermediateStops.length]?.duration || 0
                      : route.legs[0]?.duration || 0)
                  : route?.duration || 0;
                
                return lastSegmentDuration > 0 ? (
                  <div className="relative z-10 px-2 py-1 bg-white my-2">
                    <div className="text-xs font-medium text-blue-600">
                      {formatDuration(lastSegmentDuration)}
                    </div>
                    {/* Top line */}
                    <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-px h-5 bg-gray-300"></div>
                    {/* Bottom line */}
                    <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-px h-5 bg-gray-300"></div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Dropoff Section */}
          {hasDropoffLocation && (
            <div className="flex items-start gap-3 relative mt-4">
              {/* Time and Date */}
              {calculatedDropoffTime ? (
                <div ref={dropoffTimeRef} className="flex-shrink-0 text-right min-w-[80px] pr-3">
                  <div className="text-sm font-semibold text-gray-900">
                    {format12HourTime(calculatedDropoffTime)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatShortDate(calculatedDropoffTime)}
                  </div>
                </div>
              ) : (
                <div className="flex-shrink-0 min-w-[80px]" />
              )}

              {/* Icon and Location */}
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <div className="w-3 h-3 rounded bg-blue-600 border-2 border-blue-200 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900">
                    Dropoff
                  </div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2" title={dropoffStop.locationName}>
                    {dropoffStop.locationName}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
