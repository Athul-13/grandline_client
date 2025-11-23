import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../../../../components/common/ui/button';
import { MapContainer } from './map_container';
import { ItineraryFloatingPanel } from './itinerary_floating_panel';
import { RouteInfoBox } from './route_info_box';
import { RouteSpinner } from './route_spinner';
import { useItineraryAutoUpdate } from '../../../../hooks/quotes/use_itinerary_auto_update';
import { useRouteCalculation } from '../../../../hooks/quotes/use_route_calculation';
import { useMarkerManagement } from '../../../../hooks/quotes/use_marker_management';
import { useRouteDrawing } from '../../../../hooks/quotes/use_route_drawing';
import { quoteService } from '../../../../services/api/quote_service';
import type { Map } from 'mapbox-gl';
import type { ItineraryStopDto } from '../../../../types/quotes/itinerary';
import { StopType } from '../../../../types/quotes/itinerary';
import type { TripTypeType } from '../../../../types/quotes/quote';
import { getValidStops } from '../../../../utils/stop_utils';
import { addDurationToDate } from '../../../../utils/date_utils';

interface Step2ItineraryProps {
  tripType: TripTypeType;
  itinerary: {
    outbound: ItineraryStopDto[];
    return?: ItineraryStopDto[];
  } | null;
  quoteId: string | null;
  onItineraryChange: (itinerary: {
    outbound: ItineraryStopDto[];
    return?: ItineraryStopDto[];
  }) => void;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  isLoading?: boolean;
  isReturnEnabled: boolean;
  onReturnEnabledChange: (enabled: boolean) => void;
  onStepComplete?: () => void; // Callback to mark step as completed
}

/**
 * Step 2: Itinerary Builder
 * Map-based itinerary building with location search and stops management
 */
