import { useState } from 'react';
import { AdminQuoteDetailsHeader } from './admin_quote_details_header';
import { BasicInfoSection } from './details/basic_info_section';
import { UserInfoSection } from './details/user_info_section';
import { PassengersSection } from './details/passengers_section';
import { ItinerarySection } from './details/itinerary_section';
import { VehiclesSection } from './details/vehicles_section';
import { AmenitiesSection } from './details/amenities_section';
import { PricingSection } from './details/pricing_section';
import { RouteSection } from './details/route_section';
import { AdminChatView } from '../chat/admin/admin_chat_view';
import { useQuoteVehicles } from '../../hooks/quotes/use_quote_vehicles';
import { useQuoteAmenities } from '../../hooks/quotes/use_quote_amenities';
import { useChatForQuote } from '../../hooks/chat/use_chat_for_quote';
import { useUnreadCount } from '../../hooks/chat/use_unread_count';
import type { AdminQuoteDetails } from '../../types/quotes/admin_quote';
import { QuoteStatus } from '../../types/quotes/quote';

interface AdminQuoteDetailsViewProps {
  quoteDetails: AdminQuoteDetails;
  isUpdatingStatus: boolean;
  onBack: () => void;
  onStatusChange: (newStatus: 'paid' | 'submitted') => Promise<void>;
}

/**
 * Quote Details View Component
 * Main container for displaying quote details with accordion sections
 */
export const AdminQuoteDetailsView: React.FC<AdminQuoteDetailsViewProps> = ({
  quoteDetails,
  isUpdatingStatus,
  onBack,
  onStatusChange,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basicInfo: false,
    userInfo: false,
    passengers: false,
    itinerary: false,
    vehicles: false,
    amenities: false,
    pricing: false,
    route: false,
  });
  const [showChat, setShowChat] = useState(false);

  const { vehicles, isLoading: isLoadingVehicles } = useQuoteVehicles(quoteDetails.selectedVehicles);
  const { amenities, isLoading: isLoadingAmenities } = useQuoteAmenities(quoteDetails.selectedAmenities);

  // Get chat for quote (autoJoin: false - only fetch chat data, don't join room)
  const { chat } = useChatForQuote({
    quoteId: quoteDetails.quoteId,
    userId: quoteDetails.user?.userId || '',
    autoJoin: false,
  });

  // Get unread count for chat
  const { unreadCount } = useUnreadCount({ chatId: chat?.chatId });

  // Toggle accordion section
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Get available status options based on current status
  const getAvailableStatuses = (): Array<{ value: 'paid' | 'submitted'; label: string }> => {
    const currentStatus = quoteDetails.status;

    // Can only change between PAID and SUBMITTED
    if (currentStatus === QuoteStatus.PAID) {
      return [{ value: 'submitted', label: 'Submitted' }];
    } else if (currentStatus === QuoteStatus.SUBMITTED) {
      return [{ value: 'paid', label: 'Paid' }];
    }

    return [];
  };

  const availableStatuses = getAvailableStatuses();

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
      <AdminChatView quoteDetails={quoteDetails} onBack={handleBackFromChat} />
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Header with Back Button, Chat Icon, and Status Control */}
      <AdminQuoteDetailsHeader
        quoteDetails={quoteDetails}
        availableStatuses={availableStatuses}
        isUpdatingStatus={isUpdatingStatus}
        onBack={handleBackToQuotes}
        onStatusChange={onStatusChange}
        onChatClick={handleChatClick}
        unreadCount={unreadCount}
      />

      {/* Scrollable Content Area with Accordions */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
        <BasicInfoSection
          quoteDetails={quoteDetails}
          isExpanded={expandedSections.basicInfo}
          onToggle={() => toggleSection('basicInfo')}
        />

        <UserInfoSection
          quoteDetails={quoteDetails}
          isExpanded={expandedSections.userInfo}
          onToggle={() => toggleSection('userInfo')}
        />

        <PassengersSection
          quoteDetails={quoteDetails}
          isExpanded={expandedSections.passengers}
          onToggle={() => toggleSection('passengers')}
        />

        <ItinerarySection
          quoteDetails={quoteDetails}
          isExpanded={expandedSections.itinerary}
          onToggle={() => toggleSection('itinerary')}
        />

        <VehiclesSection
          quoteDetails={quoteDetails}
          vehicles={vehicles}
          isLoading={isLoadingVehicles}
          isExpanded={expandedSections.vehicles}
          onToggle={() => toggleSection('vehicles')}
        />

        <AmenitiesSection
          quoteDetails={quoteDetails}
          amenities={amenities}
          isLoading={isLoadingAmenities}
          isExpanded={expandedSections.amenities}
          onToggle={() => toggleSection('amenities')}
        />

        <PricingSection
          quoteDetails={quoteDetails}
          isExpanded={expandedSections.pricing}
          onToggle={() => toggleSection('pricing')}
        />

        <RouteSection
          quoteDetails={quoteDetails}
          isExpanded={expandedSections.route}
          onToggle={() => toggleSection('route')}
        />
      </div>
    </div>
  );
};

