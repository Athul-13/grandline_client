import React, { useState } from 'react';
import type { AdminDriverDetails } from '../../types/drivers/admin_driver';
import { AdminDriverDetailsHeader } from './admin_driver_details_header';
import { DriverBasicInfoSection } from './details/driver_basic_info_section';
import { DriverStatusSection } from './details/driver_status_section';
import { DriverOnboardingSection } from './details/driver_onboarding_section';
import { AdminChatView } from '../chat/admin/admin_chat_view';
import { useChatForDriver } from '../../hooks/chat/use_chat_for_driver';
import { useUnreadCount } from '../../hooks/chat/use_unread_count';

interface AdminDriverDetailsViewProps {
  driverDetails: AdminDriverDetails;
  onStatusChange?: () => void; // Callback to refetch driver details after status change
  onUpdate?: () => void; // Callback to refetch driver details after update
  onBack: () => void; // Callback to go back to drivers list
}

/**
 * Driver Details View Component
 * Bento-style layout for displaying all driver details
 */
export const AdminDriverDetailsView: React.FC<AdminDriverDetailsViewProps> = ({
  driverDetails,
  onStatusChange,
  onUpdate,
  onBack,
}) => {
  const [showChat, setShowChat] = useState(false);

  // Get chat for driver (autoJoin: false - only fetch chat data, don't join room)
  const { chat, isLoading: isLoadingChat, error: chatError, isJoined, joinChat, refetch: refetchChat } = useChatForDriver({
    driverId: driverDetails.driverId,
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

  const handleBackToDrivers = () => {
    if (showChat) {
      setShowChat(false);
    } else {
      onBack();
    }
  };

  if (!driverDetails) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--color-text-secondary)]">Driver details not available.</p>
      </div>
    );
  }

  // Show chat view if chat is active
  if (showChat) {
    return (
      <AdminChatView
        chat={chat}
        contextType="driver"
        contextId={driverDetails.driverId}
        contextLabel="Driver"
        otherUserName={driverDetails.fullName}
        isLoadingChat={isLoadingChat}
        chatError={chatError}
        isJoined={isJoined}
        joinChat={joinChat}
        refetchChat={refetchChat}
        onBack={handleBackFromChat}
      />
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Header with Back Button and Chat Icon */}
      <AdminDriverDetailsHeader
        driverDetails={driverDetails}
        onBack={handleBackToDrivers}
        onChatClick={handleChatClick}
        unreadCount={unreadCount}
      />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
          {/* Left Column: Profile & Basic Info */}
          <div className="flex flex-col gap-4">
            <div>
              <DriverBasicInfoSection driverDetails={driverDetails} onUpdate={onUpdate} />
            </div>
          </div>

          {/* Right Column: Status and Onboarding */}
          <div className="flex flex-col gap-4">
            <div>
              <DriverStatusSection driverDetails={driverDetails} onStatusChange={onStatusChange} />
            </div>
            <div>
              <DriverOnboardingSection driverDetails={driverDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

