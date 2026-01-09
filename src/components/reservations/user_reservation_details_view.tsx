import { useState } from 'react';
import { useReservationVehicles } from '../../hooks/reservations/use_reservation_vehicles';
import { useReservationAmenities } from '../../hooks/reservations/use_reservation_amenities';
import { UserReservationDetailsHeader } from './user_reservation_details_header';
import { BasicInfoBentoCard } from './details/basic_info_bento_card';
import { ItineraryBentoCard } from './details/itinerary_bento_card';
import { VehiclesBentoCard } from './details/vehicles_bento_card';
import { AmenitiesBentoCard } from './details/amenities_bento_card';
import { DriverDetailsBentoCard } from './details/driver_details_bento_card';
import { PassengersBentoCard } from './details/passengers_bento_card';
import { RouteBentoCard } from './details/route_bento_card';
import { DriverTrackingBentoCard } from './details/driver_tracking_bento_card';
import { DriverTrackingInfoBox } from './details/driver_tracking_info_box';
import { UserChatView } from '../chat/user/user_chat_view';
import { UserReservationChatView } from '../chat/user/user_reservation_chat_view';
import { useChatForQuote } from '../../hooks/chat/use_chat_for_quote';
import { CancelReservationRequestModal } from './user/cancel_reservation_request_modal';
import { useCreateTicket } from '../../hooks/support/use_create_ticket';
import { LinkedEntityType, ActorType, TicketPriority } from '../../types/support/ticket';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage } from '../../utils/error_sanitizer';
import type { ReservationResponse } from '../../types/reservations/reservation';
import type { QuoteResponse, QuoteStatusType } from '../../types/quotes/quote';

interface UserReservationDetailsViewProps {
  reservationDetails: ReservationResponse;
  onBack: () => void;
}

/**
 * User Reservation Details View Component
 * Main container for displaying reservation details with bento-style layout
 * Note: Pricing is not shown as per requirements
 */
