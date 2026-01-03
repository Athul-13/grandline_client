import { Copy, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { highlightSearchTerm } from '../../utils/highlight_search';
import { formatDate, formatPrice, getTripTypeLabel } from '../../utils/quote_formatters';
import { StatusBadge } from './quote_status_badge';
import type { AdminQuoteListItem } from '../../types/quotes/admin_quote';
import { useQuoteUnreadCount } from '../../hooks/chat/use_quote_unread_count';

interface AdminQuotesCardProps {
  quote: AdminQuoteListItem;
  searchQuery: string;
  copiedQuoteId: string | null;
  onCopyQuoteId: (quoteId: string, e: React.MouseEvent) => void;
  isSelected: boolean;
  onSelectChange: (isSelected: boolean) => void;
  onCardClick: () => void;
}

/**
 * Admin Quotes Card Component
 * Displays a single quote card in the mobile view
 */
export const AdminQuotesCard: React.FC<AdminQuotesCardProps> = ({
  quote,
  searchQuery,
  copiedQuoteId,
  onCopyQuoteId,
  isSelected,
  onSelectChange,
  onCardClick,
}) => {
  const isDeleted = quote.isDeleted === true;
  const { unreadCount } = useQuoteUnreadCount({ quoteId: quote.quoteId });

  return (
    <div
      className={cn(
        "bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 cursor-pointer hover:bg-[var(--color-bg-secondary)] transition-colors relative",
        isSelected && "bg-[var(--color-bg-secondary)] border-[var(--color-primary)]"
      )}
      style={isDeleted ? { boxShadow: 'inset 0 0 0 1px rgba(239, 68, 68, 0.3)' } : undefined}
      onClick={onCardClick}
    >
      {unreadCount > 0 && (
        <div className="absolute top-3 right-3 z-50">
          <div className="relative flex items-center justify-center">
            {/* <div className="absolute w-3 h-3 bg-red-500 rounded-full z-50 animate-ping opacity-75"></div> */}
            <div className="absolute w-3 h-3 bg-red-500 rounded-full z-50"></div>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelectChange(e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 cursor-pointer mt-1 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-[var(--color-text-primary)] truncate mb-1">
              {quote.tripName ? highlightSearchTerm(quote.tripName, searchQuery) : 'Untitled Trip'}
            </h3>
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={quote.status} />
            <span className="text-xs text-[var(--color-text-secondary)]">
              {getTripTypeLabel(quote.tripType)}
            </span>
          </div>
          <div className="flex items-center">
            <p className="text-xs text-[var(--color-text-secondary)] font-mono">
              ID: {highlightSearchTerm(quote.quoteId.slice(0, 8) + '...', searchQuery)}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyQuoteId(quote.quoteId, e);
              }}
              className={cn(
                'p-1 rounded hover:bg-[var(--color-bg-secondary)]',
                'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                'transition-colors flex-shrink-0'
              )}
              title="Copy quote ID"
            >
              {copiedQuoteId === quote.quoteId ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-start justify-between">
          <span className="text-[var(--color-text-secondary)]">User:</span>
          <span className="text-[var(--color-text-primary)] font-medium text-right flex-1 ml-2">
            {highlightSearchTerm(quote.user.fullName, searchQuery)}
          </span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-[var(--color-text-secondary)]">Email:</span>
          <span className="text-[var(--color-text-primary)] text-right flex-1 ml-2 break-all">
            {highlightSearchTerm(quote.user.email, searchQuery)}
          </span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-[var(--color-text-secondary)]">Price:</span>
          <span className="text-[var(--color-text-primary)] font-medium text-right flex-1 ml-2">
            {formatPrice(quote.totalPrice)}
          </span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-[var(--color-text-secondary)]">Created:</span>
          <span className="text-[var(--color-text-primary)] font-medium text-right flex-1 ml-2">
            {formatDate(quote.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

