import { useQuoteBuilder } from '../../../hooks/quotes/use_quote_builder';
import { StepNavigation } from './step_navigation';
import { Step1TripType } from './step_1_trip_type';

/**
 * Quote Builder Container
 * Main container for the 5-step quote building process
 */
export const QuoteBuilderContainer: React.FC = () => {
  const {
    currentStep,
    tripType,
    quoteId,
    validation,
    goToStep,
    setTripType,
    createDraft,
    goToNextStep,
    isLoading,
    error,
  } = useQuoteBuilder();

  // Calculate completed steps
  const completedSteps = [
    validation.step1 ? 1 : null,
    validation.step2 ? 2 : null,
    validation.step3 ? 3 : null,
    validation.step4 ? 4 : null,
    validation.step5 ? 5 : null,
  ].filter((step): step is number => step !== null);

  const handleStepClick = (step: number) => {
    goToStep(step);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading quote...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Step Navigation */}
      <StepNavigation
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Step Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow-lg p-6">
          {currentStep === 1 && (
            <Step1TripType
              tripType={tripType}
              onTripTypeSelect={setTripType}
              onNext={async () => {
                if (!tripType) return;

                // If no quoteId, create draft (combines POST + PUT)
                if (!quoteId) {
                  await createDraft(tripType);
                } else {
                  // If quoteId exists, just go to next step
                  await goToNextStep();
                }
              }}
              isLoading={isLoading}
            />
          )}

          {currentStep > 1 && (
            <div className="text-center py-12">
              <p className="text-[var(--color-text-secondary)]">
                Step {currentStep} content will be implemented in subsequent commits
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

