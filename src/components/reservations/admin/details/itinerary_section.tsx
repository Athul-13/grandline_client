import { FilterSection } from '../../../common/filters/filter_section';
import { formatDateTime, getStopTypeLabel } from '../../../../utils/quote_formatters';
import type { AdminReservationDetailsResponse } from '../../../../types/reservations/admin_reservation';

interface ItinerarySectionProps {
  reservationDetails: AdminReservationDetailsResponse;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Itinerary Section Component
 * Displays outbound and return journey stops from reservation_itinerary
 */
export const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  reservationDetails,
  isExpanded,
  onToggle,
}) => {
  const itinerary = reservationDetails.itinerary || [];

  const renderStop = (stop: typeof itinerary[0]) => (
    <div
      key={stop.itineraryId}
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
        <span className="text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] px-2 py-1 rounded">
          #{stop.stopOrder}
        </span>
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

  // Group stops by trip type
  const outboundStops = itinerary.filter((stop) => stop.tripType === 'outbound').sort((a, b) => a.stopOrder - b.stopOrder);
  const returnStops = itinerary.filter((stop) => stop.tripType === 'return').sort((a, b) => a.stopOrder - b.stopOrder);

  return (
    <FilterSection
      title="Itinerary"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {itinerary.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">No itinerary available</p>
      ) : (
        <div className="space-y-6">
          {/* Outbound Journey */}
          {outboundStops.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                Outbound Journey
              </h4>
              {outboundStops.length > 0 ? (
                <div className="space-y-3">
                  {outboundStops.map((stop) => renderStop(stop))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">No outbound stops</p>
              )}
            </div>
          )}

          {/* Return Journey */}
          {reservationDetails.tripType === 'two_way' && returnStops.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                Return Journey
              </h4>
              {returnStops.length > 0 ? (
                <div className="space-y-3">
                  {returnStops.map((stop) => renderStop(stop))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">No return stops</p>
              )}
            </div>
          )}
        </div>
      )}
    </FilterSection>
  );
};

