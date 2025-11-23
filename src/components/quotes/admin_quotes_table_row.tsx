import { Copy, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { highlightSearchTerm } from '../../utils/highlight_search';
import { formatDate, formatPrice, getTripTypeLabel } from '../../utils/quote_formatters';
import { StatusBadge } from './quote_status_badge';
import type { AdminQuoteListItem } from '../../types/quotes/admin_quote';

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
  return (
    <tr
      className={cn(
        "flex hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer",
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
        className="px-4 py-3 text-sm text-[var(--color-text-primary)] font-mono flex-[0_0_12%] relative group"
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
      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] flex-[0_0_15%]">
        {quote.tripName ? highlightSearchTerm(quote.tripName, searchQuery) : '-'}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_8%]">
        {getTripTypeLabel(quote.tripType)}
      </td>
      <td className="px-4 py-3 flex-[0_0_10%]">
        <StatusBadge status={quote.status} />
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] flex-[0_0_15%]">
        {highlightSearchTerm(quote.user.fullName, searchQuery)}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_18%]">
        {highlightSearchTerm(quote.user.email, searchQuery)}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] font-medium flex-[0_0_12%]">
        {formatPrice(quote.totalPrice)}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] flex-[0_0_10%]">
        {formatDate(quote.createdAt)}
      </td>
    </tr>
  );
};