export const Step2Itinerary: React.FC<Step2ItineraryProps> = ({
  tripType,
  itinerary,
  quoteId,
  onItineraryChange,
  onNext,
  onPrevious,
  isLoading = false,
  isReturnEnabled,
  onReturnEnabledChange,
  onStepComplete,
}) => {

  const [map, setMap] = useState<Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'outbound' | 'return'>('outbound');
  const previousTabRef = useRef<'outbound' | 'return'>('outbound');

  // Get Mapbox access token
  const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

  // Route calculation hook for outbound
  const outboundRoute = useRouteCalculation({
    accessToken: mapboxAccessToken,
    debounceMs: 500,
    timeoutMs: 7000,
    minDistanceMeters: 100,
  });

  // Route calculation hook for return
  const returnRoute = useRouteCalculation({
    accessToken: mapboxAccessToken,
    debounceMs: 500,
    timeoutMs: 7000,
    minDistanceMeters: 100,
  });

  const outboundStops = useMemo(() => itinerary?.outbound || [], [itinerary?.outbound]);
  const returnStops = useMemo(() => itinerary?.return || [], [itinerary?.return]);

  // Calculate initial map center: pickup location if exists, otherwise Kochi
  // Use stable default - only calculate once on mount, don't update when stops change
  // This prevents map re-rendering when locations are selected
  // After initial load, use map.flyTo() to animate instead of re-rendering
  const defaultCenter = [76.2673, 9.9312] as [number, number];
  
  // Use useState with lazy initializer to calculate only once
  const [initialCenter] = useState<[number, number]>(() => {
    const pickupStop = outboundStops.find((s) => s.stopType === StopType.PICKUP);
    if (pickupStop && pickupStop.latitude && pickupStop.longitude) {
      return [pickupStop.longitude, pickupStop.latitude] as [number, number];
    }
    return defaultCenter;
  });

  const [initialZoom] = useState<number>(() => {
    const pickupStop = outboundStops.find((s) => s.stopType === StopType.PICKUP);
    if (pickupStop && pickupStop.latitude && pickupStop.longitude) {
      return 12; // Zoom in for specific location
    }
    return 10; // Default zoom for Kochi
  });

  // Auto-update return trip when outbound changes
  useItineraryAutoUpdate({
    outboundStops,
    returnStops,
    tripType,
    onReturnStopsChange: (stops) => {
      onItineraryChange({
        outbound: outboundStops,
        return: stops,
      });
    },
    isReturnEnabled,
  });

  // Get current stops for active tab
  const currentStops = useMemo(
    () => (activeTab === 'outbound' ? outboundStops : returnStops),
    [activeTab, outboundStops, returnStops]
  );


  // Manage markers using custom hook
  useMarkerManagement({
    map,
    isMapLoaded,
    stops: currentStops,
  });

  // Calculate routes when stops change (only for active tab, only when map is loaded)
  useEffect(() => {
    if (!isMapLoaded) return;

    const routeHook = activeTab === 'outbound' ? outboundRoute : returnRoute;

    // Cancel previous calculation if tab switched
    if (previousTabRef.current !== activeTab) {
      if (activeTab === 'outbound') {
        returnRoute.cancelCalculation();
      } else {
        outboundRoute.cancelCalculation();
      }
      previousTabRef.current = activeTab;
    }

    // Calculate route if 2+ stops with valid coordinates
    const validStops = getValidStops(currentStops);
    if (validStops.length >= 2) {
      routeHook.calculateRoute(validStops);
    } else {
      // Clear route if not enough stops
      routeHook.cancelCalculation();
    }
  }, [isMapLoaded, activeTab, currentStops, outboundRoute, returnRoute]);

  // Show toast on route calculation errors
  useEffect(() => {
    if (outboundRoute.error && activeTab === 'outbound') {
      toast.error(outboundRoute.error);
    }
    if (returnRoute.error && activeTab === 'return') {
      toast.error(returnRoute.error);
    }
  }, [outboundRoute.error, returnRoute.error, activeTab]);

  // Get current route for active tab
  const currentRoute = useMemo(
    () => (activeTab === 'outbound' ? outboundRoute.route : returnRoute.route),
    [activeTab, outboundRoute.route, returnRoute.route]
  );

  // Draw route on map using custom hook
  useRouteDrawing({
    map,
    isMapLoaded,
    route: currentRoute,
    routeId: activeTab,
  });

  // Calculate intermediate stops' arrivalTime and dropoff arrivalTime from route
  useEffect(() => {
    if (!currentRoute || !currentRoute.legs || currentRoute.legs.length === 0) return;
    
    const pickupStop = currentStops.find((s) => s.stopType === StopType.PICKUP);
    if (!pickupStop || !pickupStop.departureTime) return;

    const intermediateStops = currentStops.filter((s) => s.stopType === StopType.STOP);
    const dropoffStop = currentStops.find((s) => s.stopType === StopType.DROPOFF);
    
    let needsUpdate = false;
    const updatedStops = [...currentStops];
    
    // Calculate arrivalTime for each intermediate stop
    // Route legs: leg[0] = pickup to first intermediate stop, leg[1] = first to second, etc.
    for (let i = 0; i < intermediateStops.length; i++) {
      const stop = intermediateStops[i];
      const stopIndex = updatedStops.findIndex((s) => s === stop);
      
      if (stopIndex === -1) continue;
      
      // Get the previous stop's departureTime
      let previousDepartureTime: string | null = null;
      if (i === 0) {
        // First intermediate stop: use pickup departureTime
        previousDepartureTime = pickupStop.departureTime;
      } else {
        // Use previous intermediate stop's departureTime
        const previousStop = intermediateStops[i - 1];
        previousDepartureTime = previousStop.departureTime || null;
      }
      
      // Calculate arrivalTime = previousDepartureTime + route leg duration
      if (previousDepartureTime && currentRoute.legs[i]) {
        const legDuration = currentRoute.legs[i].duration;
        const calculatedArrivalTime = addDurationToDate(previousDepartureTime, legDuration);
        
        // Only update if different from current value
        if (stop.arrivalTime !== calculatedArrivalTime) {
          updatedStops[stopIndex] = {
            ...stop,
            arrivalTime: calculatedArrivalTime,
          };
          needsUpdate = true;
        }
      }
    }
    
    // Calculate dropoff arrivalTime from last stop's departureTime + last route leg duration
    if (dropoffStop) {
      const dropoffIndex = updatedStops.findIndex((s) => s === dropoffStop);
      if (dropoffIndex !== -1) {
        // Get the last stop before dropoff (last intermediate stop, or pickup if no intermediates)
        const lastStopBeforeDropoff = intermediateStops.length > 0
          ? intermediateStops[intermediateStops.length - 1]
          : pickupStop;
        
        const lastDepartureTime = lastStopBeforeDropoff.departureTime || null;
        
        // Use the last route leg (from last stop to dropoff)
        const lastLegIndex = intermediateStops.length; // leg[0] = pickup to first, leg[intermediateStops.length] = last to dropoff
        if (lastDepartureTime && currentRoute.legs[lastLegIndex]) {
          const legDuration = currentRoute.legs[lastLegIndex].duration;
          const calculatedArrivalTime = addDurationToDate(lastDepartureTime, legDuration);
          
          // Only update if different from current value
          if (dropoffStop.arrivalTime !== calculatedArrivalTime) {
            updatedStops[dropoffIndex] = {
              ...dropoffStop,
              arrivalTime: calculatedArrivalTime,
            };
            needsUpdate = true;
          }
        }
      }
    }
    
    // Update stops if any changes were made
    if (needsUpdate) {
      if (activeTab === 'outbound') {
        onItineraryChange({
          outbound: updatedStops,
          return: returnStops,
        });
      } else {
        onItineraryChange({
          outbound: outboundStops,
          return: updatedStops,
        });
      }
    }
  }, [currentRoute, currentStops, activeTab, outboundStops, returnStops, onItineraryChange]);

  const handleOutboundStopsChange = useCallback(
    (stops: ItineraryStopDto[]) => {
      onItineraryChange({
        outbound: stops,
        return: returnStops,
      });
    },
    [onItineraryChange, returnStops]
  );

  const handleReturnStopsChange = useCallback(
    (stops: ItineraryStopDto[]) => {
      onItineraryChange({
        outbound: outboundStops,
        return: stops,
      });
    },
    [onItineraryChange, outboundStops]
  );

  const [isCalculatingRoutes, setIsCalculatingRoutes] = useState(false);

  const handleNext = async () => {
    // Validate step before proceeding
    if (!isStepValid()) {
      return; // Don't proceed if validation fails
    }
    
    // Enable return tab if two-way and not already enabled
    if (tripType === 'two_way' && !isReturnEnabled) {
      onReturnEnabledChange(true);
    }
    
    // Calculate routes via backend API if quoteId exists
    if (quoteId && itinerary) {
      try {
        setIsCalculatingRoutes(true);
        await quoteService.calculateRoutes(quoteId, {
          itinerary: {
            outbound: itinerary.outbound,
            return: itinerary.return,
          },
        });
        toast.success('Routes calculated successfully');
      } catch (error) {
        console.error('Failed to calculate routes:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to calculate routes');
        // Still proceed to next step even if route calculation fails
      } finally {
        setIsCalculatingRoutes(false);
      }
    }
    
    // Mark step 2 as completed
    if (onStepComplete) {
      onStepComplete();
    }
    
    await onNext();
  };

  // Validate a single set of stops (outbound or return)
  const validateStops = (stops: ItineraryStopDto[]): boolean => {
    const hasPickup = stops.some((s) => s.stopType === StopType.PICKUP);
    const hasDropoff = stops.some((s) => s.stopType === StopType.DROPOFF);
    
    // Check all stops have valid locations (proper address with coordinates)
    const hasValidLocations = stops.every(
      (s) => s.locationName && s.locationName.trim() !== '' && s.latitude && s.longitude && s.latitude !== 0 && s.longitude !== 0
    );

    // Check pickup has departure time (arrivalTime is auto-calculated)
    const pickup = stops.find((s) => s.stopType === StopType.PICKUP);
    const hasPickupTime = !!(pickup && pickup.departureTime && pickup.departureTime !== '');

    // Check all intermediate stops have departure time (arrivalTime is calculated from previous stop's departure + route duration)
    const intermediateStops = stops.filter((s) => s.stopType === StopType.STOP);
    const hasAllIntermediateTimes = intermediateStops.every(
      (s) => !!(s.departureTime && s.departureTime !== '')
    );

    return hasPickup && hasDropoff && hasValidLocations && hasPickupTime && hasAllIntermediateTimes;
  };

  const isStepValid = () => {
    // Always validate outbound
    const isOutboundValid = validateStops(outboundStops);
    
    // For two-way trips, also validate return if it's enabled
    if (tripType === 'two_way' && isReturnEnabled) {
      const isReturnValid = validateStops(returnStops);
      return isOutboundValid && isReturnValid;
    }
    
    // For one-way trips, only validate outbound
    return isOutboundValid;
  };

  // Stable callback for map ready
  const handleMapReady = useCallback((mapInstance: Map | null) => {
    if (mapInstance) {
      setMap(mapInstance);
      // Set map loaded state when map is ready
      mapInstance.once('load', () => {
        setIsMapLoaded(true);
      });
      // If map is already loaded
      if (mapInstance.loaded()) {
        setIsMapLoaded(true);
      }
    } else {
      setMap(null);
      setIsMapLoaded(false);
    }
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Map */}
      <MapContainer
        className="absolute inset-0"
        onMapReady={handleMapReady}
        initialCenter={initialCenter}
        initialZoom={initialZoom}
      />


      {/* Floating Itinerary Panel */}
      <ItineraryFloatingPanel
        outboundStops={outboundStops}
        returnStops={returnStops}
        tripType={tripType}
        onOutboundStopsChange={handleOutboundStopsChange}
        onReturnStopsChange={handleReturnStopsChange}
        isReturnEnabled={isReturnEnabled}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        map={map}
        isMapLoaded={isMapLoaded}
      />

      {/* Route Info Box */}
      <RouteInfoBox
        route={activeTab === 'outbound' ? outboundRoute.route : returnRoute.route}
        isCalculating={
          activeTab === 'outbound' ? outboundRoute.isCalculating : returnRoute.isCalculating
        }
        stops={currentStops}
      />

      {/* Route Calculation Spinner */}
      <RouteSpinner
        isVisible={
          activeTab === 'outbound' ? outboundRoute.isCalculating : returnRoute.isCalculating
        }
      />

      {/* Navigation Buttons */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-3">
        <Button onClick={onPrevious} variant="outline" disabled={isLoading}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isStepValid() || isLoading || isCalculatingRoutes}
          loading={isLoading || isCalculatingRoutes}
          loadingText={isCalculatingRoutes ? "Calculating routes..." : "Loading..."}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

