import { FilterSection } from '../../common/filters/filter_section';
import { formatDistance, formatDuration } from '../../../utils/quote_formatters';
import type { AdminQuoteDetails } from '../../../types/quotes/admin_quote';

interface RouteSectionProps {
  quoteDetails: AdminQuoteDetails;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Route Section Component
 * Displays route information (distance and duration)
 */
export const RouteSection: React.FC<RouteSectionProps> = ({
  quoteDetails,
  isExpanded,
  onToggle,
}) => {
  return (
    <FilterSection
      title="Route Information"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {quoteDetails.routeData ? (
        <div className="space-y-6">
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
            <div className="border-t border-[var(--color-border)] pt-4">
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
    </FilterSection>
  );
};

