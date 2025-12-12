import { Route } from 'lucide-react';
import { formatDistance, formatDuration } from '../../../utils/quote_formatters';
import type { ReservationResponse } from '../../../types/reservations/reservation';

interface RouteBentoCardProps {
  reservationDetails: ReservationResponse;
}

/**
 * Route Bento Card Component
 * Displays route information (distance and duration)
 */
export const RouteBentoCard: React.FC<RouteBentoCardProps> = ({ reservationDetails }) => {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Route className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Route Information</h3>
      </div>
      {reservationDetails.routeData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Outbound Route */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Outbound Route
            </h4>
            <div className="space-y-2 text-sm">
              {reservationDetails.routeData.outbound?.totalDistance !== undefined && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Total Distance:</span>
                  <span className="text-[var(--color-text-primary)] font-medium">
                    {formatDistance(reservationDetails.routeData.outbound.totalDistance)}
                  </span>
                </div>
              )}
              {reservationDetails.routeData.outbound?.totalDuration !== undefined && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Total Duration:</span>
                  <span className="text-[var(--color-text-primary)] font-medium">
                    {formatDuration(reservationDetails.routeData.outbound.totalDuration)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Return Route */}
          {reservationDetails.tripType === 'two_way' && reservationDetails.routeData.return && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                Return Route
              </h4>
              <div className="space-y-2 text-sm">
                {reservationDetails.routeData.return.totalDistance !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Total Distance:</span>
                    <span className="text-[var(--color-text-primary)] font-medium">
                      {formatDistance(reservationDetails.routeData.return.totalDistance)}
                    </span>
                  </div>
                )}
                {reservationDetails.routeData.return.totalDuration !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Total Duration:</span>
                    <span className="text-[var(--color-text-primary)] font-medium">
                      {formatDuration(reservationDetails.routeData.return.totalDuration)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Total Summary for Two-Way */}
          {reservationDetails.tripType === 'two_way' &&
            reservationDetails.routeData.return &&
            reservationDetails.routeData.outbound?.totalDistance !== undefined &&
            reservationDetails.routeData.return.totalDistance !== undefined &&
            reservationDetails.routeData.outbound?.totalDuration !== undefined &&
            reservationDetails.routeData.return.totalDuration !== undefined && (
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                  Total Journey
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Total Distance:</span>
                    <span className="text-[var(--color-text-primary)] font-medium">
                      {formatDistance(
                        reservationDetails.routeData.outbound.totalDistance +
                          reservationDetails.routeData.return.totalDistance
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Total Duration:</span>
                    <span className="text-[var(--color-text-primary)] font-medium">
                      {formatDuration(
                        reservationDetails.routeData.outbound.totalDuration +
                          reservationDetails.routeData.return.totalDuration
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">Route data not available</p>
      )}
    </div>
  );
};

