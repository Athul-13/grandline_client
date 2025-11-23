import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pagination } from '../common/ui/pagination';
import { AdminQuoteDetailsView } from './admin_quote_details_view';
import { AdminQuotesTableRow } from './admin_quotes_table_row';
import { AdminQuotesCard } from './admin_quotes_card';
import { useAdminQuoteDetails } from '../../hooks/quotes/use_admin_quote_details';
import { useUpdateQuoteStatus } from '../../hooks/quotes/use_update_quote_status';
import { ROUTES } from '../../constants/routes';
import { useSearchContext } from '../../hooks/use_search_context';
import type { AdminQuoteListItem } from '../../types/quotes/admin_quote';

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
  quoteId?: string; // When provided, show quote details instead of table
}

/**
 * Admin Quotes Table Component
 * Displays admin quotes in a table with pagination and quote details view
 */
export const AdminQuotesTable: React.FC<AdminQuotesTableProps> = ({
  quotes,
  pagination,
  isLoading,
  onPageChange,
  showPaginationOnly = false,
  quoteId,
}) => {
  const { searchQuery } = useSearchContext();
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Quote details state
  const { quoteDetails, isLoading: isLoadingDetails, error: detailsError, refetch } = useAdminQuoteDetails(quoteId || '');
  const { updateStatus, isLoading: isUpdatingStatus } = useUpdateQuoteStatus();

  // Handle status update
  const handleStatusChange = async (newStatus: 'paid' | 'submitted') => {
    if (!quoteId || !quoteDetails) return;

    const result = await updateStatus(quoteId, { status: newStatus });

    if (result) {
      toast.success(`Quote status updated to ${newStatus}`);
      await refetch();
    } else {
      toast.error('Failed to update quote status');
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to previous page (maintains state)
  };

  // Copy quote ID to clipboard
  const handleCopyQuoteId = async (quoteIdToCopy: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(quoteIdToCopy);
      setCopiedQuoteId(quoteIdToCopy);
      toast.success('Quote ID copied to clipboard');
      setTimeout(() => setCopiedQuoteId(null), 2000);
    } catch {
      toast.error('Failed to copy quote ID');
    }
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

  // Quote Details View
  if (quoteId) {
    if (isLoadingDetails) {
      return (
        <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        </div>
      );
    }

    if (detailsError || !quoteDetails) {
      return (
        <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <p className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Error</p>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              {detailsError || 'Quote not found'}
            </p>
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return (
      <AdminQuoteDetailsView
        quoteDetails={quoteDetails}
        isUpdatingStatus={isUpdatingStatus}
        onBack={handleBack}
        onStatusChange={handleStatusChange}
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
      <div className="hidden md:flex flex-1 flex-col min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
        {/* Scrollable container for both header and body */}
        <div className="flex-1 flex flex-col min-h-0 overflow-auto overscroll-none">
          <div className="flex-shrink-0">
            <table className="w-full table-fixed min-w-[800px]">
              <thead className="bg-[var(--color-bg-secondary)] block sticky top-0 z-10">
                <tr className="flex">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_12%]">
                    Quote ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_15%]">
                    Trip Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_8%]">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_10%]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_15%]">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_18%]">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_12%]">
                    Total Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_10%]">
                    Created Date
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="flex-1 min-h-0">
            <table className="w-full table-fixed min-w-[800px]">
              <tbody className="block">
                {quotes.map((quote) => (
                  <AdminQuotesTableRow
                    key={quote.quoteId}
                    quote={quote}
                    searchQuery={searchQuery}
                    copiedQuoteId={copiedQuoteId}
                    onCopyQuoteId={handleCopyQuoteId}
                    onRowClick={() => navigate(ROUTES.admin.quoteDetails(quote.quoteId))}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden flex-1 overflow-y-auto space-y-3">
        {quotes.map((quote) => (
          <AdminQuotesCard
            key={quote.quoteId}
            quote={quote}
            searchQuery={searchQuery}
            copiedQuoteId={copiedQuoteId}
            onCopyQuoteId={handleCopyQuoteId}
            onCardClick={() => navigate(ROUTES.admin.quoteDetails(quote.quoteId))}
          />
        ))}
      </div>
    </div>
  );
};
