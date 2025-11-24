import { cn } from '../../utils/cn';
import { StatusBadge } from './quote_status_badge';
import { formatDate, getTripTypeLabel } from '../../utils/quote_formatters';
import type { QuoteListItem } from '../../types/quotes/quote';

interface QuotesCardProps {
  quote: QuoteListItem;
  isSelected: boolean;
  onSelectChange: (isSelected: boolean) => void;
  onCardClick?: () => void;
}

/**
 * Quotes Card Component
 * Displays a single quote card in the mobile view
 */
export const QuotesCard: React.FC<QuotesCardProps> = ({
  quote,
  isSelected,
  onSelectChange,
  onCardClick,
}) => {
  return (
    <div
      className={cn(
        'bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4',
        isSelected && 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20',
        onCardClick && 'cursor-pointer hover:bg-[var(--color-bg-secondary)] transition-colors'
      )}
      onClick={onCardClick}
    >
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
            className="w-4 h-4 mt-1 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0 cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-[var(--color-text-primary)] truncate">
              {quote.tripName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={quote.status} />
              <span className="text-xs text-[var(--color-text-secondary)]">
                {getTripTypeLabel(quote.tripType)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-start justify-between">
          <span className="text-[var(--color-text-secondary)]">Created:</span>
          <span className="text-[var(--color-text-primary)] font-medium">
            {formatDate(quote.createdAt)}
          </span>
        </div>
        {quote.startLocation && (
          <div className="flex items-start justify-between">
            <span className="text-[var(--color-text-secondary)]">From:</span>
            <span className="text-[var(--color-text-primary)] text-right flex-1 ml-2">
              {quote.startLocation}
            </span>
          </div>
        )}
        {quote.endLocation && (
          <div className="flex items-start justify-between">
            <span className="text-[var(--color-text-secondary)]">To:</span>
            <span className="text-[var(--color-text-primary)] text-right flex-1 ml-2">
              {quote.endLocation}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

