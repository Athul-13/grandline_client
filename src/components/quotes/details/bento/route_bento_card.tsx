import { Route } from 'lucide-react';
import { formatDistance, formatDuration } from '../../../../utils/quote_formatters';
import type { QuoteResponse } from '../../../../types/quotes/quote';

interface RouteBentoCardProps {
  quoteDetails: QuoteResponse;
}

/**
 * Route Bento Card Component
 * Displays route information (distance and duration)
 */
export const RouteBentoCard: React.FC<RouteBentoCardProps> = ({ quoteDetails }) => {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Route className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Route Information</h3>
      </div>
      {quoteDetails.routeData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Outbound Route */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Outbound Route
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Total Distance:</span>
                <span className="text-[var(--color-text-primary)] font-medium">
                  {formatDistance(quoteDetails.routeData.outbound.totalDistance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Total Duration:</span>
                <span className="text-[var(--color-text-primary)] font-medium">
                  {formatDuration(quoteDetails.routeData.outbound.totalDuration)}
                </span>
              </div>
            </div>
          </div>

          {/* Return Route */}
          {quoteDetails.tripType === 'two_way' && quoteDetails.routeData.return && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                Return Route
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Total Distance:</span>
                  <span className="text-[var(--color-text-primary)] font-medium">
                    {formatDistance(quoteDetails.routeData.return.totalDistance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Total Duration:</span>
                  <span className="text-[var(--color-text-primary)] font-medium">
                    {formatDuration(quoteDetails.routeData.return.totalDuration)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Total Summary for Two-Way */}
          {quoteDetails.tripType === 'two_way' && quoteDetails.routeData.return && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                Total Journey
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Total Distance:</span>
                  <span className="text-[var(--color-text-primary)] font-medium">
                    {formatDistance(
                      quoteDetails.routeData.outbound.totalDistance +
                      quoteDetails.routeData.return.totalDistance
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Total Duration:</span>
                  <span className="text-[var(--color-text-primary)] font-medium">
                    {formatDuration(
                      quoteDetails.routeData.outbound.totalDuration +
                      quoteDetails.routeData.return.totalDuration
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

