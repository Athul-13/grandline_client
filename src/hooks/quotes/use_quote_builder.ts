import { useState, useCallback, useEffect } from 'react';
import { useQuoteDraft } from './use_quote_draft';
import { quoteService } from '../../services/api/quote_service';
import type { TripTypeType } from '../../types/quotes/quote';
import type { ItineraryStopDto } from '../../types/quotes/itinerary';
import { StopType } from '../../types/quotes/itinerary';
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
          const loadedItinerary = draft.itinerary ? {
            outbound: (draft.itinerary.outbound || []) as ItineraryStopDto[],
            return: draft.itinerary.return ? (draft.itinerary.return as ItineraryStopDto[]) : undefined,
          } : null;
          const loadedPassengers = (draft.passengers || []) as PassengerDto[];

          setState({
            quoteId: draft.quoteId,
            tripType: draft.tripType,
            itinerary: loadedItinerary,
            tripName: draft.tripName || '',
            eventType: draft.eventType || '',
            customEventType: draft.customEventType || null,
            passengers: loadedPassengers,
            selectedVehicles: draft.selectedVehicles || [],
            selectedAmenities: draft.selectedAmenities || [],
            currentStep: draft.currentStep || 1,
          });

          // Validate all steps based on loaded data
          // Step 1: Valid if tripType exists
          setValidation((prev) => ({
            ...prev,
            step1: !!draft.tripType,
          }));

          // Step 2: Valid if itinerary has pickup, dropoff, valid locations, and required times
          if (loadedItinerary) {
            const hasPickup = loadedItinerary.outbound.some((stop) => stop.stopType === StopType.PICKUP);
            const hasDropoff = loadedItinerary.outbound.some((stop) => stop.stopType === StopType.DROPOFF);
            
            // Check valid locations (all stops with locationName have valid coordinates)
            const allStops = [...loadedItinerary.outbound, ...(loadedItinerary.return || [])];
            const hasValidLocations = allStops.every((stop) => {
              if (!stop.locationName || stop.locationName.trim() === '') {
                return true; // Skip validation for empty stops
              }
              return (
                stop.latitude !== 0 &&
                stop.longitude !== 0 &&
                !isNaN(stop.latitude) &&
                !isNaN(stop.longitude) &&
                stop.latitude !== null &&
                stop.longitude !== null
              );
            });
            
            // Check required times
            const pickup = loadedItinerary.outbound.find((stop) => stop.stopType === StopType.PICKUP);
            const hasPickupTime = pickup && pickup.departureTime && pickup.departureTime !== '';
            const intermediateStops = loadedItinerary.outbound.filter((stop) => stop.stopType === StopType.STOP);
            const hasAllIntermediateTimes = intermediateStops.every(
              (stop) => stop.departureTime && stop.departureTime !== ''
            );
            const hasRequiredTimes = hasPickupTime && hasAllIntermediateTimes;
            
            const isValid = hasPickup && hasDropoff && hasValidLocations && hasRequiredTimes;
            setValidation((prev) => ({
              ...prev,
              step2: isValid,
            }));
          }

          // Step 3: Valid if tripName, eventType, and passengers exist
          const tripNameValid = draft.tripName && draft.tripName.trim().length >= 3;
          const eventTypeValid = !!draft.eventType && (draft.eventType !== 'other' || (draft.customEventType && draft.customEventType.trim().length > 0));
          const passengersValid = loadedPassengers.length > 0;
          setValidation((prev) => ({
            ...prev,
            step3: tripNameValid && eventTypeValid && passengersValid,
          }));
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
    setState((prev) => {
      // Auto-save if quoteId exists (use prev.quoteId to avoid stale closure)
      if (prev.quoteId) {
        setTimeout(() => {
          autoSaveDraft({ tripType });
        }, 0);
      }
      return { ...prev, tripType };
    });
    setValidation((prev) => ({ ...prev, step1: true }));
  }, [autoSaveDraft]);

  /**
   * Validate if arrivalTime is a valid ISO string
   * Checks if the string is a valid ISO 8601 format
   */
  const isValidISOString = useCallback((value: string | null | undefined): boolean => {
    if (!value || value === '') return false;
    try {
      const date = new Date(value);
      // Check if date is valid and value matches ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
      if (isNaN(date.getTime())) return false;
      // Check if it's a valid ISO string format
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
      return isoRegex.test(value) || value === date.toISOString();
    } catch {
      return false;
    }
  }, []);

  /**
   * Sanitize itinerary stops: convert empty arrivalTime strings to null and validate ISO format
   * This is used only when sending to API, not for internal state
   */
  const sanitizeItineraryForAPI = useCallback((itinerary: QuoteBuilderState['itinerary']) => {
    if (!itinerary) return null;
    
    return {
      outbound: itinerary.outbound.map((stop) => {
        // Convert empty string to null for all stops (including dropoff)
        // Ensure arrivalTime is valid ISO format if present
        let arrivalTime = stop.arrivalTime === '' ? null : stop.arrivalTime;
        if (arrivalTime && !isValidISOString(arrivalTime)) {
          // If not valid ISO, try to convert it
          try {
            const date = new Date(arrivalTime);
            if (!isNaN(date.getTime())) {
              arrivalTime = date.toISOString();
            } else {
              arrivalTime = null;
            }
          } catch {
            arrivalTime = null;
          }
        }
        return {
          ...stop,
          arrivalTime,
        };
      }) as unknown as ItineraryStopDto[],
      return: itinerary.return?.map((stop) => {
        // Convert empty string to null for all stops (including dropoff)
        // Ensure arrivalTime is valid ISO format if present
        let arrivalTime = stop.arrivalTime === '' ? null : stop.arrivalTime;
        if (arrivalTime && !isValidISOString(arrivalTime)) {
          // If not valid ISO, try to convert it
          try {
            const date = new Date(arrivalTime);
            if (!isNaN(date.getTime())) {
              arrivalTime = date.toISOString();
            } else {
              arrivalTime = null;
            }
          } catch {
            arrivalTime = null;
          }
        }
        return {
          ...stop,
          arrivalTime,
        };
      }) as unknown as ItineraryStopDto[] | undefined,
    };
  }, [isValidISOString]);

  /**
   * Check if stop has valid coordinates (location was selected from suggestions)
   * Only checks stops that have a locationName (user has interacted with the field)
   */
  const hasValidCoordinates = useCallback((stop: ItineraryStopDto): boolean => {
    // If stop has no locationName, don't check coordinates (stop not yet filled)
    if (!stop.locationName || stop.locationName.trim() === '') {
      return true; // Skip validation for empty stops
    }
    
    // If stop has locationName, it must have valid coordinates (selected from suggestions)
    return (
      stop.latitude !== 0 &&
      stop.longitude !== 0 &&
      !isNaN(stop.latitude) &&
      !isNaN(stop.longitude) &&
      stop.latitude !== null &&
      stop.longitude !== null
    );
  }, []);

  /**
   * Check if itinerary has valid locations (all stops with locationName have coordinates from suggestions)
   */
  const hasValidLocations = useCallback((itinerary: QuoteBuilderState['itinerary']): boolean => {
    if (!itinerary) return false;
    
    // Check all stops that have locationName also have valid coordinates (location was selected, not just typed)
    const allStops = [...itinerary.outbound, ...(itinerary.return || [])];
    return allStops.every((stop) => hasValidCoordinates(stop));
  }, [hasValidCoordinates]);

  /**
   * Check if itinerary has required times for draft saving
   */
  const hasRequiredTimes = useCallback((itinerary: QuoteBuilderState['itinerary']): boolean => {
    if (!itinerary) return false;
    
    // Check pickup has departure time (arrivalTime is auto-calculated from departureTime - 30 minutes)
    const pickup = itinerary.outbound.find((stop) => stop.stopType === StopType.PICKUP);
    if (!pickup || !pickup.departureTime || pickup.departureTime === '') {
      return false;
    }
    
    // Check all intermediate stops have departure time (arrivalTime is calculated from previous stop's departure + route duration)
    const intermediateStops = itinerary.outbound.filter((stop) => stop.stopType === StopType.STOP);
    for (const stop of intermediateStops) {
      if (!stop.departureTime || stop.departureTime === '') {
        return false;
      }
    }
    
    return true;
  }, []);

  /**
   * Update itinerary
   */
  const setItinerary = useCallback((itinerary: QuoteBuilderState['itinerary']) => {
    setState((prev) => {
      const newState = { ...prev, itinerary };
      
      // Auto-save if quoteId exists and itinerary is valid (use prev.quoteId to avoid stale closure)
      if (prev.quoteId && itinerary) {
        // Validate: Outbound must have at least pickup and dropoff
        const hasPickup = itinerary.outbound.some((stop) => stop.stopType === StopType.PICKUP);
        const hasDropoff = itinerary.outbound.some((stop) => stop.stopType === StopType.DROPOFF);
        
        // Only save if:
        // 1. Has pickup and dropoff
        // 2. All stops have valid coordinates (location was selected from suggestions, not just typed)
        // 3. Has required times
        if (hasPickup && hasDropoff && hasValidLocations(itinerary) && hasRequiredTimes(itinerary)) {
          // Sanitize itinerary before saving (convert empty strings to null, validate ISO format)
          const sanitized = sanitizeItineraryForAPI(itinerary);
          
          // Use setTimeout to avoid calling autoSaveDraft during state update
          setTimeout(() => {
            autoSaveDraft({ itinerary: sanitized as { outbound: unknown[]; return?: unknown[] } });
          }, 0);
        }
        // If invalid, don't save (prevents 400 errors from backend)
        // This prevents saving when user is just typing in address field (no coordinates yet)
      }
      
      return newState;
    });
  }, [autoSaveDraft, sanitizeItineraryForAPI, hasRequiredTimes, hasValidLocations]);

  /**
   * Update trip name
   */
  const setTripName = useCallback((tripName: string) => {
    setState((prev) => {
      if (prev.quoteId) {
        setTimeout(() => {
          autoSaveDraft({ tripName });
        }, 0);
      }
      return { ...prev, tripName };
    });
  }, [autoSaveDraft]);

  /**
   * Update event type
   */
  const setEventType = useCallback((eventType: string, customEventType?: string | null) => {
    setState((prev) => {
      if (prev.quoteId) {
        setTimeout(() => {
          autoSaveDraft({ eventType, customEventType: customEventType || null });
        }, 0);
      }
      return { ...prev, eventType, customEventType: customEventType || null };
    });
  }, [autoSaveDraft]);

  /**
   * Update passengers
   */
  const setPassengers = useCallback((passengers: PassengerDto[]) => {
    setState((prev) => {
      if (prev.quoteId) {
        setTimeout(() => {
          autoSaveDraft({ passengers: passengers as unknown[] });
        }, 0);
      }
      return { ...prev, passengers };
    });
  }, [autoSaveDraft]);

  /**
   * Update selected vehicles
   */
  const setSelectedVehicles = useCallback((selectedVehicles: SelectedVehicle[]) => {
    setState((prev) => {
      if (prev.quoteId) {
        setTimeout(() => {
          autoSaveDraft({ selectedVehicles });
        }, 0);
      }
      return { ...prev, selectedVehicles };
    });
  }, [autoSaveDraft]);

  /**
   * Update selected amenities
   */
  const setSelectedAmenities = useCallback((selectedAmenities: string[]) => {
    setState((prev) => {
      if (prev.quoteId) {
        setTimeout(() => {
          autoSaveDraft({ selectedAmenities });
        }, 0);
      }
      return { ...prev, selectedAmenities };
    });
  }, [autoSaveDraft]);

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

