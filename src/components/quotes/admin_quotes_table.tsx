import { useState, useEffect, useCallback, useRef } from 'react';
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
import { ConfirmationModal } from '../common/modals/confirmation_modal';
import { Button } from '../common/ui/button';
import { TableSkeleton, QuoteDetailsSkeleton } from '../common/ui/loaders';
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
const SELECTED_QUOTES_STORAGE_KEY = 'admin_quotes_selected';

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
  
  // Refs for syncing horizontal scroll
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  
  // Selection state with persistence
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<Set<string>>(new Set());
  const [showStatusConfirmModal, setShowStatusConfirmModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ quoteId: string; newStatus: 'paid' | 'submitted'; currentStatus: string } | null>(null);
  
  // Sync horizontal scrolling between header and body
  const handleBodyScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  }, []);

  const handleHeaderScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (bodyScrollRef.current) {
      bodyScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  }, []);
  
  // Load selected quotes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SELECTED_QUOTES_STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        setSelectedQuoteIds(new Set(ids));
      }
    } catch (error) {
      console.error('Failed to load selected quotes from localStorage:', error);
    }
  }, []);

  // Save selected quotes to localStorage whenever selection changes
  useEffect(() => {
    try {
      if (selectedQuoteIds.size > 0) {
        localStorage.setItem(SELECTED_QUOTES_STORAGE_KEY, JSON.stringify(Array.from(selectedQuoteIds)));
      } else {
        localStorage.removeItem(SELECTED_QUOTES_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save selected quotes to localStorage:', error);
    }
  }, [selectedQuoteIds]);
  
  // Quote details state
  const { quoteDetails, isLoading: isLoadingDetails, error: detailsError, refetch } = useAdminQuoteDetails(quoteId || '');
  const { updateStatus, isLoading: isUpdatingStatus } = useUpdateQuoteStatus();

  // Handle status update with confirmation
  const handleStatusChange = async (newStatus: 'paid' | 'submitted') => {
    if (!quoteId || !quoteDetails) return;

    // Show confirmation modal
    setPendingStatusChange({
      quoteId,
      newStatus,
      currentStatus: quoteDetails.status,
    });
    setShowStatusConfirmModal(true);
  };

  // Confirm status update
  const handleConfirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    const result = await updateStatus(pendingStatusChange.quoteId, { status: pendingStatusChange.newStatus });

    if (result) {
      toast.success(`Quote status updated to ${pendingStatusChange.newStatus}`);
      await refetch();
    } else {
      toast.error('Failed to update quote status');
    }

    setShowStatusConfirmModal(false);
    setPendingStatusChange(null);
  };

  // Selection handlers
  const handleSelectQuote = useCallback((quoteId: string, isSelected: boolean) => {
    setSelectedQuoteIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(quoteId);
      } else {
        newSet.delete(quoteId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((isSelected: boolean) => {
    if (isSelected) {
      const allIds = new Set(quotes.map((q) => q.quoteId));
      setSelectedQuoteIds(allIds);
    } else {
      setSelectedQuoteIds(new Set());
    }
  }, [quotes]);

  const handleDeselectAll = useCallback(() => {
    setSelectedQuoteIds(new Set());
  }, []);

  // Check if all quotes on current page are selected
  const allSelected = quotes.length > 0 && quotes.every((q) => selectedQuoteIds.has(q.quoteId));

  // Handle recalculate (placeholder)
  const handleRecalculate = () => {
    toast.success(`Recalculating ${selectedQuoteIds.size} quote(s)... (Placeholder)`);
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
      return <QuoteDetailsSkeleton variant="admin" />;
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
        onRefetch={refetch}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <TableSkeleton
        hasCheckbox
        isTableFixed
        minWidth="800px"
        columns={[
          { width: '12%' },
          { width: '15%' },
          { width: '8%' },
          { width: '10%' },
          { width: '20%' },
          { width: '12%' },
          { width: '12%' },
        ]}
        rowCount={5}
      />
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
    <>
      <div className="flex flex-col h-full min-h-0">
        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden md:flex flex-1 flex-col min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] overflow-hidden">
          {/* Fixed Header */}
          <div 
            ref={headerScrollRef}
            className="flex-shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-x-auto overflow-y-hidden hide-scrollbar"
            onScroll={handleHeaderScroll}
          >
            <div className="min-w-[800px]">
              {selectedQuoteIds.size > 0 ? (
                // Action buttons header when selection exists
                <div className="flex items-center px-4 py-3 h-[48px]">
                  <div className="flex-[0_0_40px]">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {selectedQuoteIds.size} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRecalculate}
                      className="text-sm"
                    >
                      Recalculate
                    </Button>
                    <button
                      onClick={handleDeselectAll}
                      className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      Deselect all
                    </button>
                  </div>
                </div>
              ) : (
                // Normal header
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="flex h-[48px]">
                      <th className="px-4 py-3 flex-[0_0_40px] flex items-center">
                        <input
                          type="checkbox"
                          checked={allSelected && quotes.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_12%] whitespace-nowrap flex items-center">
                        Quote ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex-1 whitespace-nowrap flex items-center">
                        Trip Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_8%] whitespace-nowrap flex items-center">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_10%] whitespace-nowrap flex items-center">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_20%] whitespace-nowrap flex items-center">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_12%] whitespace-nowrap flex items-center">
                        Total Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_12%] whitespace-nowrap flex items-center">
                        Created Date
                      </th>
                    </tr>
                  </thead>
                </table>
              )}
            </div>
          </div>
          {/* Scrollable Body */}
          <div 
            ref={bodyScrollRef}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-auto overscroll-none"
            onScroll={handleBodyScroll}
          >
            <table className="w-full table-fixed min-w-[800px]">
              <tbody className="block">
                {quotes.map((quote) => (
                  <AdminQuotesTableRow
                    key={quote.quoteId}
                    quote={quote}
                    searchQuery={searchQuery}
                    copiedQuoteId={copiedQuoteId}
                    onCopyQuoteId={handleCopyQuoteId}
                    isSelected={selectedQuoteIds.has(quote.quoteId)}
                    onSelectChange={(isSelected) => handleSelectQuote(quote.quoteId, isSelected)}
                    onRowClick={() => navigate(ROUTES.admin.quoteDetails(quote.quoteId))}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View - Visible only on mobile */}
        <div className="md:hidden flex-1 overflow-y-auto space-y-3">
          {/* Mobile action bar when selection exists */}
          {selectedQuoteIds.size > 0 && (
            <div className="sticky top-0 z-10 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-3 mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {selectedQuoteIds.size} selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRecalculate}
                >
                  Recalculate
                </Button>
                <button
                  onClick={handleDeselectAll}
                  className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-2 py-1"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
          {quotes.map((quote) => (
            <AdminQuotesCard
              key={quote.quoteId}
              quote={quote}
              searchQuery={searchQuery}
              copiedQuoteId={copiedQuoteId}
              onCopyQuoteId={handleCopyQuoteId}
              isSelected={selectedQuoteIds.has(quote.quoteId)}
              onSelectChange={(isSelected) => handleSelectQuote(quote.quoteId, isSelected)}
              onCardClick={() => navigate(ROUTES.admin.quoteDetails(quote.quoteId))}
            />
          ))}
        </div>
      </div>

      {/* Status Update Confirmation Modal */}
      <ConfirmationModal
        isOpen={showStatusConfirmModal}
        onClose={() => {
          setShowStatusConfirmModal(false);
          setPendingStatusChange(null);
        }}
        onConfirm={handleConfirmStatusChange}
        title="Update Quote Status"
        message={`Are you sure you want to change the quote status from "${pendingStatusChange?.currentStatus}" to "${pendingStatusChange?.newStatus}"?`}
        confirmText="Update Status"
        cancelText="Cancel"
        isLoading={isUpdatingStatus}
        variant="info"
      />
    </>
  );
};
