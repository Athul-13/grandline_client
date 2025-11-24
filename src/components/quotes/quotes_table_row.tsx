import { cn } from '../../utils/cn';
import { StatusBadge } from './quote_status_badge';
import { formatDate, getTripTypeLabel } from '../../utils/quote_formatters';
import type { QuoteListItem } from '../../types/quotes/quote';

interface QuotesTableRowProps {
  quote: QuoteListItem;
  isSelected: boolean;
  onSelectChange: (isSelected: boolean) => void;
  onRowClick?: () => void;
}

/**
 * Quotes Table Row Component
 * Displays a single quote row in the desktop table view
 */
export const QuotesTableRow: React.FC<QuotesTableRowProps> = ({
  quote,
  isSelected,
  onSelectChange,
  onRowClick,
}) => {
  return (
    <tr
      className={cn(
        'hover:bg-[var(--color-bg-secondary)] transition-colors',
        isSelected && 'bg-blue-50 dark:bg-blue-900/20',
        onRowClick && 'cursor-pointer'
      )}
      onClick={onRowClick}
    >
      <td
        className="px-4 py-3"
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
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
        />
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
        {quote.tripName}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
        {getTripTypeLabel(quote.tripType)}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={quote.status} />
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
        {formatDate(quote.createdAt)}
      </td>
      <td
        className="px-4 py-3 text-sm text-[var(--color-text-secondary)] max-w-[200px] truncate"
        title={quote.startLocation || undefined}
      >
        {quote.startLocation || '-'}
      </td>
      <td
        className="px-4 py-3 text-sm text-[var(--color-text-secondary)] max-w-[200px] truncate"
        title={quote.endLocation || undefined}
      >
        {quote.endLocation || '-'}
      </td>
    </tr>
  );
};

