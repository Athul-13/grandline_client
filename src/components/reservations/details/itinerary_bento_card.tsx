import { MapPin, Clock, Navigation } from 'lucide-react';
import type { ReservationResponse } from '../../../types/reservations/reservation';
import { formatDateTime, getStopTypeLabel } from '../../../utils/quote_formatters';

interface ItineraryBentoCardProps {
  reservationDetails: ReservationResponse;
}

/**
 * Itinerary Bento Card Component
 * Displays itinerary stops from reservation_itinerary collection
 */
export const ItineraryBentoCard: React.FC<ItineraryBentoCardProps> = ({
  reservationDetails,
}) => {
  const itinerary = reservationDetails.itinerary || [];

  if (itinerary.length === 0) {
    return (
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Itinerary</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-[var(--color-text-secondary)]">
            No itinerary available
          </p>
        </div>
      </div>
    );
  }

  // Group stops by trip type
  const outboundStops = itinerary.filter((stop) => stop.tripType === 'outbound').sort((a, b) => a.stopOrder - b.stopOrder);
  const returnStops = itinerary.filter((stop) => stop.tripType === 'return').sort((a, b) => a.stopOrder - b.stopOrder);

  const renderStop = (stop: typeof itinerary[0]) => (
    <div
      key={stop.itineraryId}
      className="p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] mb-2"
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
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
            <MapPin className="w-3 h-3" />
            <span>
              {stop.latitude.toFixed(6)}, {stop.longitude.toFixed(6)}
            </span>
          </div>
        </div>
        <span className="text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] px-2 py-1 rounded">
          #{stop.stopOrder}
        </span>
      </div>
      <div className="mt-2 space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-[var(--color-text-secondary)]" />
          <span className="text-[var(--color-text-secondary)]">Arrival:</span>
          <span className="text-[var(--color-text-primary)]">
            {formatDateTime(stop.arrivalTime)}
          </span>
        </div>
        {stop.departureTime && (
          <div className="flex items-center gap-2">
            <Navigation className="w-3 h-3 text-[var(--color-text-secondary)]" />
            <span className="text-[var(--color-text-secondary)]">Departure:</span>
            <span className="text-[var(--color-text-primary)]">
              {formatDateTime(stop.departureTime)}
            </span>
          </div>
        )}
        {stop.isDriverStaying && stop.stayingDuration && (
          <div className="text-[var(--color-text-secondary)]">
            Driver staying: {stop.stayingDuration} minutes
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Itinerary</h3>
      </div>

      <div className="space-y-4">
        {/* Outbound Journey */}
        {outboundStops.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Outbound Journey
            </h4>
            <div className="space-y-2">
              {outboundStops.map((stop) => renderStop(stop))}
            </div>
          </div>
        )}

        {/* Return Journey */}
        {reservationDetails.tripType === 'two_way' && returnStops.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Return Journey
            </h4>
            <div className="space-y-2">
              {returnStops.map((stop) => renderStop(stop))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
