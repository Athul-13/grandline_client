import { useState } from 'react';
import { cn } from '../../../utils/cn';
import { ItineraryTab } from './itinerary_tab';
import type { ItineraryStopDto } from '../../../types/quotes/itinerary';
import type { TripTypeType } from '../../../types/quotes/quote';

interface ItineraryFloatingPanelProps {
  outboundStops: ItineraryStopDto[];
  returnStops?: ItineraryStopDto[];
  tripType: TripTypeType;
  onOutboundStopsChange: (stops: ItineraryStopDto[]) => void;
  onReturnStopsChange?: (stops: ItineraryStopDto[]) => void;
  isReturnEnabled: boolean;
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
}) => {
  const [activeTab, setActiveTab] = useState<'outbound' | 'return'>('outbound');

  const handleReturnStopsChange = (stops: ItineraryStopDto[]) => {
    if (onReturnStopsChange) {
      onReturnStopsChange(stops);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10 w-96 max-h-[calc(100vh-2rem)] bg-[var(--color-bg-card)] rounded-lg shadow-xl border border-[var(--color-border)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Itinerary</h3>
      </div>

      {/* Tabs */}
      {tripType === 'two_way' && (
        <div className="flex border-b border-[var(--color-border)]">
          <button
            onClick={() => setActiveTab('outbound')}
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
            onClick={() => setActiveTab('return')}
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
        {activeTab === 'outbound' && (
          <ItineraryTab
            stops={outboundStops}
            onStopsChange={onOutboundStopsChange}
            isReturn={false}
          />
        )}

        {activeTab === 'return' && tripType === 'two_way' && (
          <ItineraryTab
            stops={returnStops}
            onStopsChange={handleReturnStopsChange}
            isReturn={true}
          />
        )}
      </div>
    </div>
  );
};

