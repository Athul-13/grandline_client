import { Users } from 'lucide-react';
import type { QuoteResponse } from '../../../../types/quotes/quote';
import type { PassengerDto } from '../../../../types/quotes/passenger';

interface PassengersBentoCardProps {
  quoteDetails: QuoteResponse;
}

/**
 * Passengers Bento Card Component
 * Displays passenger information in a scrollable bento card
 */
export const PassengersBentoCard: React.FC<PassengersBentoCardProps> = ({ quoteDetails }) => {
  const passengers = (quoteDetails.passengers || []) as PassengerDto[];

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 flex flex-col h-full min-h-[250px]">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Passengers</h3>
        <span className="ml-auto text-sm text-[var(--color-text-secondary)]">
          {passengers.length > 0 ? passengers.length : quoteDetails.passengerCount}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {passengers.length > 0 ? (
          <div className="space-y-3 pr-2">
            {passengers.map((passenger, index) => (
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
      </div>
    </div>
  );
};

