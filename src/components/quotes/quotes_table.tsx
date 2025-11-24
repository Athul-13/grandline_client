import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../common/ui/button';
import { Pagination } from '../common/ui/pagination';
import { ConfirmationModal } from '../common/modals/confirmation_modal';
import { quoteService } from '../../services/api/quote_service';
import toast from 'react-hot-toast';
import type { QuoteListItem } from '../../types/quotes/quote';
import { QuoteStatus } from '../../types/quotes/quote';
import { QuotesTableRow } from './quotes_table_row';
import { QuotesCard } from './quotes_card';
import { QuotesTableActionHeader } from './quotes_table_action_header';
import { UserQuoteDetailsView } from './user_quote_details_view';
import { useQuoteDetails } from '../../hooks/quotes/use_quote_details';
import { Edit, Trash2 } from 'lucide-react';

interface QuotesTableProps {
  quotes: QuoteListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onDeleteSuccess: () => void;
}


/**
 * Quotes Table Component
 */
export const QuotesTable: React.FC<QuotesTableProps> = ({
  quotes,
  pagination,
  isLoading,
  onPageChange,
  onDeleteSuccess,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const quoteId = searchParams.get('quoteId') || undefined;
  const [selectedQuotes, setSelectedQuotes] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch quote details if quoteId is provided
  const { quoteDetails, isLoading: isLoadingDetails, error: detailsError } = useQuoteDetails(quoteId || '');

  // Check if quote status allows clicking
  const isClickableStatus = (status: string): boolean => {
    const clickableStatuses: string[] = [QuoteStatus.SUBMITTED, QuoteStatus.NEGOTIATING, QuoteStatus.ACCEPTED, QuoteStatus.PAID];
    return clickableStatuses.includes(status);
  };

  // Handle row/card click
  const handleQuoteClick = (quote: QuoteListItem) => {
    if (isClickableStatus(quote.status)) {
      setSearchParams({ quoteId: quote.quoteId });
    }
  };

  // Handle back from details view
  const handleBack = () => {
    setSearchParams({});
  };

  // Handle edit from details view
  const handleDetailsEdit = () => {
    if (quoteId) {
      navigate(`/build-quote?quoteId=${quoteId}`);
    }
  };

  // Handle delete from details view
  const handleDetailsDelete = () => {
    setShowDeleteModal(true);
  };

  // Handle delete confirmation from details view
  const handleDetailsDeleteConfirm = async () => {
    if (!quoteId) return;

    setIsDeleting(true);
    try {
      await quoteService.deleteQuote(quoteId);
      toast.success('Quote deleted successfully');
      setSearchParams({});
      onDeleteSuccess();
    } catch (error) {
      console.error('Failed to delete quote:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete quote'
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Handle bulk select checkbox
  const handleBulkSelect = (isSelected: boolean) => {
    if (isSelected) {
      const allIds = new Set(quotes.map((q) => q.quoteId));
      setSelectedQuotes(allIds);
    } else {
      setSelectedQuotes(new Set());
    }
  };

  // Handle edit action
  const handleEdit = () => {
    if (selectedQuotes.size === 1) {
      const quoteId = Array.from(selectedQuotes)[0];
      navigate(`/build-quote?quoteId=${quoteId}`);
    }
  };

  // Handle delete action
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedQuotes.size === 0) return;

    setIsDeleting(true);
    try {
      const deletePromises = Array.from(selectedQuotes).map((quoteId) =>
        quoteService.deleteQuote(quoteId)
      );
      await Promise.all(deletePromises);

      toast.success(
        selectedQuotes.size === 1
          ? 'Quote deleted successfully'
          : `${selectedQuotes.size} quotes deleted successfully`
      );

      setSelectedQuotes(new Set());
      setShowDeleteModal(false);
      onDeleteSuccess();
    } catch (error) {
      console.error('Failed to delete quotes:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete quotes'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if all quotes on current page are selected
  const allSelected = useMemo(() => {
    return quotes.length > 0 && quotes.every((q) => selectedQuotes.has(q.quoteId));
  }, [quotes, selectedQuotes]);

  // Handle deselect all
  const handleDeselectAll = () => {
    setSelectedQuotes(new Set());
  };

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
      <>
        <UserQuoteDetailsView
          quoteDetails={quoteDetails}
          onBack={handleBack}
          onEdit={handleDetailsEdit}
          onDelete={handleDetailsDelete}
        />
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDetailsDeleteConfirm}
          title="Delete Quote"
          message="Are you sure you want to delete this quote? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={isDeleting}
        />
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--color-text-secondary)]">Loading quotes...</p>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--color-text-secondary)]">No quotes found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:flex flex-1 flex-col min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          {selectedQuotes.size > 0 ? (
            // Action header when selection exists
            <QuotesTableActionHeader
              selectedCount={selectedQuotes.size}
              allSelected={allSelected}
              onSelectAll={handleBulkSelect}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onDeselectAll={handleDeselectAll}
            />
          ) : (
            // Normal header
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left h-[48px]">
                    <input
                      type="checkbox"
                      checked={allSelected && quotes.length > 0}
                      onChange={(e) => handleBulkSelect(e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] h-[48px]">
                    Trip Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] h-[48px]">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] h-[48px]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] h-[48px]">
                    Created Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] h-[48px]">
                    Start Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] h-[48px]">
                    End Location
                  </th>
                </tr>
              </thead>
            </table>
          )}
        </div>
        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full">
            <tbody className="divide-y divide-[var(--color-border)]">
              {quotes.map((quote) => {
                const isClickable = isClickableStatus(quote.status);
                return (
                  <QuotesTableRow
                    key={quote.quoteId}
                    quote={quote}
                    isSelected={selectedQuotes.has(quote.quoteId)}
                    onSelectChange={(isSelected) => {
                      if (isSelected) {
                        setSelectedQuotes((prev) => new Set([...prev, quote.quoteId]));
                      } else {
                        setSelectedQuotes((prev) => {
                          const newSet = new Set(prev);
                          newSet.delete(quote.quoteId);
                          return newSet;
                        });
                      }
                    }}
                    onRowClick={isClickable ? () => handleQuoteClick(quote) : undefined}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden flex-1 overflow-y-auto space-y-3">
        {/* Mobile action bar when selection exists */}
        {selectedQuotes.size > 0 && (
          <div className="sticky top-0 z-10 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-3 mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {selectedQuotes.size} selected
            </span>
            <div className="flex items-center gap-2">
              {selectedQuotes.size === 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteClick}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete
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
        {quotes.map((quote) => {
          const isClickable = isClickableStatus(quote.status);
          return (
            <QuotesCard
              key={quote.quoteId}
              quote={quote}
              isSelected={selectedQuotes.has(quote.quoteId)}
              onSelectChange={(isSelected) => {
                if (isSelected) {
                  setSelectedQuotes((prev) => new Set([...prev, quote.quoteId]));
                } else {
                  setSelectedQuotes((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(quote.quoteId);
                    return newSet;
                  });
                }
              }}
              onCardClick={isClickable ? () => handleQuoteClick(quote) : undefined}
            />
          );
        })}
      </div>


      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-3 sm:mt-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Quote(s)"
        message={
          selectedQuotes.size === 1
            ? 'Are you sure you want to delete this quote? This action cannot be undone.'
            : `Are you sure you want to delete ${selectedQuotes.size} quotes? This action cannot be undone.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

