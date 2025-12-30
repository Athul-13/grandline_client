import { useState } from 'react';
import { useQuoteVehicles } from '../../hooks/quotes/use_quote_vehicles';
import { useQuoteAmenities } from '../../hooks/quotes/use_quote_amenities';
import { UserQuoteDetailsHeader } from './user_quote_details_header';
import { UserChatView } from '../chat/user/user_chat_view';
import { BasicInfoBentoCard } from './details/bento/basic_info_bento_card';
import { PassengersBentoCard } from './details/bento/passengers_bento_card';
import { ItineraryBentoCard } from './details/bento/itinerary_bento_card';
import { VehiclesBentoCard } from './details/bento/vehicles_bento_card';
import { AmenitiesBentoCard } from './details/bento/amenities_bento_card';
import { PricingBentoCard } from './details/bento/pricing_bento_card';
import { RouteBentoCard } from './details/bento/route_bento_card';
import { DriverInfoBentoCard } from './details/bento/driver_info_bento_card';
import { PaymentWindowStatus } from './details/payment_window_status';
import { VehicleReselectionNotification } from './details/vehicle_reselection_notification';
import { useChatForQuote } from '../../hooks/chat/use_chat_for_quote';
import { useUnreadCount } from '../../hooks/chat/use_unread_count';
import { QuoteStatus } from '../../types/quotes/quote';
import type { QuoteResponse } from '../../types/quotes/quote';
import { AlertCircle } from 'lucide-react';

interface UserQuoteDetailsViewProps {
  quoteDetails: QuoteResponse;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * User Quote Details View Component
 * Main container for displaying quote details with bento-style layout
 */
export const UserQuoteDetailsView: React.FC<UserQuoteDetailsViewProps> = ({
  quoteDetails,
  onBack,
  onEdit,
  onDelete,
}) => {
  const [showChat, setShowChat] = useState(false);

  const { vehicles, isLoading: isLoadingVehicles } = useQuoteVehicles(quoteDetails.selectedVehicles);
  const { amenities, isLoading: isLoadingAmenities } = useQuoteAmenities(quoteDetails.selectedAmenities);

  // Get chat for quote (autoJoin: false - only fetch chat data, don't join room)
  const { chat } = useChatForQuote({
    quoteId: quoteDetails.quoteId,
    userId: quoteDetails.userId,
    autoJoin: false,
  });

  // Get unread count for chat
  const { unreadCount } = useUnreadCount({ chatId: chat?.chatId });

  const handleChatClick = () => {
    setShowChat(true);
  };

  const handleBackFromChat = () => {
    setShowChat(false);
  };

  const handleBackToQuotes = () => {
    if (showChat) {
      setShowChat(false);
    } else {
      onBack();
    }
  };

  // Show chat view if chat is active
  if (showChat) {
    return (
      <UserChatView quoteDetails={quoteDetails} onBack={handleBackFromChat} />
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Header with Trip Name, Chat Icon, and Actions */}
      <UserQuoteDetailsHeader
        quoteDetails={quoteDetails}
        onBack={handleBackToQuotes}
        onEdit={onEdit}
        onDelete={onDelete}
        onChatClick={handleChatClick}
        unreadCount={unreadCount}
      />

      {/* Content Area with Two Column Layout */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
        {/* Expired Quote Message - Full Width */}
        {quoteDetails.status === QuoteStatus.EXPIRED && (
          <div className="mb-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                    Quote Expired
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                    This quote expired because payment was not completed within 24 hours.
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Please submit again to receive an updated quote.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Window Status - Full Width (hide for expired) */}
        {quoteDetails.status !== QuoteStatus.EXPIRED && (
          <div className="mb-4">
            <PaymentWindowStatus quoteDetails={quoteDetails} />
          </div>
        )}

        {/* Vehicle Reselection Notification - Full Width (hide for expired) */}
        {quoteDetails.status !== QuoteStatus.EXPIRED && (
          <div className="mb-4">
            <VehicleReselectionNotification quoteDetails={quoteDetails} onEdit={onEdit} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
          {/* Left Column: Basic Info, Itinerary, Amenities, Pricing */}
          <div className="flex flex-col gap-4">
            {/* Basic Info */}
            <div>
              <BasicInfoBentoCard quoteDetails={quoteDetails} />
            </div>

            {/* Driver Info - Show if driver is assigned */}
            {quoteDetails.assignedDriverId && (
              <div>
                <DriverInfoBentoCard quoteDetails={quoteDetails} />
              </div>
            )}

            {/* Itinerary - Scrollable */}
            <div className="min-h-[250px] max-h-[400px] overflow-hidden">
              <ItineraryBentoCard quoteDetails={quoteDetails} />
            </div>

            {/* Amenities - Scrollable */}
            <div className="min-h-[150px] max-h-[300px] overflow-hidden">
              <AmenitiesBentoCard
                quoteDetails={quoteDetails}
                amenities={amenities}
                isLoading={isLoadingAmenities}
              />
            </div>

            {/* Pricing */}
            <div className="max-h-[500px]">
              <PricingBentoCard quoteDetails={quoteDetails} />
            </div>
          </div>

          {/* Right Column: Passengers, Vehicles, Route */}
          <div className="flex flex-col gap-4">
            {/* Passengers - Scrollable */}
            <div className="min-h-[400px] max-h-[600px] overflow-hidden">
              <PassengersBentoCard quoteDetails={quoteDetails} />
            </div>

            {/* Vehicles - Scrollable */}
            <div className="min-h-[150px] max-h-[250px] overflow-hidden">
              <VehiclesBentoCard
                quoteDetails={quoteDetails}
                vehicles={vehicles}
                isLoading={isLoadingVehicles}
              />
            </div>

            {/* Route */}
            <div className="max-h-[200px]">
              <RouteBentoCard quoteDetails={quoteDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

