import { Copy, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { highlightSearchTerm } from '../../utils/highlight_search';
import { formatDate, formatPrice, getTripTypeLabel } from '../../utils/quote_formatters';
import { StatusBadge } from './quote_status_badge';
import type { AdminQuoteListItem } from '../../types/quotes/admin_quote';
import { useQuoteUnreadCount } from '../../hooks/chat/use_quote_unread_count';

interface AdminQuotesTableRowProps {
  quote: AdminQuoteListItem;
  searchQuery: string;
  copiedQuoteId: string | null;
  onCopyQuoteId: (quoteId: string, e: React.MouseEvent) => void;
  isSelected: boolean;
  onSelectChange: (isSelected: boolean) => void;
  onRowClick: () => void;
}

/**
 * Admin Quotes Table Row Component
 * Displays a single quote row in the desktop table view
 */
export const AdminQuotesTableRow: React.FC<AdminQuotesTableRowProps> = ({
  quote,
  searchQuery,
  copiedQuoteId,
  onCopyQuoteId,
  isSelected,
  onSelectChange,
  onRowClick,
}) => {
  const { unreadCount } = useQuoteUnreadCount({ quoteId: quote.quoteId });
  const isDeleted = quote.isDeleted === true;
  const rowRef = useRef<HTMLTableRowElement>(null);
  const [borderStyle, setBorderStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!isDeleted || !rowRef.current) return;

    const updateBorderPosition = () => {
      const row = rowRef.current;
      if (!row) return;

      const rect = row.getBoundingClientRect();
      const scrollContainer = row.closest('[class*="overflow"]') as HTMLElement;
      const containerRect = scrollContainer?.getBoundingClientRect();

      if (!containerRect) {
        setBorderStyle({ display: 'none' });
        return;
      }

      // Calculate if row is visible within container bounds
      const rowTop = rect.top;
      const rowBottom = rect.bottom;
      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;

      // Check if row intersects with visible container area
      const isVisible = rowBottom > containerTop && rowTop < containerBottom;

      if (isVisible) {
        // Calculate visible height (clip when partially outside)
        const visibleTop = Math.max(rowTop, containerTop);
        const visibleBottom = Math.min(rowBottom, containerBottom);
        const visibleHeight = visibleBottom - visibleTop;

        // Only show border if there's a visible portion
        if (visibleHeight > 4) {
          setBorderStyle({
            position: 'fixed',
            top: `${visibleTop + 2}px`,
            left: `${containerRect.left}px`,
            width: `${containerRect.width - 6}px`,
            height: `${visibleHeight - 4}px`,
            pointerEvents: 'none',
            border: '3px solid rgba(239, 68, 68, 0.3)',
            zIndex: 1,
            display: 'block',
          });
        } else {
          setBorderStyle({ display: 'none' });
        }
      } else {
        // Row is outside visible area, hide border
        setBorderStyle({ display: 'none' });
      }
    };

    updateBorderPosition();
    
    const scrollContainer = rowRef.current.closest('[class*="overflow"]');
    const handleScroll = () => updateBorderPosition();
    const handleResize = () => updateBorderPosition();

    scrollContainer?.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      scrollContainer?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDeleted]);

  return (
    <>
      {isDeleted && <div style={borderStyle} />}
      <tr
        ref={rowRef}
        className={cn(
          "flex hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer relative",
          isSelected && "bg-[var(--color-bg-secondary)]"
        )}
        onClick={onRowClick}
      >
        <td 
          className="px-4 py-3 flex-[0_0_40px] flex items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelectChange(e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 cursor-pointer"
          />
        </td>
        <td 
          className="px-4 py-3 text-sm text-[var(--color-text-primary)] font-mono flex-[0_0_12%] relative group min-w-0 overflow-hidden"
        >
          <div className="flex items-center">
            <span>{highlightSearchTerm(quote.quoteId.slice(0, 8) + '...', searchQuery)}</span>
            <button
              onClick={(e) => onCopyQuoteId(quote.quoteId, e)}
              className={cn(
                'opacity-0 group-hover:opacity-100 transition-opacity',
                'p-1 rounded hover:bg-[var(--color-bg-secondary)]',
                'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                'flex-shrink-0'
              )}
              title="Copy quote ID"
            >
              {copiedQuoteId === quote.quoteId ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] flex-1 min-w-0 overflow-hidden">
          {quote.tripName ? highlightSearchTerm(quote.tripName, searchQuery) : '-'}
        </td>
        <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_8%]">
          {getTripTypeLabel(quote.tripType)}
        </td>
        <td className="px-4 py-3 flex-[0_0_10%]">
          <StatusBadge status={quote.status} />
        </td>
        <td className="px-4 py-3 text-sm flex-[0_0_20%] min-w-0 overflow-hidden">
          <div className="flex flex-col">
            <span className="text-[var(--color-text-primary)] font-medium">
              {highlightSearchTerm(quote.user.fullName, searchQuery)}
            </span>
            <span className="text-[var(--color-text-secondary)] text-xs mt-0.5 break-all">
              {highlightSearchTerm(quote.user.email, searchQuery)}
            </span>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] font-medium flex-[0_0_12%]">
          {formatPrice(quote.totalPrice)}
        </td>
        <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_12%] relative">
          {formatDate(quote.createdAt)}
          {unreadCount > 0 && (
            <div className="absolute top-2 right-2 z-50">
              <div className="relative flex items-center justify-center">
                {/* <div className="absolute w-3 h-3 bg-red-500 rounded-full z-50 animate-ping opacity-75"></div> */}
                <div className="absolute w-3 h-3 bg-red-500 rounded-full z-50"></div>
              </div>
            </div>
          )}
        </td>
      </tr>
    </>
  );
};


