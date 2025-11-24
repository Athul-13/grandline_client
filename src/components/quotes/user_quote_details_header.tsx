import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '../common/ui/button';
import { ChatIcon } from '../chat/common/chat_icon';
import { QuoteStatus } from '../../types/quotes/quote';
import type { QuoteResponse } from '../../types/quotes/quote';

interface UserQuoteDetailsHeaderProps {
  quoteDetails: QuoteResponse;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onChatClick?: () => void;
  unreadCount?: number;
}

/**
 * User Quote Details Header Component
 * Displays trip name, back button, edit and delete buttons
 */
export const UserQuoteDetailsHeader: React.FC<UserQuoteDetailsHeaderProps> = ({
  quoteDetails,
  onBack,
  onEdit,
  onDelete,
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
            <p className="text-base font-semibold text-[var(--color-text-primary)]">
              {quoteDetails.tripName || 'Quote Details'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Chat Icon with Label */}
          {isChatAvailable && onChatClick && (
            <ChatIcon
              unreadCount={unreadCount}
              onClick={onChatClick}
              showLabel
              label="Chat with Admin"
            />
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

