import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { Pagination } from '../common/ui/pagination';
import { FilterSection } from '../common/filters/filter_section';
import type { AdminQuoteListItem } from '../../types/quotes/admin_quote';
import { QuoteStatus } from '../../types/quotes/quote';
import type { QuoteStatusType } from '../../types/quotes/quote';
import { cn } from '../../utils/cn';
import { highlightSearchTerm } from '../../utils/highlight_search';
import { useSearchContext } from '../../hooks/use_search_context';
import { ROUTES } from '../../constants/routes';
import { useAdminQuoteDetails } from '../../hooks/quotes/use_admin_quote_details';
import { useUpdateQuoteStatus } from '../../hooks/quotes/use_update_quote_status';

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
  quoteId,
}) => {
  const { searchQuery } = useSearchContext();
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Quote details state
  const { quoteDetails, isLoading: isLoadingDetails, error: detailsError, refetch } = useAdminQuoteDetails(quoteId || '');
  const { updateStatus, isLoading: isUpdatingStatus } = useUpdateQuoteStatus();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basicInfo: false,
    itinerary: false,
    vehicles: false,
    amenities: false,
    pricing: false,
    route: false,
  });

  // Toggle accordion section
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  // Get available status options based on current status
  const getAvailableStatuses = (): Array<{ value: 'paid' | 'submitted'; label: string }> => {
    if (!quoteDetails) return [];

    const currentStatus = quoteDetails.status;

    // Can only change between PAID and SUBMITTED
    if (currentStatus === QuoteStatus.PAID) {
      return [{ value: 'submitted', label: 'Submitted' }];
    } else if (currentStatus === QuoteStatus.SUBMITTED) {
      return [{ value: 'paid', label: 'Paid' }];
    }

    return [];
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to previous page (maintains state)
  };

  // Get trip type label
  const getTripTypeLabel = (tripType: string): string => {
    return tripType === 'one_way' ? 'One Way' : 'Two Way';
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

    const availableStatuses = getAvailableStatuses();

    return (
      <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
        {/* Header with Back Button and Status Control */}
        <div className="flex-shrink-0 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
                title="Back to quotes"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">Quote Details</p>
                <p className="text-xs text-[var(--color-text-secondary)] font-mono">
                  {quoteDetails.quoteId}
                </p>
              </div>
            </div>

            {/* Status Update Control */}
            {availableStatuses.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-text-secondary)]">Status:</span>
                <select
                  value={quoteDetails.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as 'paid' | 'submitted';
                    if (newStatus === 'paid' || newStatus === 'submitted') {
                      handleStatusChange(newStatus);
                    }
                  }}
                  disabled={isUpdatingStatus}
                  className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value={quoteDetails.status}>
                    {quoteDetails.status.charAt(0).toUpperCase() + quoteDetails.status.slice(1)}
                  </option>
                  {availableStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content Area with Accordions */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
          {/* Basic Information Accordion */}
          <FilterSection
            title="Basic Information"
            isExpanded={expandedSections.basicInfo}
            onToggle={() => toggleSection('basicInfo')}
          >
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-[var(--color-text-secondary)]">Trip Name:</span>
                <span className="ml-2 text-[var(--color-text-primary)]">
                  {quoteDetails.tripName || '-'}
                </span>
              </div>
              <div>
                <span className="font-medium text-[var(--color-text-secondary)]">Trip Type:</span>
                <span className="ml-2 text-[var(--color-text-primary)]">
                  {quoteDetails.tripType === 'one_way' ? 'One Way' : 'Two Way'}
                </span>
              </div>
              <div>
                <span className="font-medium text-[var(--color-text-secondary)]">Event Type:</span>
                <span className="ml-2 text-[var(--color-text-primary)]">
                  {quoteDetails.eventType || '-'}
                </span>
              </div>
              {quoteDetails.customEventType && (
                <div>
                  <span className="font-medium text-[var(--color-text-secondary)]">Custom Event Type:</span>
                  <span className="ml-2 text-[var(--color-text-primary)]">
                    {quoteDetails.customEventType}
                  </span>
                </div>
              )}
              <div>
                <span className="font-medium text-[var(--color-text-secondary)]">Passenger Count:</span>
                <span className="ml-2 text-[var(--color-text-primary)]">
                  {quoteDetails.passengerCount}
                </span>
              </div>
              <div>
                <span className="font-medium text-[var(--color-text-secondary)]">Current Step:</span>
                <span className="ml-2 text-[var(--color-text-primary)]">
                  {quoteDetails.currentStep} / 5
                </span>
              </div>
            </div>
          </FilterSection>

          {/* Itinerary Accordion */}
          <FilterSection
            title="Itinerary"
            isExpanded={expandedSections.itinerary}
            onToggle={() => toggleSection('itinerary')}
          >
            <div className="text-sm text-[var(--color-text-secondary)]">
              Itinerary details will be displayed here
            </div>
          </FilterSection>

          {/* Vehicles Accordion */}
          <FilterSection
            title="Selected Vehicles"
            isExpanded={expandedSections.vehicles}
            onToggle={() => toggleSection('vehicles')}
          >
            <div className="text-sm text-[var(--color-text-secondary)]">
              Vehicle details will be displayed here
            </div>
          </FilterSection>

          {/* Amenities Accordion */}
          <FilterSection
            title="Selected Amenities"
            isExpanded={expandedSections.amenities}
            onToggle={() => toggleSection('amenities')}
          >
            <div className="text-sm text-[var(--color-text-secondary)]">
              Amenity details will be displayed here
            </div>
          </FilterSection>

          {/* Pricing Accordion */}
          <FilterSection
            title="Pricing Breakdown"
            isExpanded={expandedSections.pricing}
            onToggle={() => toggleSection('pricing')}
          >
            <div className="text-sm text-[var(--color-text-secondary)]">
              Pricing details will be displayed here
            </div>
          </FilterSection>

          {/* Route Data Accordion */}
          <FilterSection
            title="Route Information"
            isExpanded={expandedSections.route}
            onToggle={() => toggleSection('route')}
          >
            <div className="text-sm text-[var(--color-text-secondary)]">
              Route details will be displayed here
            </div>
          </FilterSection>
        </div>
      </div>
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
        <div className="flex-1 flex flex-col min-h-0 overflow-auto">
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
                  <tr
                    key={quote.quoteId}
                    className="flex hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
                    onClick={() => navigate(ROUTES.admin.quoteDetails(quote.quoteId))}
                  >
                    <td 
                      className="px-4 py-3 text-sm text-[var(--color-text-primary)] font-mono flex-[0_0_12%] relative group"
                    >
                      <div className="flex items-center">
                        <span>{highlightSearchTerm(quote.quoteId.slice(0, 8) + '...', searchQuery)}</span>
                        <button
                          onClick={(e) => handleCopyQuoteId(quote.quoteId, e)}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden flex-1 overflow-y-auto space-y-3">
        {quotes.map((quote) => (
          <div
            key={quote.quoteId}
            className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 cursor-pointer hover:bg-[var(--color-bg-secondary)] transition-colors"
            onClick={() => navigate(ROUTES.admin.quoteDetails(quote.quoteId))}
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
                <div className="flex items-center">
                  <p className="text-xs text-[var(--color-text-secondary)] font-mono">
                    ID: {highlightSearchTerm(quote.quoteId.slice(0, 8) + '...', searchQuery)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyQuoteId(quote.quoteId, e);
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