export const UserReservationDetailsView: React.FC<UserReservationDetailsViewProps> = ({
  reservationDetails,
  onBack,
}) => {
  const [chatMode, setChatMode] = useState<'none' | 'admin' | 'driver'>('none');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { vehicles, isLoading: isLoadingVehicles } = useReservationVehicles(
    reservationDetails.selectedVehicles
  );
  const { amenities, isLoading: isLoadingAmenities } = useReservationAmenities(
    reservationDetails.selectedAmenities
  );
  const { createTicket, isLoading: isCreatingTicket } = useCreateTicket();

  // Get chat for quote (for admin chat) - we need quoteId from reservation
  // Note: This assumes reservation has quoteId, which it should based on the type
  useChatForQuote({
    quoteId: reservationDetails.quoteId,
    userId: reservationDetails.userId,
    autoJoin: false,
  });

  const handleChatWithAdmin = () => {
    setChatMode('admin');
  };

  const handleChatWithDriver = () => {
    setChatMode('driver');
  };

  const handleBackFromChat = () => {
    setChatMode('none');
  };

  const handleBackToReservations = () => {
    if (chatMode !== 'none') {
      setChatMode('none');
    } else {
      onBack();
    }
  };

  const handleCancelRequest = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancellation = async () => {
    try {
      await createTicket({
        actorType: ActorType.USER,
        actorId: reservationDetails.userId,
        subject: `Cancellation Request for Reservation: ${reservationDetails.reservationNumber || reservationDetails.reservationId}`,
        content: 'User has requested cancellation for this reservation.',
        linkedEntityType: LinkedEntityType.RESERVATION,
        linkedEntityId: reservationDetails.reservationId,
        priority: TicketPriority.HIGH,
      });
      toast.success('Cancellation request submitted successfully. Our team will review it shortly.');
      setShowCancelModal(false);
    } catch (error) {
      toast.error(sanitizeErrorMessage(error));
    }
  };

  // Show chat view if chat is active
  if (chatMode === 'admin') {
    // For admin chat, we need to create a QuoteResponse-like object from reservation
    // This reuses the existing quote chat
    const quoteDetails: QuoteResponse = {
      quoteId: reservationDetails.quoteId,
      userId: reservationDetails.userId,
      quoteNumber: reservationDetails.reservationNumber || '',
      tripType: reservationDetails.tripType,
      tripName: reservationDetails.tripName || '',
      eventType: reservationDetails.eventType || '',
      customEventType: reservationDetails.customEventType || null,
      passengerCount: reservationDetails.passengerCount || 0,
      status: 'quoted' as QuoteStatusType, // Quote status - not used for chat
      selectedVehicles: reservationDetails.selectedVehicles || [],
      selectedAmenities: reservationDetails.selectedAmenities || [],
      routeData: reservationDetails.routeData,
      assignedDriverId: reservationDetails.assignedDriverId,
      createdAt: reservationDetails.createdAt,
      updatedAt: reservationDetails.updatedAt,
      currentStep: 0,
    };
    return <UserChatView quoteDetails={quoteDetails} onBack={handleBackFromChat} />;
  }

  if (chatMode === 'driver') {
    return (
      <UserReservationChatView
        reservationDetails={reservationDetails}
        onBack={handleBackFromChat}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
        {/* Header with Trip Name, Back Button, and Chat Buttons */}
        <UserReservationDetailsHeader
          reservationDetails={reservationDetails}
          onBack={handleBackToReservations}
          onChatWithAdmin={handleChatWithAdmin}
          onChatWithDriver={handleChatWithDriver}
          onCancelRequest={handleCancelRequest}
        />

      {/* Content Area with Two Column Layout */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
          {/* Left Column: Basic Info, Driver Info, Itinerary, Amenities */}
          <div className="flex flex-col gap-4">
            {/* Basic Info */}
            <div>
              <BasicInfoBentoCard reservationDetails={reservationDetails} />
            </div>

            {/* Driver Info */}
            {reservationDetails.assignedDriverId && (
              <div>
                <DriverDetailsBentoCard reservationDetails={reservationDetails} />
              </div>
            )}

            {/* Driver Tracking Info Box */}
            {reservationDetails.assignedDriverId && (
              <div>
                <DriverTrackingInfoBox reservationDetails={reservationDetails} />
              </div>
            )}

            {/* Itinerary - Scrollable */}
            <div className="min-h-[250px] max-h-[400px] overflow-hidden">
              <ItineraryBentoCard reservationDetails={reservationDetails} />
            </div>

            {/* Amenities - Scrollable */}
            {reservationDetails.selectedAmenities && reservationDetails.selectedAmenities.length > 0 && (
              <div className="min-h-[150px] max-h-[300px] overflow-hidden">
                <AmenitiesBentoCard
                  reservationDetails={reservationDetails}
                  amenities={amenities}
                  isLoading={isLoadingAmenities}
                />
              </div>
            )}
          </div>

          {/* Right Column: Passengers, Vehicles, Route */}
          <div className="flex flex-col gap-4">
            {/* Passengers - Scrollable */}
            <div className="min-h-[400px] max-h-[600px] overflow-hidden">
              <PassengersBentoCard reservationDetails={reservationDetails} />
            </div>

            {/* Vehicles - Scrollable */}
            {reservationDetails.selectedVehicles && reservationDetails.selectedVehicles.length > 0 && (
              <div className="min-h-[150px] max-h-[250px] overflow-hidden">
                <VehiclesBentoCard
                  reservationDetails={reservationDetails}
                  vehicles={vehicles}
                  isLoading={isLoadingVehicles}
                />
              </div>
            )}

            {/* Route */}
            {reservationDetails.routeData && (
              <div className="max-h-[200px]">
                <RouteBentoCard reservationDetails={reservationDetails} />
              </div>
            )}

            {/* Driver Tracking (only shown when trip is active) */}
            <div className="min-h-[400px]">
              <DriverTrackingBentoCard reservationDetails={reservationDetails} />
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Cancel Reservation Request Modal */}
      <CancelReservationRequestModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancellation}
        isLoading={isCreatingTicket}
      />
    </>
  );
};

