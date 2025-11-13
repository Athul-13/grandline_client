import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Plus } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { StopItemV2 } from './stop_item_v2';
import type { GeocodeResult } from '../../../services/api/mapbox_service';
import type { GeocodeSuggestion } from '../../../services/api/mapbox_geocoding_service';
import type { ItineraryStopDto } from '../../../types/quotes/itinerary';
import { StopType } from '../../../types/quotes/itinerary';
import type { TripTypeType } from '../../../types/quotes/quote';
import { createNewStop, createPickupStop, createDropoffStop } from '../../../utils/stop_utils';

interface ItineraryFloatingPanelProps {
  outboundStops: ItineraryStopDto[];
  returnStops?: ItineraryStopDto[];
  tripType: TripTypeType;
  onOutboundStopsChange: (stops: ItineraryStopDto[]) => void;
  onReturnStopsChange?: (stops: ItineraryStopDto[]) => void;
  isReturnEnabled: boolean;
  onLocationSelect: (result: GeocodeResult) => void;
  activeTab: 'outbound' | 'return';
  onActiveTabChange?: (tab: 'outbound' | 'return') => void;
}

/**
 * Itinerary Floating Panel Component
 * Floating sidebar with Outbound/Return tabs for itinerary management
 */
export const ItineraryFloatingPanel: React.FC<ItineraryFloatingPanelProps> = ({
  outboundStops,
  returnStops = [],
  tripType,
  onOutboundStopsChange,
  onReturnStopsChange,
  isReturnEnabled,
  onLocationSelect,
  activeTab: externalActiveTab,
  onActiveTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<'outbound' | 'return'>(externalActiveTab);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile/tablet (below md breakpoint)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleReturnStopsChange = useCallback((stops: ItineraryStopDto[]) => {
    if (onReturnStopsChange) {
      onReturnStopsChange(stops);
    }
  }, [onReturnStopsChange]);

  // Get current stops based on active tab
  const currentStops = activeTab === 'outbound' ? outboundStops : returnStops;
  const intermediateStops = currentStops.filter((s) => s.stopType === StopType.STOP);
  const canAddMoreStops = intermediateStops.length < 5; // Max 5 intermediate stops

  // Location selection is now handled directly in StopItemV2 via autocomplete

  // Sync external activeTab with internal state
  useEffect(() => {
    setActiveTab(externalActiveTab);
  }, [externalActiveTab]);

  // Handle tab change
  const handleTabChange = (tab: 'outbound' | 'return') => {
    setActiveTab(tab);
    if (onActiveTabChange) {
      onActiveTabChange(tab);
    }
  };


  // Handle add stop button click - add intermediate stop inline
  const handleAddStop = () => {
    const newStop = createNewStop();

    // Find pickup index and insert after it
    const pickupIndex = currentStops.findIndex((s) => s.stopType === StopType.PICKUP);
    const newStops = [...currentStops];
    
    if (pickupIndex !== -1) {
      newStops.splice(pickupIndex + 1, 0, newStop);
    } else {
      // If no pickup, add at beginning
      newStops.unshift(newStop);
    }

    if (activeTab === 'outbound') {
      onOutboundStopsChange(newStops);
    } else {
      handleReturnStopsChange(newStops);
    }
  };

  return (
    <>
      {/* Floating Toggle Button (Mobile/Tablet) */}
      {isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-28 left-4 z-20 bg-white rounded-lg shadow-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
          aria-label={isCollapsed ? 'Show itinerary' : 'Hide itinerary'}
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      )}

      {/* Floating Panel */}
      <div
        className={cn(
          'absolute top-28 left-4 z-10 w-96 max-h-[calc(100%-8rem)] bg-[var(--color-bg-card)] rounded-lg shadow-xl border border-[var(--color-border)] overflow-hidden flex flex-col transition-transform duration-300',
          isMobile && isCollapsed && 'transform -translate-x-full opacity-0 pointer-events-none',
          !isMobile && 'translate-x-0 opacity-100'
        )}
      >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Itinerary</h3>
        </div>
        
      </div>

      {/* Tabs */}
      {tripType === 'two_way' && (
        <div className="flex border-b border-[var(--color-border)]">
          <button
            onClick={() => handleTabChange('outbound')}
            className={cn(
              'flex-1 px-4 py-2 text-sm font-medium transition-colors',
              activeTab === 'outbound'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)]'
            )}
            type="button"
          >
            Outbound
          </button>
          <button
            onClick={() => handleTabChange('return')}
            disabled={!isReturnEnabled}
            className={cn(
              'flex-1 px-4 py-2 text-sm font-medium transition-colors',
              activeTab === 'return'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)]',
              !isReturnEnabled && 'opacity-50 cursor-not-allowed'
            )}
            type="button"
          >
            Return
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Always show card view - no detailed view */}
        <div className="space-y-4">
            {/* Pickup Card - always show */}
            {(() => {
              const pickupStop = currentStops.find((s) => s.stopType === StopType.PICKUP);
              const pickupIndex = pickupStop
                ? currentStops.findIndex((s) => s.stopType === StopType.PICKUP)
                : -1;

              // Create empty pickup if it doesn't exist
              const displayPickup = pickupStop || createPickupStop('', 0, 0);
              const displayPickupIndex = pickupIndex >= 0 ? pickupIndex : 0;

              const canRemovePickup = currentStops.length > 2;
              
              return (
                <div>
                  <StopItemV2
                    stop={displayPickup}
                    index={displayPickupIndex}
                    isPickup={true}
                    isDropoff={false}
                    onUpdate={(_index, updates) => {
                      const newStops = [...currentStops];
                      if (pickupIndex >= 0) {
                        // Update existing pickup
                        newStops[pickupIndex] = { ...newStops[pickupIndex], ...updates };
                      } else {
                        // Add new pickup at the beginning
                        const newPickup = { ...displayPickup, ...updates, stopType: StopType.PICKUP };
                        newStops.unshift(newPickup);
                      }
                      if (activeTab === 'outbound') {
                        onOutboundStopsChange(newStops);
                      } else {
                        handleReturnStopsChange(newStops);
                      }
                    }}
                    onRemove={(index) => {
                      const newStops = currentStops.filter((_, i) => i !== index);
                      // If pickup removed, make first stop the new pickup
                      if (newStops.length > 0 && newStops[0].stopType !== StopType.PICKUP) {
                        newStops[0].stopType = StopType.PICKUP;
                      }
                      if (newStops.length > 1 && newStops[newStops.length - 1].stopType !== StopType.DROPOFF) {
                        newStops[newStops.length - 1].stopType = StopType.DROPOFF;
                      }
                      if (activeTab === 'outbound') {
                        onOutboundStopsChange(newStops);
                      } else {
                        handleReturnStopsChange(newStops);
                      }
                    }}
                    canRemove={canRemovePickup}
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''}
                    onLocationSelect={(suggestion: GeocodeSuggestion) => {
                      if (onLocationSelect) {
                        onLocationSelect({
                          place_name: suggestion.place_name,
                          text: suggestion.text,
                          center: suggestion.center,
                          geometry: suggestion.geometry,
                        });
                      }
                    }}
                  />

                  {/* Add Stop Button after pickup - only if can add more */}
                  {canAddMoreStops && (
                    <button
                      onClick={handleAddStop}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 my-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                      type="button"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">Add Stop</span>
                    </button>
                  )}
                </div>
              );
            })()}

            {/* Intermediate Stops */}
            {intermediateStops.map((stop, idx) => {
              const stopIndex = currentStops.findIndex((s) => s === stop);
              const canRemove = currentStops.length > 2; // Can remove if more than 2 stops total
              const stopNumber = idx + 1; // Number for display (1, 2, 3...)
              
              // Drag handlers for reordering
              const handleDragStart = () => {
                // Drag started
              };
              
              const handleDragEnd = () => {
                // Drag ended
              };
              
              const handleDragOver = () => {
                // Drag over
              };
              
              const handleDrop = (fromIndex: number, toIndex: number) => {
                const newStops = [...currentStops];
                const [movedStop] = newStops.splice(fromIndex, 1);
                newStops.splice(toIndex, 0, movedStop);
                
                // Ensure first is pickup, last is dropoff
                if (newStops.length > 0 && newStops[0].stopType !== StopType.PICKUP) {
                  newStops[0].stopType = StopType.PICKUP;
                }
                if (newStops.length > 1 && newStops[newStops.length - 1].stopType !== StopType.DROPOFF) {
                  newStops[newStops.length - 1].stopType = StopType.DROPOFF;
                }
                
                if (activeTab === 'outbound') {
                  onOutboundStopsChange(newStops);
                } else {
                  handleReturnStopsChange(newStops);
                }
              };
              
              return (
                <div key={stopIndex}>
                  <StopItemV2
                    stop={stop}
                    index={stopIndex}
                    stopNumber={stopNumber}
                    isPickup={false}
                    isDropoff={false}
                    onUpdate={(index, updates) => {
                      const newStops = [...currentStops];
                      newStops[index] = { ...newStops[index], ...updates };
                      if (activeTab === 'outbound') {
                        onOutboundStopsChange(newStops);
                      } else {
                        handleReturnStopsChange(newStops);
                      }
                    }}
                    onRemove={(index) => {
                      const newStops = currentStops.filter((_, i) => i !== index);
                      // Renumber stops if needed
                      if (newStops.length > 0 && newStops[0].stopType !== StopType.PICKUP) {
                        newStops[0].stopType = StopType.PICKUP;
                      }
                      if (newStops.length > 1 && newStops[newStops.length - 1].stopType !== StopType.DROPOFF) {
                        newStops[newStops.length - 1].stopType = StopType.DROPOFF;
                      }
                      if (activeTab === 'outbound') {
                        onOutboundStopsChange(newStops);
                      } else {
                        handleReturnStopsChange(newStops);
                      }
                    }}
                    canRemove={canRemove}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''}
                    onLocationSelect={(suggestion: GeocodeSuggestion) => {
                      if (onLocationSelect) {
                        onLocationSelect({
                          place_name: suggestion.place_name,
                          text: suggestion.text,
                          center: suggestion.center,
                          geometry: suggestion.geometry,
                        });
                      }
                    }}
                  />

                  {/* Add Stop Button after intermediate stop - only if can add more */}
                  {canAddMoreStops && (
                    <button
                      onClick={handleAddStop}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 my-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                      type="button"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">Add Stop</span>
                    </button>
                  )}
                </div>
              );
            })}

            {/* Dropoff Card - always show */}
            {(() => {
              const dropoffStop = currentStops.find((s) => s.stopType === StopType.DROPOFF);
              const dropoffIndex = dropoffStop
                ? currentStops.findIndex((s) => s.stopType === StopType.DROPOFF)
                : -1;

              // Create empty dropoff if it doesn't exist
              const displayDropoff = dropoffStop || createDropoffStop('', 0, 0);
              const displayDropoffIndex = dropoffIndex >= 0 ? dropoffIndex : currentStops.length;

              const canRemoveDropoff = currentStops.length > 2;
              
              return (
                <StopItemV2
                  stop={displayDropoff}
                  index={displayDropoffIndex}
                  isPickup={false}
                  isDropoff={true}
                  onUpdate={(_index, updates) => {
                    const newStops = [...currentStops];
                    if (dropoffIndex >= 0) {
                      // Update existing dropoff
                      newStops[dropoffIndex] = { ...newStops[dropoffIndex], ...updates };
                    } else {
                      // Add new dropoff at the end
                      const newDropoff = { ...displayDropoff, ...updates, stopType: StopType.DROPOFF };
                      newStops.push(newDropoff);
                    }
                    if (activeTab === 'outbound') {
                      onOutboundStopsChange(newStops);
                    } else {
                      handleReturnStopsChange(newStops);
                    }
                  }}
                  onRemove={(index) => {
                    const newStops = currentStops.filter((_, i) => i !== index);
                    // If dropoff removed, make last stop the new dropoff
                    if (newStops.length > 0 && newStops[0].stopType !== StopType.PICKUP) {
                      newStops[0].stopType = StopType.PICKUP;
                    }
                    if (newStops.length > 1 && newStops[newStops.length - 1].stopType !== StopType.DROPOFF) {
                      newStops[newStops.length - 1].stopType = StopType.DROPOFF;
                    }
                    if (activeTab === 'outbound') {
                      onOutboundStopsChange(newStops);
                    } else {
                      handleReturnStopsChange(newStops);
                    }
                  }}
                  canRemove={canRemoveDropoff}
                  mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''}
                  onLocationSelect={(suggestion) => {
                    if (onLocationSelect) {
                      onLocationSelect({
                        place_name: suggestion.place_name,
                        text: suggestion.text,
                        center: suggestion.center,
                        geometry: suggestion.geometry,
                      });
                    }
                  }}
                />
              );
            })()}
          </div>
      </div>
    </div>
    </>
  );
};

