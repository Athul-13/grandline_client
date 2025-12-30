import { ArrowLeft, Edit, Trash2, CreditCard, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/ui/button';
import { ChatIcon } from '../chat/common/chat_icon';
import { QuoteStatus } from '../../types/quotes/quote';
import { ROUTES } from '../../constants/routes';
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
  const navigate = useNavigate();

  // Chat is available when status is SUBMITTED or later (but not EXPIRED)
  const isChatAvailable =
    (quoteDetails.status === QuoteStatus.SUBMITTED ||
    quoteDetails.status === QuoteStatus.QUOTED ||
    quoteDetails.status === QuoteStatus.NEGOTIATING ||
    quoteDetails.status === QuoteStatus.ACCEPTED ||
    quoteDetails.status === QuoteStatus.PAID) &&
    quoteDetails.status !== QuoteStatus.EXPIRED;

  // Payment button is available for QUOTED status quotes (not EXPIRED)
  const isPaymentAvailable = 
    quoteDetails.status === QuoteStatus.QUOTED && 
    quoteDetails.quotedAt &&
    quoteDetails.status !== QuoteStatus.EXPIRED;
  
  // Check if payment window has expired
  const isPaymentWindowExpired = (): boolean => {
    if (!quoteDetails.quotedAt) return true;
    const quotedAt = typeof quoteDetails.quotedAt === 'string' 
      ? new Date(quoteDetails.quotedAt) 
      : quoteDetails.quotedAt;
    const paymentWindowExpiresAt = new Date(quotedAt.getTime() + 24 * 60 * 60 * 1000);
    return new Date() > paymentWindowExpiresAt;
  };

  // Check if quote is expired
  const isExpired = quoteDetails.status === QuoteStatus.EXPIRED;

  const handlePaymentClick = () => {
    navigate(ROUTES.payment(quoteDetails.quoteId));
  };

  const handleSubmitAgain = () => {
    // Navigate to build quote page with resubmit flag and quoteId
    // The build quote page will pre-fill data from the expired quote
    navigate(`${ROUTES.buildQuote}?resubmit=true&quoteId=${quoteDetails.quoteId}`);
  };
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
          {/* Submit Again Button - Show for EXPIRED status */}
          {isExpired && (
            <Button
              variant="default"
              size="sm"
              onClick={handleSubmitAgain}
              className="flex items-center gap-2 bg-[var(--color-primary)] text-white hover:opacity-90"
            >
              <RefreshCw className="w-4 h-4" />
              Submit Again
            </Button>
          )}

          {/* Payment Button - Show for QUOTED status (not expired) */}
          {!isExpired && isPaymentAvailable && !isPaymentWindowExpired() && (
            <Button
              variant="default"
              size="sm"
              onClick={handlePaymentClick}
              className="flex items-center gap-2 bg-[var(--color-primary)] text-white hover:opacity-90"
            >
              <CreditCard className="w-4 h-4" />
              Pay Now
            </Button>
          )}

          {/* Chat Icon with Label */}
          {isChatAvailable && onChatClick && (
            <ChatIcon
              unreadCount={unreadCount}
              onClick={onChatClick}
              showLabel
              label="Chat with Admin"
            />
          )}

          {/* Edit Button - Hide for EXPIRED quotes */}
          {!isExpired && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}

          {/* Delete Button - Hide for EXPIRED quotes */}
          {!isExpired && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

