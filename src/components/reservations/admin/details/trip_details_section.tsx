import { FilterSection } from '../../../common/filters/filter_section';
import { formatDate, formatDateTime, getTripTypeLabel, formatDistance, formatDuration } from '../../../../utils/quote_formatters';
import type { AdminReservationDetailsResponse } from '../../../../types/reservations/admin_reservation';

interface TripDetailsSectionProps {
  reservationDetails: AdminReservationDetailsResponse;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Trip Details Section Component
 * Displays trip-related information
 */
export const TripDetailsSection: React.FC<TripDetailsSectionProps> = ({
  reservationDetails,
  isExpanded,
  onToggle,
}) => {
  return (
    <FilterSection
      title="Trip Details"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">Trip Type:</span>
            <span className="ml-2 text-sm text-[var(--color-text-primary)]">
              {getTripTypeLabel(reservationDetails.tripType)}
            </span>
          </div>
          {reservationDetails.eventType && (
            <div>
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">Event Type:</span>
              <span className="ml-2 text-sm text-[var(--color-text-primary)]">
                {reservationDetails.customEventType || reservationDetails.eventType}
              </span>
            </div>
          )}
          {reservationDetails.passengerCount !== undefined && (
            <div>
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">Passenger Count:</span>
              <span className="ml-2 text-sm text-[var(--color-text-primary)]">
                {reservationDetails.passengerCount}
              </span>
            </div>
          )}
          {reservationDetails.reservationDate && (
            <div>
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">Reservation Date:</span>
              <span className="ml-2 text-sm text-[var(--color-text-primary)]">
                {formatDate(reservationDetails.reservationDate)}
              </span>
            </div>
          )}
        </div>

        {/* Route Data */}
        {reservationDetails.routeData && (
          <div className="pt-4 border-t border-[var(--color-border)]">
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Route Information</h4>
            {reservationDetails.routeData.outbound && (
              <div className="mb-3 p-3 bg-[var(--color-bg-secondary)] rounded-lg">
                <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">Outbound Journey</p>
                <div className="space-y-1 text-xs">
                  {reservationDetails.routeData.outbound.totalDistance !== undefined && (
                    <div>
                      <span className="text-[var(--color-text-secondary)]">Distance:</span>
                      <span className="ml-2 text-[var(--color-text-primary)]">
                        {formatDistance(reservationDetails.routeData.outbound.totalDistance)}
                      </span>
                    </div>
                  )}
                  {reservationDetails.routeData.outbound.totalDuration !== undefined && (
                    <div>
                      <span className="text-[var(--color-text-secondary)]">Duration:</span>
                      <span className="ml-2 text-[var(--color-text-primary)]">
                        {formatDuration(reservationDetails.routeData.outbound.totalDuration)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {reservationDetails.routeData.return && (
              <div className="p-3 bg-[var(--color-bg-secondary)] rounded-lg">
                <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">Return Journey</p>
                <div className="space-y-1 text-xs">
                  {reservationDetails.routeData.return.totalDistance !== undefined && (
                    <div>
                      <span className="text-[var(--color-text-secondary)]">Distance:</span>
                      <span className="ml-2 text-[var(--color-text-primary)]">
                        {formatDistance(reservationDetails.routeData.return.totalDistance)}
                      </span>
                    </div>
                  )}
                  {reservationDetails.routeData.return.totalDuration !== undefined && (
                    <div>
                      <span className="text-[var(--color-text-secondary)]">Duration:</span>
                      <span className="ml-2 text-[var(--color-text-primary)]">
                        {formatDuration(reservationDetails.routeData.return.totalDuration)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timestamps */}
        <div className="pt-4 border-t border-[var(--color-border)]">
          <div className="grid grid-cols-2 gap-4 text-xs">
            {reservationDetails.confirmedAt && (
              <div>
                <span className="text-[var(--color-text-secondary)]">Confirmed At:</span>
                <span className="ml-2 text-[var(--color-text-primary)]">
                  {formatDateTime(reservationDetails.confirmedAt)}
                </span>
              </div>
            )}
            {reservationDetails.driverChangedAt && (
              <div>
                <span className="text-[var(--color-text-secondary)]">Driver Changed At:</span>
                <span className="ml-2 text-[var(--color-text-primary)]">
                  {formatDateTime(reservationDetails.driverChangedAt)}
                </span>
              </div>
            )}
            {reservationDetails.createdAt && (
              <div>
                <span className="text-[var(--color-text-secondary)]">Created At:</span>
                <span className="ml-2 text-[var(--color-text-primary)]">
                  {formatDateTime(reservationDetails.createdAt)}
                </span>
              </div>
            )}
            {reservationDetails.updatedAt && (
              <div>
                <span className="text-[var(--color-text-secondary)]">Updated At:</span>
                <span className="ml-2 text-[var(--color-text-primary)]">
                  {formatDateTime(reservationDetails.updatedAt)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </FilterSection>
  );
};

