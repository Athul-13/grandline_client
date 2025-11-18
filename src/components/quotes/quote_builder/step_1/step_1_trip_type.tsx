import { useState } from 'react';
import { Button } from '../../../../components/common/button';
import { TripType } from '../../../../types/quotes/quote';
import type { TripTypeType } from '../../../../types/quotes/quote';
import { cn } from '../../../../utils/cn';

interface Step1TripTypeProps {
  tripType: TripTypeType | null;
  onTripTypeSelect: (tripType: TripTypeType) => void;
  onNext: () => Promise<void>;
  isLoading?: boolean;
}

/**
 * Step 1: Trip Type Selection
 * User selects between one-way or two-way (return trip)
 */
export const Step1TripType: React.FC<Step1TripTypeProps> = ({
  tripType,
  onTripTypeSelect,
  onNext,
  isLoading = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (!tripType) return;

    setIsSubmitting(true);
    try {
      await onNext();
    } catch (error) {
      console.error('Failed to proceed to next step:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          Select Trip Type
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Choose whether you need a one-way trip or a round trip with return journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* One Way Option */}
        <button
          onClick={() => onTripTypeSelect(TripType.ONE_WAY)}
          className={cn(
            'p-6 rounded-lg border-2 transition-all text-left',
            'hover:shadow-lg hover:scale-105',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2',
            tripType === TripType.ONE_WAY
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-md'
              : 'border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-primary)]/50'
          )}
        >
          <div className="flex items-start space-x-4">
            <div
              className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1',
                tripType === TripType.ONE_WAY
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                  : 'border-[var(--color-border)]'
              )}
            >
              {tripType === TripType.ONE_WAY && (
                <div className="w-3 h-3 rounded-full bg-white" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                One Way
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm">
                Travel from pickup location to dropoff location only. Perfect for one-time trips or
                when you have different transportation for the return journey.
              </p>
            </div>
          </div>
        </button>

        {/* Two Way (Return Trip) Option */}
        <button
          onClick={() => onTripTypeSelect(TripType.TWO_WAY)}
          className={cn(
            'p-6 rounded-lg border-2 transition-all text-left',
            'hover:shadow-lg hover:scale-105',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2',
            tripType === TripType.TWO_WAY
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-md'
              : 'border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-primary)]/50'
          )}
        >
          <div className="flex items-start space-x-4">
            <div
              className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1',
                tripType === TripType.TWO_WAY
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                  : 'border-[var(--color-border)]'
              )}
            >
              {tripType === TripType.TWO_WAY && (
                <div className="w-3 h-3 rounded-full bg-white" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                Two Way (Return Trip)
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm">
                Round trip with return journey. The vehicle will pick you up, take you to your
                destination, and return you to the original pickup location.
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-8">
        <Button
          onClick={handleNext}
          disabled={!tripType || isLoading || isSubmitting}
          loading={isLoading || isSubmitting}
          loadingText="Creating draft..."
        >
          Next
        </Button>
      </div>
    </div>
  );
};

