import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../../../components/common/button';
import { MapContainer } from './map_container';
import { ItineraryFloatingPanel } from './itinerary_floating_panel';
import { RouteInfoBox } from './route_info_box';
import { RouteSpinner } from './route_spinner';
import { useItineraryAutoUpdate } from '../../../hooks/quotes/use_itinerary_auto_update';
import { useRouteCalculation } from '../../../hooks/quotes/use_route_calculation';
import { useMarkerManagement } from '../../../hooks/quotes/use_marker_management';
import { useRouteDrawing } from '../../../hooks/quotes/use_route_drawing';
import type { Map } from 'mapbox-gl';
import type { ItineraryStopDto } from '../../../types/quotes/itinerary';
import { StopType } from '../../../types/quotes/itinerary';
import type { TripTypeType } from '../../../types/quotes/quote';
import { getValidStops } from '../../../utils/stop_utils';

interface Step2ItineraryProps {
  tripType: TripTypeType;
  itinerary: {
    outbound: ItineraryStopDto[];
    return?: ItineraryStopDto[];
  } | null;
  onItineraryChange: (itinerary: {
    outbound: ItineraryStopDto[];
    return?: ItineraryStopDto[];
  }) => void;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  isLoading?: boolean;
  isReturnEnabled: boolean;
  onReturnEnabledChange: (enabled: boolean) => void;
}

/**
 * Step 2: Itinerary Builder
 * Map-based itinerary building with location search and stops management
 */
export const Step2Itinerary: React.FC<Step2ItineraryProps> = ({
  tripType,
  itinerary,
  onItineraryChange,
  onNext,
  onPrevious,
  isLoading = false,
  isReturnEnabled,
  onReturnEnabledChange,
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
  const initialCenter = useMemo(() => {
    const pickupStop = outboundStops.find((s) => s.stopType === StopType.PICKUP);
    if (pickupStop && pickupStop.latitude && pickupStop.longitude) {
      return [pickupStop.longitude, pickupStop.latitude] as [number, number];
    }
    // Default to Kochi, India
    return [76.2673, 9.9312] as [number, number];
  }, [outboundStops]);

  const initialZoom = useMemo(() => {
    const pickupStop = outboundStops.find((s) => s.stopType === StopType.PICKUP);
    if (pickupStop && pickupStop.latitude && pickupStop.longitude) {
      return 12; // Zoom in for specific location
    }
    return 10; // Default zoom for Kochi
  }, [outboundStops]);

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

  // Handle location selection from autocomplete
  const handleLocationSelect = useCallback(() => {
    // Location is already updated in the stop via onUpdate callback
    // No need to create a new stop or do anything here
  }, []);

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

  const handleNext = async () => {
    // Enable return tab if two-way and not already enabled
    if (tripType === 'two_way' && !isReturnEnabled) {
      onReturnEnabledChange(true);
    }
    await onNext();
  };

  const isStepValid = () => {
    const currentStops = activeTab === 'outbound' ? outboundStops : returnStops;
    const hasPickup = currentStops.some((s) => s.stopType === StopType.PICKUP);
    const hasDropoff = currentStops.some((s) => s.stopType === StopType.DROPOFF);
    const hasValidLocations = currentStops.every(
      (s) => s.locationName && s.latitude && s.longitude
    );

    if (activeTab === 'outbound') {
      return hasPickup && hasDropoff && hasValidLocations;
    } else {
      // For return, we need pickup and last stop (dropoff)
      return hasPickup && returnStops.length >= 2 && hasValidLocations;
    }
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
        map={map}
        onLocationSelect={handleLocationSelect}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
      />

      {/* Route Info Box */}
      <RouteInfoBox
        route={activeTab === 'outbound' ? outboundRoute.route : returnRoute.route}
        isCalculating={
          activeTab === 'outbound' ? outboundRoute.isCalculating : returnRoute.isCalculating
        }
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
          disabled={!isStepValid() || isLoading}
          loading={isLoading}
          loadingText="Calculating routes..."
        >
          Next
        </Button>
      </div>
    </div>
  );
};

