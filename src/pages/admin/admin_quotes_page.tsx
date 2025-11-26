import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSearchContext } from '../../hooks/use_search_context';
import { AdminQuotesTable } from '../../components/quotes/admin_quotes_table';
import { useAdminQuotesList } from '../../hooks/quotes/use_admin_quotes_list';
import { Pagination } from '../../components/common/ui/pagination';
import { QuoteStatus } from '../../types/quotes/quote';
import { cn } from '../../utils/cn';

const FILTER_STORAGE_KEY = 'admin_quotes_filters';

interface StoredFilters {
  includeDeleted: boolean;
  selectedStatuses: string[];
  sortBy: 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}

export const AdminQuotesPage: React.FC = () => {
  const { id: quoteId } = useParams<{ id?: string }>();
  const { searchQuery } = useSearchContext();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Load filters from localStorage
  const loadFilters = (): StoredFilters => {
    try {
      const stored = localStorage.getItem(FILTER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to load filters from localStorage:', err);
    }
    // Default values
    return {
      includeDeleted: false,
      selectedStatuses: [],
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
  };

  // Save filters to localStorage
  const saveFilters = (filters: StoredFilters) => {
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
    } catch (err) {
      console.error('Failed to save filters to localStorage:', err);
    }
  };

  const [filters, setFilters] = useState<StoredFilters>(loadFilters);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showSortBy, setShowSortBy] = useState(false);
  const [showSortOrder, setShowSortOrder] = useState(false);
  const itemsPerPage = 15;

  // Update filters and persist to localStorage
  const updateFilters = (updates: Partial<StoredFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    saveFilters(newFilters);
  };

  const includeDeleted = filters.includeDeleted;
  const selectedStatuses = filters.selectedStatuses;
  const sortBy = filters.sortBy;
  const sortOrder = filters.sortOrder;

  const { quotes, pagination, isLoading, error } = useAdminQuotesList({
    page: currentPage,
    limit: itemsPerPage,
    includeDeleted,
    search: searchQuery,
    status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
    sortBy,
    sortOrder,
  });

  // Reset pagination to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Toggle status selection
  const toggleStatus = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    updateFilters({ selectedStatuses: newStatuses });
  };

  // Clear all status filters
  const clearStatusFilters = () => {
    updateFilters({ selectedStatuses: [] });
  };

  // Get status label
  const getStatusLabel = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  // Get all available statuses
  const allStatuses = Object.values(QuoteStatus);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const sortByRef = useRef<HTMLDivElement>(null);
  const sortOrderRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setShowStatusFilter(false);
      }
      if (sortByRef.current && !sortByRef.current.contains(event.target as Node)) {
        setShowSortBy(false);
      }
      if (sortOrderRef.current && !sortOrderRef.current.contains(event.target as Node)) {
        setShowSortOrder(false);
      }
    };

    if (showStatusFilter || showSortBy || showSortOrder) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusFilter, showSortBy, showSortOrder]);

  // Get sort by label
  const getSortByLabel = (value: 'createdAt' | 'updatedAt'): string => {
    return value === 'createdAt' ? 'Created Date' : 'Updated Date';
  };

  // Get sort order label
  const getSortOrderLabel = (value: 'asc' | 'desc'): string => {
    return value === 'asc' ? 'Ascending' : 'Descending';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-full overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] relative">
      {/* Main Content */}
      <div className="h-full flex flex-col">
        <div className="h-full flex flex-col px-4 py-3">
          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Include Deleted Toggle */}
              <button
                onClick={() => updateFilters({ includeDeleted: !includeDeleted })}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors',
                  includeDeleted
                    ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                )}
              >
                <input
                  type="checkbox"
                  checked={includeDeleted}
                  onChange={() => {}} // Handled by button onClick
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 cursor-pointer"
                />
                <span>Include Deleted</span>
              </button>

              {/* Status Filter */}
              <div className="relative" ref={statusFilterRef}>
                <button
                  onClick={() => setShowStatusFilter(!showStatusFilter)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors',
                    selectedStatuses.length > 0
                      ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                  )}
                >
                  <span>Status {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}</span>
                  {showStatusFilter ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Status Filter Dropdown */}
                {showStatusFilter && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 p-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[var(--color-text-secondary)]">Filter by Status</span>
                      {selectedStatuses.length > 0 && (
                        <button
                          onClick={clearStatusFilters}
                          className="text-xs text-[var(--color-primary)] hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {allStatuses.map((status) => (
                        <label
                          key={status}
                          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--color-bg-secondary)] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes(status)}
                            onChange={() => toggleStatus(status)}
                            className="w-4 h-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]"
                          />
                          <span className="text-sm text-[var(--color-text-primary)]">
                            {getStatusLabel(status)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sort By */}
              <div className="relative" ref={sortByRef}>
                <button
                  onClick={() => setShowSortBy(!showSortBy)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors',
                    'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                  )}
                >
                  <span>Sort by: {getSortByLabel(sortBy)}</span>
                  {showSortBy ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Sort By Dropdown */}
                {showSortBy && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 p-2">
                    <div className="space-y-1">
                      {(['createdAt', 'updatedAt'] as const).map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            updateFilters({ sortBy: option });
                            setShowSortBy(false);
                          }}
                          className={cn(
                            'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                            sortBy === option
                              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                              : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                          )}
                        >
                          {getSortByLabel(option)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Order */}
              <div className="relative" ref={sortOrderRef}>
                <button
                  onClick={() => setShowSortOrder(!showSortOrder)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors',
                    'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                  )}
                >
                  <span>Order: {getSortOrderLabel(sortOrder)}</span>
                  {showSortOrder ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Sort Order Dropdown */}
                {showSortOrder && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 p-2">
                    <div className="space-y-1">
                      {(['desc', 'asc'] as const).map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            updateFilters({ sortOrder: option });
                            setShowSortOrder(false);
                          }}
                          className={cn(
                            'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                            sortOrder === option
                              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                              : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                          )}
                        >
                          {getSortOrderLabel(option)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
              <p className="text-sm sm:text-base text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Quotes Table */}
          <div className="flex-1 overflow-y-auto">
            <AdminQuotesTable
              quotes={quotes}
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={handlePageChange}
              quoteId={quoteId}
            />
          </div>

          {/* Pagination - Disabled when viewing details */}
          {!quoteId && pagination && pagination.totalPages > 1 && (
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

