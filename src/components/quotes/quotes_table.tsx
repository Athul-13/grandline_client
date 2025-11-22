import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/button';
import { Pagination } from '../common/pagination';
import { ConfirmationModal } from '../common/confirmation_modal';
import { quoteService } from '../../services/api/quote_service';
import toast from 'react-hot-toast';
import type { QuoteListItem, QuoteStatusType } from '../../types/quotes/quote';
import { QuoteStatus } from '../../types/quotes/quote';
import { cn } from '../../utils/cn';
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
  const [selectedQuotes, setSelectedQuotes] = useState<Set<string>>(new Set());
  const [isBulkSelected, setIsBulkSelected] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Handle individual checkbox toggle
  const handleRowSelect = (quoteId: string) => {
    setSelectedQuotes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(quoteId)) {
        newSet.delete(quoteId);
      } else {
        newSet.add(quoteId);
      }
      return newSet;
    });
    setIsBulkSelected(false);
  };

  // Handle bulk select checkbox
  const handleBulkSelect = () => {
    if (isBulkSelected) {
      setSelectedQuotes(new Set());
      setIsBulkSelected(false);
    } else {
      const allIds = new Set(quotes.map((q) => q.quoteId));
      setSelectedQuotes(allIds);
      setIsBulkSelected(true);
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
      setIsBulkSelected(false);
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

  // Show actions bar if any quotes are selected
  const showActions = selectedQuotes.size > 0;

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
      {/* Actions Bar - Shows when quotes are selected */}
      {showActions && (
        <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
            {selectedQuotes.size} {selectedQuotes.size === 1 ? 'quote' : 'quotes'} selected
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {selectedQuotes.size === 1 && !isBulkSelected && (
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 flex-1 sm:flex-initial"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            )}
            <Button
              onClick={handleDeleteClick}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300 flex-1 sm:flex-initial"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block flex-1 overflow-auto bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
        <table className="w-full">
          <thead className="bg-[var(--color-bg-secondary)] sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleBulkSelect}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
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
                Created Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                Start Location
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                End Location
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {quotes.map((quote) => (
              <tr
                key={quote.quoteId}
                className={cn(
                  'hover:bg-[var(--color-bg-secondary)] transition-colors',
                  selectedQuotes.has(quote.quoteId) && 'bg-blue-50 dark:bg-blue-900/20'
                )}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedQuotes.has(quote.quoteId)}
                    onChange={() => handleRowSelect(quote.quoteId)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden flex-1 overflow-y-auto space-y-3">
        {quotes.map((quote) => (
          <div
            key={quote.quoteId}
            className={cn(
              'bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4',
              selectedQuotes.has(quote.quoteId) && 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedQuotes.has(quote.quoteId)}
                  onChange={() => handleRowSelect(quote.quoteId)}
                  className="w-4 h-4 mt-1 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0"
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
        ))}
      </div>

      {/* Mobile Bulk Select Checkbox */}
      <div className="md:hidden mb-3 p-3 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] flex items-center gap-3">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={handleBulkSelect}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <span className="text-sm text-[var(--color-text-secondary)]">
          Select all quotes on this page
        </span>
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

