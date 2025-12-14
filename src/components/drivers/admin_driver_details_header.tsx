import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ChatIcon } from '../chat/common/chat_icon';
import type { AdminDriverDetails } from '../../types/drivers/admin_driver';

interface AdminDriverDetailsHeaderProps {
  driverDetails: AdminDriverDetails;
  onBack: () => void;
  onChatClick?: () => void;
  unreadCount?: number;
}

/**
 * Driver Details Header Component
 * Displays back button, driver ID, and chat icon
 */
export const AdminDriverDetailsHeader: React.FC<AdminDriverDetailsHeaderProps> = ({
  driverDetails,
  onBack,
  onChatClick,
  unreadCount = 0,
}) => {
  return (
    <div className="flex-shrink-0 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
            title="Back to drivers"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Driver Details</p>
            <p className="text-xs text-[var(--color-text-secondary)] font-mono">
              {driverDetails.driverId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Chat Icon - Always visible for drivers */}
          {onChatClick && (
            <ChatIcon unreadCount={unreadCount} onClick={onChatClick} />
          )}
        </div>
      </div>
    </div>
  );
};

