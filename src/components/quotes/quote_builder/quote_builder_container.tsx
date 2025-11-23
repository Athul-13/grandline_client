import { useState, useEffect } from 'react';
import { useQuoteBuilder } from '../../../hooks/quotes/use_quote_builder';
import { quoteService } from '../../../services/api/quote_service';
import { useNavigate } from 'react-router-dom';
import { StepNavigation } from './step_navigation';
import { Step1TripType } from './step_1/step_1_trip_type';
import { Step2Itinerary } from './step_2/step_2_itinerary';
import { Step3UserDetails } from './step_3/step_3_user_details';
import { Step4VehicleSelection } from './step_4/step_4_vehicle_selection';
import { Step5AdditionalAmenities } from './step_5/step_5_additional_amenities';

/**
 * Quote Builder Container
 * Main container for the 5-step quote building process
 */
export const QuoteBuilderContainer: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    tripType,
    quoteId,
    itinerary,
    tripName,
    eventType,
    customEventType,
    passengers,
    selectedVehicles,
    selectedAmenities,
    validation,
    goToStep,
    setTripType,
    setItinerary,
    setTripName,
    setEventType,
    setPassengers,
    setSelectedVehicles,
    setSelectedAmenities,
    saveDraft,
    createDraft,
    goToNextStep,
    goToPreviousStep,
    setStepValidation,
    isLoading,
    error,
  } = useQuoteBuilder();

  // Local state for return trip enabled status
  const [isReturnEnabled, setIsReturnEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <div className="h-full w-full bg-[var(--color-bg-primary)] flex flex-col relative">
      {/* Step Navigation - Hidden on mobile, overlay on map for step 2 */}
      {!isMobile && (
        <div
          className={currentStep === 2 ? 'relative z-30 bg-[var(--color-bg-primary)]/80 dark:bg-[var(--color-bg-primary)]/90 backdrop-blur-sm' : 'relative'}
        >
          <StepNavigation
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        </div>
      )}

      {/* Step Content */}
      <div className={currentStep === 2 ? 'flex-1 overflow-hidden relative' : currentStep === 3 || currentStep === 4 || currentStep === 5 ? 'flex-1 container mx-auto px-6 py-6 flex flex-col' : 'flex-1 container mx-auto px-6 py-8 overflow-y-auto'}>
        {currentStep === 2 ? (
          <Step2Itinerary
            tripType={tripType || 'one_way'}
            itinerary={itinerary}
            quoteId={quoteId}
            onItineraryChange={setItinerary}
            onNext={async () => {
              await goToNextStep();
            }}
            onPrevious={goToPreviousStep}
            isLoading={isLoading}
            isReturnEnabled={isReturnEnabled}
            onReturnEnabledChange={setIsReturnEnabled}
            onStepComplete={() => {
              setStepValidation(2, true);
            }}
          />
        ) : (
          <div className={currentStep === 3 || currentStep === 4 || currentStep === 5 ? 'h-full flex flex-col' : 'container mx-auto px-6 py-8'}>
            <div className={currentStep === 3 || currentStep === 4 || currentStep === 5 ? 'h-full flex flex-col bg-[var(--color-bg-card)] rounded-lg shadow-lg p-6' : 'bg-[var(--color-bg-card)] rounded-lg shadow-lg p-6'}>
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

              {currentStep === 3 && (
                <Step3UserDetails
                  tripName={tripName}
                  eventType={eventType}
                  customEventType={customEventType}
                  passengers={passengers}
                  onTripNameChange={setTripName}
                  onEventTypeChange={setEventType}
                  onPassengersChange={setPassengers}
                  onNext={async () => {
                    await goToNextStep();
                  }}
                  onPrevious={goToPreviousStep}
                  onStepValidationChange={(isValid) => {
                    setStepValidation(3, isValid);
                  }}
                  isLoading={isLoading}
                />
              )}

              {currentStep === 4 && (
                <Step4VehicleSelection
                  passengerCount={passengers.length}
                  itinerary={itinerary}
                  tripType={tripType}
                  selectedVehicles={selectedVehicles}
                  isStep5Completed={validation.step5}
                  onNext={async () => {
                    await goToNextStep();
                  }}
                  onPrevious={goToPreviousStep}
                  onStepValidationChange={(isValid) => {
                    setStepValidation(4, isValid);
                  }}
                  onSelectedVehiclesChange={setSelectedVehicles}
                  isLoading={isLoading}
                />
              )}

              {currentStep === 5 && (
                <Step5AdditionalAmenities
                  passengerCount={passengers.length}
                  itinerary={itinerary}
                  tripType={tripType}
                  selectedVehicles={selectedVehicles}
                  selectedAmenities={selectedAmenities}
                  quoteId={quoteId}
                  onPrevious={goToPreviousStep}
                  onStepValidationChange={(isValid) => {
                    setStepValidation(5, isValid);
                  }}
                  onSelectedAmenitiesChange={setSelectedAmenities}
                  onSubmitQuote={async () => {
                    if (!quoteId) return;

                    try {
                      // Update draft with currentStep: 5
                      await saveDraft({ currentStep: 5 });
                      
                      // Submit quote
                      await quoteService.submitQuote(quoteId);
                      
                      // Redirect to quotes list page
                      navigate('/user/quotes');
                    } catch (error) {
                      console.error('Failed to submit quote:', error);
                      // TODO: Show error message to user
                    }
                  }}
                  isLoading={isLoading}
                />
              )}

              {currentStep > 5 && (
                <div className="text-center py-12">
                  <p className="text-[var(--color-text-secondary)]">
                    Step {currentStep} content will be implemented in subsequent commits
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

