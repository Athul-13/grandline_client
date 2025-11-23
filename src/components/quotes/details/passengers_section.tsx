import { FilterSection } from '../../common/filters/filter_section';
import type { AdminQuoteDetails } from '../../../types/quotes/admin_quote';

interface PassengersSectionProps {
  quoteDetails: AdminQuoteDetails;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Passengers Section Component
 * Displays passenger information
 */
export const PassengersSection: React.FC<PassengersSectionProps> = ({
  quoteDetails,
  isExpanded,
  onToggle,
}) => {
  return (
    <FilterSection
      title="Passengers"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {quoteDetails.passengers && quoteDetails.passengers.length > 0 ? (
        <div className="space-y-3">
          {quoteDetails.passengers.map((passenger, index) => (
            <div
              key={index}
              className="p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)]"
            >
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-[var(--color-text-secondary)]">Name:</span>
                  <span className="ml-2 text-[var(--color-text-primary)] font-medium">
                    {passenger.fullName}
                  </span>
                </div>
                {passenger.phoneNumber && (
                  <div>
                    <span className="text-[var(--color-text-secondary)]">Phone:</span>
                    <span className="ml-2 text-[var(--color-text-primary)]">
                      {passenger.phoneNumber}
                    </span>
                  </div>
                )}
                {passenger.age && (
                  <div>
                    <span className="text-[var(--color-text-secondary)]">Age:</span>
                    <span className="ml-2 text-[var(--color-text-primary)]">
                      {passenger.age} years
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {quoteDetails.passengerCount > 0
            ? `Passenger count: ${quoteDetails.passengerCount} (details not available)`
            : 'No passengers listed'}
        </p>
      )}
    </FilterSection>
  );
};

