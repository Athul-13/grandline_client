import { FilterSection } from '../../common/filters/filter_section';
import { formatDateTime, getStopTypeLabel } from '../../../utils/quote_formatters';
import type { AdminQuoteDetails } from '../../../types/quotes/admin_quote';
import type { ItineraryStopDto } from '../../../types/quotes/itinerary';

interface ItinerarySectionProps {
  quoteDetails: AdminQuoteDetails;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Itinerary Section Component
 * Displays outbound and return journey stops
 */
export const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  quoteDetails,
  isExpanded,
  onToggle,
}) => {
  const renderStop = (stop: ItineraryStopDto, index: number) => (
    <div
      key={index}
      className="p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)]"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              {getStopTypeLabel(stop.stopType)}
            </span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {stop.locationName}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {stop.latitude.toFixed(6)}, {stop.longitude.toFixed(6)}
          </p>
        </div>
      </div>
      <div className="mt-2 space-y-1 text-xs">
        <div>
          <span className="text-[var(--color-text-secondary)]">Arrival:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {formatDateTime(stop.arrivalTime)}
          </span>
        </div>
        {stop.departureTime && (
          <div>
            <span className="text-[var(--color-text-secondary)]">Departure:</span>
            <span className="ml-2 text-[var(--color-text-primary)]">
              {formatDateTime(stop.departureTime)}
            </span>
          </div>
        )}
        {stop.isDriverStaying && stop.stayingDuration && (
          <div>
            <span className="text-[var(--color-text-secondary)]">Driver Staying:</span>
            <span className="ml-2 text-[var(--color-text-primary)]">
              {stop.stayingDuration} minutes
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <FilterSection
      title="Itinerary"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {quoteDetails.itinerary ? (
        <div className="space-y-6">
          {/* Outbound Itinerary */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Outbound Journey
            </h4>
            {quoteDetails.itinerary.outbound && quoteDetails.itinerary.outbound.length > 0 ? (
              <div className="space-y-3">
                {quoteDetails.itinerary.outbound.map((stop, index) => renderStop(stop, index))}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)]">No outbound stops</p>
            )}
          </div>

          {/* Return Itinerary */}
          {quoteDetails.tripType === 'two_way' && quoteDetails.itinerary.return && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                Return Journey
              </h4>
              {quoteDetails.itinerary.return.length > 0 ? (
                <div className="space-y-3">
                  {quoteDetails.itinerary.return.map((stop, index) => renderStop(stop, index))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">No return stops</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">No itinerary data available</p>
      )}
    </FilterSection>
  );
};

