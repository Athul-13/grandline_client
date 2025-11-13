import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from '../../../components/common/button';
import { MapContainer } from './map_container';
import { LocationSearch } from './location_search';
import { ItineraryFloatingPanel } from './itinerary_floating_panel';
import { useItineraryAutoUpdate } from '../../../hooks/quotes/use_itinerary_auto_update';
import mapboxgl from 'mapbox-gl';
import type { Map } from 'mapbox-gl';
import type MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import type { GeocodeResult } from '../../../services/api/mapbox_service';
import type { ItineraryStopDto } from '../../../types/quotes/itinerary';
import { StopType } from '../../../types/quotes/itinerary';
import type { TripTypeType } from '../../../types/quotes/quote';

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
  const [geocoder, setGeocoder] = useState<MapboxGeocoder | null>(null);
  const [activeTab] = useState<'outbound' | 'return'>('outbound');
  const [selectedLocationType, setSelectedLocationType] = useState<'pickup' | 'stop' | 'dropoff'>(
    'pickup'
  );
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const outboundStops = useMemo(() => itinerary?.outbound || [], [itinerary?.outbound]);
  const returnStops = useMemo(() => itinerary?.return || [], [itinerary?.return]);

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

  // Handle location selection from geocoder
  const handleLocationSelect = useCallback(
    (result: GeocodeResult) => {
      const location: ItineraryStopDto = {
        locationName: result.place_name || result.text || 'Unknown Location',
        latitude: result.center[1],
        longitude: result.center[0],
        arrivalTime: new Date().toISOString(),
        departureTime: null,
        isDriverStaying: false,
        stayingDuration: null,
        stopType:
          selectedLocationType === 'pickup'
            ? StopType.PICKUP
            : selectedLocationType === 'dropoff'
              ? StopType.DROPOFF
              : StopType.STOP,
      };

      const currentStops = activeTab === 'outbound' ? outboundStops : returnStops;
      const isPickup = selectedLocationType === 'pickup';
      const isDropoff = selectedLocationType === 'dropoff';

      let newStops: ItineraryStopDto[];

      if (isPickup) {
        // Replace existing pickup or add at start
        const existingPickupIndex = currentStops.findIndex((s) => s.stopType === StopType.PICKUP);
        if (existingPickupIndex !== -1) {
          newStops = [...currentStops];
          newStops[existingPickupIndex] = location;
        } else {
          newStops = [location, ...currentStops];
        }
      } else if (isDropoff) {
        // Replace existing dropoff or add at end
        const existingDropoffIndex = currentStops.findIndex(
          (s) => s.stopType === StopType.DROPOFF
        );
        if (existingDropoffIndex !== -1) {
          newStops = [...currentStops];
          newStops[existingDropoffIndex] = location;
        } else {
          newStops = [...currentStops, location];
        }
      } else {
        // Add as stop
        newStops = [...currentStops, location];
      }

      if (activeTab === 'outbound') {
        onItineraryChange({
          outbound: newStops,
          return: returnStops,
        });
      } else {
        onItineraryChange({
          outbound: outboundStops,
          return: newStops,
        });
      }

      // Add marker to map
      if (map) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = isPickup ? '#10b981' : isDropoff ? '#ef4444' : '#3b82f6';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([location.longitude, location.latitude])
          .addTo(map);

        markersRef.current.push(marker);

        // Center map on new location
        map.flyTo({
          center: [location.longitude, location.latitude],
          zoom: 12,
          duration: 1000,
        });
      }

      // Reset selection type after adding
      setSelectedLocationType('stop');
    },
    [activeTab, outboundStops, returnStops, selectedLocationType, map, onItineraryChange]
  );

  // Update markers when stops change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for current tab's stops
    const currentStops = activeTab === 'outbound' ? outboundStops : returnStops;
    currentStops.forEach((stop) => {
      if (stop.latitude && stop.longitude) {
        const color =
          stop.stopType === StopType.PICKUP
            ? '#10b981'
            : stop.stopType === StopType.DROPOFF
              ? '#ef4444'
              : '#3b82f6';

        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = color;
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([stop.longitude, stop.latitude])
          .addTo(map);

        markersRef.current.push(marker);
      }
    });
  }, [map, activeTab, outboundStops, returnStops]);

  const handleOutboundStopsChange = (stops: ItineraryStopDto[]) => {
    onItineraryChange({
      outbound: stops,
      return: returnStops,
    });
  };

  const handleReturnStopsChange = (stops: ItineraryStopDto[]) => {
    onItineraryChange({
      outbound: outboundStops,
      return: stops,
    });
  };

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

  return (
    <div className="relative h-[calc(100vh-200px)] min-h-[600px]">
      {/* Map */}
      <MapContainer
        className="absolute inset-0"
        onMapReady={setMap}
        onGeocoderReady={setGeocoder}
      />

      {/* Location Search Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <select
          value={selectedLocationType}
          onChange={(e) =>
            setSelectedLocationType(e.target.value as 'pickup' | 'stop' | 'dropoff')
          }
          className="px-3 py-2 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="pickup">Add Pickup</option>
          <option value="stop">Add Stop</option>
          <option value="dropoff">Add Dropoff</option>
        </select>
        <LocationSearch geocoder={geocoder} onLocationSelect={handleLocationSelect} />
      </div>

      {/* Floating Itinerary Panel */}
      <ItineraryFloatingPanel
        outboundStops={outboundStops}
        returnStops={returnStops}
        tripType={tripType}
        onOutboundStopsChange={handleOutboundStopsChange}
        onReturnStopsChange={handleReturnStopsChange}
        isReturnEnabled={isReturnEnabled}
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

