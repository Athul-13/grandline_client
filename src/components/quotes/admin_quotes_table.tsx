import { Pagination } from '../common/pagination';
import type { AdminQuoteListItem } from '../../types/quotes/admin_quote';
import { QuoteStatus } from '../../types/quotes/quote';
import type { QuoteStatusType } from '../../types/quotes/quote';
import { cn } from '../../utils/cn';
import { highlightSearchTerm } from '../../utils/highlight_search';
import { useSearchContext } from '../../hooks/use_search_context';

interface AdminQuotesTableProps {
  quotes: AdminQuoteListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  showPaginationOnly?: boolean;
}

/**
 * Status Badge Component
 */
const StatusBadge: React.FC<{ status: QuoteStatusType }> = ({ status }) => {
  const getStatusColor = (status: QuoteStatusType): string => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case QuoteStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case QuoteStatus.NEGOTIATING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case QuoteStatus.ACCEPTED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case QuoteStatus.REJECTED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case QuoteStatus.PAID:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: QuoteStatusType): string => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        getStatusColor(status)
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
};

/**
 * Admin Quotes Table Component
 * Displays admin quotes in a table with pagination (no actions, no bulk selection)
 */
export const AdminQuotesTable: React.FC<AdminQuotesTableProps> = ({
  quotes,
  pagination,
  isLoading,
  onPageChange,
  showPaginationOnly = false,
}) => {
  const { searchQuery } = useSearchContext();

  // Get trip type label
  const getTripTypeLabel = (tripType: string): string => {
    return tripType === 'one_way' ? 'One Way' : 'Two Way';
  };

  // Format date
  const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format price
  const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined || typeof price !== 'number') return '-';
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // If only showing pagination
  if (showPaginationOnly) {
    return (
      <Pagination
        currentPage={pagination?.page || 1}
        totalPages={pagination?.totalPages || 1}
        onPageChange={onPageChange}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  // Empty state
  if (!isLoading && quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
          No quotes found
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          There are no quotes to display at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
        <div className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--color-bg-secondary)]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                  Quote ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                  Trip Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                  Total Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                  Created Date
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          <table className="w-full">
            <tbody className="divide-y divide-[var(--color-border)]">
              {quotes.map((quote) => (
                <tr
                  key={quote.quoteId}
                  className="hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] font-mono">
                    {highlightSearchTerm(quote.quoteId.slice(0, 8) + '...', searchQuery)}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
                    {quote.tripName ? highlightSearchTerm(quote.tripName, searchQuery) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {getTripTypeLabel(quote.tripType)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={quote.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
                    {highlightSearchTerm(quote.user.fullName, searchQuery)}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {highlightSearchTerm(quote.user.email, searchQuery)}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] font-medium">
                    {formatPrice(quote.totalPrice)}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {formatDate(quote.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden flex-1 overflow-y-auto space-y-3">
        {quotes.map((quote) => (
          <div
            key={quote.quoteId}
            className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
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
                <p className="text-xs text-[var(--color-text-secondary)] font-mono">
                  ID: {highlightSearchTerm(quote.quoteId.slice(0, 8) + '...', searchQuery)}
                </p>
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
        ))}
      </div>

    </div>
  );
};

