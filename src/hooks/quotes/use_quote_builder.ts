import { useState, useCallback, useEffect } from 'react';
import { useQuoteDraft } from './use_quote_draft';
import { quoteService } from '../../services/api/quote_service';
import type { TripTypeType } from '../../types/quotes/quote';
import type { ItineraryStopDto } from '../../types/quotes/itinerary';
import type { PassengerDto } from '../../types/quotes/passenger';
import type { SelectedVehicle } from '../../types/quotes/quote';

/**
 * Step validation status
 */
interface StepValidation {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
}

/**
 * Quote Builder State
 */
interface QuoteBuilderState {
  quoteId: string | null;
  tripType: TripTypeType | null;
  itinerary: {
    outbound: ItineraryStopDto[];
    return?: ItineraryStopDto[];
  } | null;
  tripName: string;
  eventType: string;
  customEventType: string | null;
  passengers: PassengerDto[];
  selectedVehicles: SelectedVehicle[];
  selectedAmenities: string[];
  currentStep: number;
}

/**
 * Quote Builder Hook
 * Main state management for quote building process
 */
export const useQuoteBuilder = () => {
  const [state, setState] = useState<QuoteBuilderState>({
    quoteId: null,
    tripType: null,
    itinerary: null,
    tripName: '',
    eventType: '',
    customEventType: null,
    passengers: [],
    selectedVehicles: [],
    selectedAmenities: [],
    currentStep: 1,
  });

  const [validation, setValidation] = useState<StepValidation>({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { saveDraft, autoSaveDraft, loadDraft, getQuoteIdFromUrl } = useQuoteDraft(state.quoteId);

  /**
   * Load draft on mount if quoteId in URL
   */
  useEffect(() => {
    const loadDraftFromUrl = async () => {
      const urlQuoteId = getQuoteIdFromUrl();
      if (!urlQuoteId) return;

      setIsLoading(true);
      try {
        const draft = await loadDraft();
        if (draft) {
          setState({
            quoteId: draft.quoteId,
            tripType: draft.tripType,
            itinerary: draft.routeData ? {
              outbound: [], // Will be populated from routeData
              return: draft.routeData.return ? [] : undefined,
            } : null,
            tripName: draft.tripName || '',
            eventType: draft.eventType || '',
            customEventType: draft.customEventType || null,
            passengers: [], // Will be populated from draft
            selectedVehicles: draft.selectedVehicles || [],
            selectedAmenities: draft.selectedAmenities || [],
            currentStep: draft.currentStep || 1,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load draft');
      } finally {
        setIsLoading(false);
      }
    };

    loadDraftFromUrl();
  }, [getQuoteIdFromUrl, loadDraft]);

  /**
   * Update trip type
   */
  const setTripType = useCallback((tripType: TripTypeType) => {
    setState((prev) => ({ ...prev, tripType }));
    setValidation((prev) => ({ ...prev, step1: true }));
    
    // Auto-save if quoteId exists
    if (state.quoteId) {
      autoSaveDraft({ tripType });
    }
  }, [state.quoteId, autoSaveDraft]);

  /**
   * Update itinerary
   */
  const setItinerary = useCallback((itinerary: QuoteBuilderState['itinerary']) => {
    setState((prev) => ({ ...prev, itinerary }));
    
    // Auto-save if quoteId exists
    if (state.quoteId) {
      autoSaveDraft({ itinerary: itinerary as { outbound: unknown[]; return?: unknown[] } });
    }
  }, [state.quoteId, autoSaveDraft]);

  /**
   * Update trip name
   */
  const setTripName = useCallback((tripName: string) => {
    setState((prev) => ({ ...prev, tripName }));
    
    if (state.quoteId) {
      autoSaveDraft({ tripName });
    }
  }, [state.quoteId, autoSaveDraft]);

  /**
   * Update event type
   */
  const setEventType = useCallback((eventType: string, customEventType?: string | null) => {
    setState((prev) => ({ ...prev, eventType, customEventType: customEventType || null }));
    
    if (state.quoteId) {
      autoSaveDraft({ eventType, customEventType: customEventType || null });
    }
  }, [state.quoteId, autoSaveDraft]);

  /**
   * Update passengers
   */
  const setPassengers = useCallback((passengers: PassengerDto[]) => {
    setState((prev) => ({ ...prev, passengers }));
    
    if (state.quoteId) {
      autoSaveDraft({ passengers: passengers as unknown[] });
    }
  }, [state.quoteId, autoSaveDraft]);

  /**
   * Update selected vehicles
   */
  const setSelectedVehicles = useCallback((selectedVehicles: SelectedVehicle[]) => {
    setState((prev) => ({ ...prev, selectedVehicles }));
    
    if (state.quoteId) {
      autoSaveDraft({ selectedVehicles });
    }
  }, [state.quoteId, autoSaveDraft]);

  /**
   * Update selected amenities
   */
  const setSelectedAmenities = useCallback((selectedAmenities: string[]) => {
    setState((prev) => ({ ...prev, selectedAmenities }));
    
    if (state.quoteId) {
      autoSaveDraft({ selectedAmenities });
    }
  }, [state.quoteId, autoSaveDraft]);

  /**
   * Navigate to step
   */
  const goToStep = useCallback(async (step: number) => {
    // Can only go to completed steps or current step
    const maxStep = Math.max(
      state.currentStep,
      validation.step1 ? 1 : 0,
      validation.step2 ? 2 : 0,
      validation.step3 ? 3 : 0,
      validation.step4 ? 4 : 0,
      validation.step5 ? 5 : 0
    );

    if (step > maxStep + 1) {
      return; // Cannot skip ahead
    }

    setState((prev) => ({ ...prev, currentStep: step }));
    
    // Save current step
    if (state.quoteId) {
      await saveDraft({ currentStep: step });
    }
  }, [state.currentStep, state.quoteId, validation, saveDraft]);

  /**
   * Go to next step
   */
  const goToNextStep = useCallback(async () => {
    const nextStep = state.currentStep + 1;
    if (nextStep <= 5) {
      await goToStep(nextStep);
    }
  }, [state.currentStep, goToStep]);

  /**
   * Go to previous step
   */
  const goToPreviousStep = useCallback(async () => {
    const prevStep = state.currentStep - 1;
    if (prevStep >= 1) {
      await goToStep(prevStep);
    }
  }, [state.currentStep, goToStep]);

  /**
   * Set validation status for a step
   */
  const setStepValidation = useCallback((step: number, isValid: boolean) => {
    setValidation((prev) => ({
      ...prev,
      [`step${step}` as keyof StepValidation]: isValid,
    }));
  }, []);

  /**
   * Create draft (on Step 1 Next click)
   */
  const createDraft = useCallback(async (tripType: TripTypeType): Promise<string> => {
    setIsLoading(true);
    try {
      // Create draft
      const createResponse = await quoteService.createQuoteDraft({ tripType });
      const newQuoteId = createResponse.quoteId;

      // Update to step 2
      await quoteService.updateQuoteDraft(newQuoteId, { tripType, currentStep: 2 });

      setState((prev) => ({
        ...prev,
        quoteId: newQuoteId,
        tripType,
        currentStep: 2,
      }));

      return newQuoteId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create draft';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    ...state,
    validation,
    isLoading,
    error,

    // Actions
    setTripType,
    setItinerary,
    setTripName,
    setEventType,
    setPassengers,
    setSelectedVehicles,
    setSelectedAmenities,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    setStepValidation,
    createDraft,
    saveDraft,
    autoSaveDraft,
  };
};

