import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ChatIcon } from '../chat/common/chat_icon';
import { QuoteStatus } from '../../types/quotes/quote';
import type { AdminQuoteDetails } from '../../types/quotes/admin_quote';

interface AdminQuoteDetailsHeaderProps {
  quoteDetails: AdminQuoteDetails;
  availableStatuses: Array<{ value: 'paid' | 'submitted'; label: string }>;
  isUpdatingStatus: boolean;
  onBack: () => void;
  onStatusChange: (newStatus: 'paid' | 'submitted') => Promise<void>;
  onChatClick?: () => void;
  unreadCount?: number;
}

/**
 * Quote Details Header Component
 * Displays back button, quote ID, and status control
 */
export const AdminQuoteDetailsHeader: React.FC<AdminQuoteDetailsHeaderProps> = ({
  quoteDetails,
  availableStatuses,
  isUpdatingStatus,
  onBack,
  onStatusChange,
  onChatClick,
  unreadCount = 0,
}) => {
  // Chat is available when status is SUBMITTED or later
  const isChatAvailable =
    quoteDetails.status === QuoteStatus.SUBMITTED ||
    quoteDetails.status === QuoteStatus.NEGOTIATING ||
    quoteDetails.status === QuoteStatus.ACCEPTED ||
    quoteDetails.status === QuoteStatus.PAID;
  return (
    <div className="flex-shrink-0 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
            title="Back to quotes"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Quote Details</p>
            <p className="text-xs text-[var(--color-text-secondary)] font-mono">
              {quoteDetails.quoteId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Chat Icon */}
          {isChatAvailable && onChatClick && (
            <ChatIcon unreadCount={unreadCount} onClick={onChatClick} />
          )}

          {/* Status Update Control */}
          {availableStatuses.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-secondary)]">Status:</span>
              <select
                value={quoteDetails.status}
                onChange={(e) => {
                  const newStatus = e.target.value as 'paid' | 'submitted';
                  if (newStatus === 'paid' || newStatus === 'submitted') {
                    onStatusChange(newStatus);
                  }
                }}
                disabled={isUpdatingStatus}
                className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value={quoteDetails.status}>
                  {quoteDetails.status.charAt(0).toUpperCase() + quoteDetails.status.slice(1)}
                </option>
                {availableStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

