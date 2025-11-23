import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../../components/common/ui/button';
import { FormInput } from '../../../../components/common/forms/form_input';
import { FormSelect } from '../../../../components/common/forms/form_select';
import { eventTypeService } from '../../../../services/api/event_type_service';
import { PassengerForm } from './passenger_form';
import { ConfirmationModal } from '../../../../components/common/modals/confirmation_modal';
import { Edit2, Trash2, User } from 'lucide-react';
import type { PassengerDto } from '../../../../types/quotes/passenger';
import type { EventTypeResponse } from '../../../../types/quotes/event_type';
import { cn } from '../../../../utils/cn';

interface Step3UserDetailsProps {
  tripName: string;
  eventType: string;
  customEventType: string | null;
  passengers: PassengerDto[];
  onTripNameChange: (tripName: string) => void;
  onEventTypeChange: (eventType: string, customEventType?: string | null) => void;
  onPassengersChange: (passengers: PassengerDto[]) => void;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  onStepValidationChange?: (isValid: boolean) => void;
  isLoading?: boolean;
}

/**
 * Step 3: User Details
 * User enters trip name, event type, and passenger information
 */
export const Step3UserDetails: React.FC<Step3UserDetailsProps> = ({
  tripName,
  eventType,
  customEventType,
  passengers,
  onTripNameChange,
  onEventTypeChange,
  onPassengersChange,
  onNext,
  onPrevious,
  onStepValidationChange,
  isLoading = false,
}) => {
  // Passenger form modal state
  const [isPassengerFormOpen, setIsPassengerFormOpen] = useState(false);
  const [passengerFormMode, setPassengerFormMode] = useState<'add' | 'edit'>('add');
  const [editingPassengerIndex, setEditingPassengerIndex] = useState<number | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [removingPassengerIndex, setRemovingPassengerIndex] = useState<number | null>(null);
  // Event types state
  const [eventTypes, setEventTypes] = useState<EventTypeResponse[]>([]);
  const [isLoadingEventTypes, setIsLoadingEventTypes] = useState(true);
  const [eventTypesError, setEventTypesError] = useState<string | null>(null);

  // Validation errors
  const [tripNameError, setTripNameError] = useState<string | null>(null);
  const [eventTypeError, setEventTypeError] = useState<string | null>(null);

  // Fetch event types on mount
  useEffect(() => {
    const fetchEventTypes = async () => {
      setIsLoadingEventTypes(true);
      setEventTypesError(null);
      try {
        const data = await eventTypeService.getEventTypes();
        setEventTypes(data);
      } catch (error) {
        setEventTypesError(error instanceof Error ? error.message : 'Failed to load event types');
        setEventTypes([]);
      } finally {
        setIsLoadingEventTypes(false);
      }
    };

    fetchEventTypes();
  }, []);

  // Validate trip name
  const validateTripName = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Trip name is required';
    }
    if (trimmed.length < 3) {
      return 'Trip name must be at least 3 characters';
    }
    return null;
  };

  // Validate event type
  const validateEventType = (): string | null => {
    if (!eventType) {
      return 'Event type is required';
    }
    if (eventType === 'other' && (!customEventType || customEventType.trim().length === 0)) {
      return 'Custom event type is required';
    }
    return null;
  };

  // Overall step validation
  const isStepValid = useMemo(() => {
    const tripNameValid = !validateTripName(tripName);
    const eventTypeValid = !validateEventType();
    const passengersValid = passengers.length > 0;
    return tripNameValid && eventTypeValid && passengersValid;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripName, eventType, customEventType, passengers.length]);

  // Update step validation when it changes
  useEffect(() => {
    if (onStepValidationChange) {
      onStepValidationChange(isStepValid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStepValid]);

  // Handle trip name change
  const handleTripNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onTripNameChange(value);
    const error = validateTripName(value);
    setTripNameError(error);
  };

  // Handle event type change
  const handleEventTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'other') {
      onEventTypeChange('other', customEventType || '');
    } else {
      onEventTypeChange(value, null);
    }
    const error = validateEventType();
    setEventTypeError(error);
  };

  // Handle custom event type change
  const handleCustomEventTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onEventTypeChange('other', value);
    const error = validateEventType();
    setEventTypeError(error);
  };

  // Prepare event type options
  const eventTypeOptions = useMemo(() => {
    const options: Array<{ value: string; label: string }> = [];
    
    // If no event types from server, only show "Other"
    if (eventTypes.length === 0 && !isLoadingEventTypes) {
      options.push({ value: 'other', label: 'Other' });
    } else {
      // Add all event types from server
      eventTypes.forEach((et) => {
        options.push({ value: et.eventTypeId, label: et.name });
      });
      // Add "Other" option at the end
      options.push({ value: 'other', label: 'Other' });
    }
    
    return options;
  }, [eventTypes, isLoadingEventTypes]);

  // Handle add passenger
  const handleAddPassenger = () => {
    setPassengerFormMode('add');
    setEditingPassengerIndex(null);
    setIsPassengerFormOpen(true);
  };

  // Handle edit passenger
  const handleEditPassenger = (index: number) => {
    setPassengerFormMode('edit');
    setEditingPassengerIndex(index);
    setIsPassengerFormOpen(true);
  };

  // Handle save passenger
  const handleSavePassenger = (passenger: PassengerDto) => {
    const updatedPassengers = [...passengers];
    if (passengerFormMode === 'edit' && editingPassengerIndex !== null) {
      updatedPassengers[editingPassengerIndex] = passenger;
    } else {
      updatedPassengers.push(passenger);
    }
    onPassengersChange(updatedPassengers);
    setIsPassengerFormOpen(false);
    setEditingPassengerIndex(null);
  };

  // Handle remove passenger
  const handleRemovePassenger = (index: number) => {
    setRemovingPassengerIndex(index);
    setShowRemoveConfirm(true);
  };

  const confirmRemovePassenger = () => {
    if (removingPassengerIndex !== null) {
      const updatedPassengers = passengers.filter((_, index) => index !== removingPassengerIndex);
      onPassengersChange(updatedPassengers);
      setShowRemoveConfirm(false);
      setRemovingPassengerIndex(null);
    }
  };

  const handleNext = async () => {
    await onNext();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-2">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
          User Details
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Enter your trip information and passenger details
        </p>
      </div>

      {/* Content Area - Flex grow to fill available space */}
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        {/* Trip Information Section */}
        <div className="flex-shrink-0">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            Trip Information
          </h3>
          <div className="space-y-2">
            {/* Trip Name Field - Full Width */}
            <FormInput
              label="Trip Name"
              value={tripName}
              onChange={handleTripNameChange}
              placeholder="Enter trip name"
              error={tripNameError || undefined}
              disabled={isLoading}
            />

            {/* Event Type and Custom Event Type - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Event Type Field */}
              <div>
                <FormSelect
                  label="Event Type"
                  value={eventType}
                  onChange={handleEventTypeChange}
                  options={eventTypeOptions}
                  placeholder={isLoadingEventTypes ? 'Loading event types...' : 'Select event type'}
                  error={eventTypeError || undefined}
                  disabled={isLoading || isLoadingEventTypes}
                />
                {eventTypesError && (
                  <p className="mt-1 text-sm text-yellow-600">
                    {eventTypesError}. You can still select "Other" option.
                  </p>
                )}
              </div>

              {/* Custom Event Type Input (shown when "Other" is selected) */}
              {eventType === 'other' ? (
                <FormInput
                  label="Custom Event Type"
                  value={customEventType || ''}
                  onChange={handleCustomEventTypeChange}
                  placeholder="Enter custom event type"
                  error={eventType === 'other' && !customEventType?.trim() ? 'Custom event type is required' : undefined}
                  disabled={isLoading}
                />
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>

        {/* Passenger Information Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Passenger Information
            </h3>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {passengers.length} {passengers.length === 1 ? 'passenger' : 'passengers'}
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden">
            {passengers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-4">
                <User className="w-10 h-10 text-[var(--color-text-muted)] mb-2" />
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                  No passengers added yet
                </p>
                <Button onClick={handleAddPassenger} variant="outline" size="sm">
                  Add Passenger
                </Button>
              </div>
            ) : (
              <div 
                className="grid gap-2 pb-2 overflow-x-auto"
                style={{ 
                  gridTemplateRows: 'repeat(2, auto)',
                  gridAutoFlow: 'column',
                  gridAutoColumns: '180px'
                }}
              >
                {passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className={cn(
                      'bg-[var(--color-bg-secondary)] rounded-lg p-2.5 border border-[var(--color-border)]',
                      'flex flex-col w-[180px]'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <User className="w-3.5 h-3.5 text-[var(--color-text-muted)] flex-shrink-0" />
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                          {passenger.fullName}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleEditPassenger(index)}
                          className="p-1 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded transition-colors"
                          title="Edit passenger"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemovePassenger(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Remove passenger"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-1 truncate">
                      {passenger.phoneNumber}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Age: {passenger.age}
                    </p>
                  </div>
                ))}
                <button
                  onClick={handleAddPassenger}
                  className={cn(
                    'bg-[var(--color-bg-secondary)] rounded-lg p-2.5 border-2 border-dashed border-[var(--color-border)]',
                    'flex flex-col items-center justify-center w-[180px]',
                    'hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors',
                    'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
                  )}
                >
                  <User className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Add Passenger</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Fixed at bottom */}
      <div className="flex-shrink-0 flex justify-end gap-3 pt-3 mt-3 border-t border-[var(--color-border)]">
        <Button
          onClick={onPrevious}
          variant="outline"
          disabled={isLoading}
          size="sm"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={isLoading || !isStepValid}
          loading={isLoading}
          size="sm"
        >
          Next
        </Button>
      </div>

      {/* Passenger Form Modal */}
      <PassengerForm
        isOpen={isPassengerFormOpen}
        onClose={() => {
          setIsPassengerFormOpen(false);
          setEditingPassengerIndex(null);
        }}
        mode={passengerFormMode}
        passenger={editingPassengerIndex !== null ? passengers[editingPassengerIndex] : undefined}
        onSave={handleSavePassenger}
      />

      {/* Remove Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRemoveConfirm}
        onClose={() => {
          setShowRemoveConfirm(false);
          setRemovingPassengerIndex(null);
        }}
        onConfirm={confirmRemovePassenger}
        title="Remove Passenger"
        message={`Are you sure you want to remove ${removingPassengerIndex !== null ? passengers[removingPassengerIndex]?.fullName : 'this passenger'}?`}
        confirmText="Remove"
        variant="danger"
      />
    </div>
  );
};

