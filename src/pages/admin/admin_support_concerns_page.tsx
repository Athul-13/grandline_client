import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSearchContext } from '../../hooks/use_search_context';
import { AdminSupportTable } from '../../components/support/admin/admin_support_table';
import { useAdminTicketsList } from '../../hooks/support/use_admin_tickets_list';
import { TicketStatus, ActorType, type ActorTypeType } from '../../types/support/ticket';
import { cn } from '../../utils/cn';

const FILTER_STORAGE_KEY = 'admin_support_filters';

interface StoredFilters {
  selectedStatuses: string[];
  selectedActorTypes: string[];
  selectedPriorities: string[];
  sortBy: 'createdAt' | 'lastMessageAt';
  sortOrder: 'asc' | 'desc';
}

export const AdminSupportConcernsPage: React.FC = () => {
  const { id: ticketId } = useParams<{ id?: string }>();
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
      selectedStatuses: [],
      selectedActorTypes: [],
      selectedPriorities: [],
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
  const [showActorTypeFilter, setShowActorTypeFilter] = useState(false);
  const [showPriorityFilter, setShowPriorityFilter] = useState(false);
  const [showSortBy, setShowSortBy] = useState(false);
  const [showSortOrder, setShowSortOrder] = useState(false);
  const itemsPerPage = 15;

  // Update filters and persist to localStorage
  const updateFilters = (updates: Partial<StoredFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    saveFilters(newFilters);
  };

  const selectedStatuses = filters.selectedStatuses;
  const selectedActorTypes = filters.selectedActorTypes;
  const selectedPriorities = filters.selectedPriorities;
  const sortBy = filters.sortBy;
  const sortOrder = filters.sortOrder;

  const { data, isLoading } = useAdminTicketsList({
    page: currentPage,
    limit: itemsPerPage,
    status: selectedStatuses.length > 0 ? selectedStatuses[0] : undefined,
    actorType: selectedActorTypes.length > 0 ? (selectedActorTypes[0] as ActorTypeType) : undefined,
    search: searchQuery || undefined,
    sortBy,
    sortOrder,
  });

  const tickets = data?.tickets || [];
  const pagination = data?.pagination || null;

  // Reset pagination to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Toggle status selection
  const toggleStatus = (status: string) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [status]; // Only allow one status at a time
    updateFilters({ selectedStatuses: newStatuses });
  };

  // Toggle actor type selection
  const toggleActorType = (actorType: string) => {
    const newTypes = selectedActorTypes.includes(actorType)
      ? selectedActorTypes.filter((t) => t !== actorType)
      : [actorType]; // Only allow one actor type at a time
    updateFilters({ selectedActorTypes: newTypes });
  };

  // Toggle priority selection
  const togglePriority = (priority: string) => {
    const newPriorities = selectedPriorities.includes(priority)
      ? selectedPriorities.filter((p) => p !== priority)
      : [priority]; // Only allow one priority at a time
    updateFilters({ selectedPriorities: newPriorities });
  };

  // Clear all filters
  const clearAllFilters = () => {
    updateFilters({
      selectedStatuses: [],
      selectedActorTypes: [],
      selectedPriorities: [],
    });
  };

  // Get status label
  const getStatusLabel = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  // Get all available statuses
  const allStatuses = Object.values(TicketStatus);
  const allActorTypes = Object.values(ActorType).filter(t => t !== ActorType.ADMIN);
  const allPriorities = ['low', 'medium', 'high', 'urgent'];
  
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const actorTypeFilterRef = useRef<HTMLDivElement>(null);
  const priorityFilterRef = useRef<HTMLDivElement>(null);
  const sortByRef = useRef<HTMLDivElement>(null);
  const sortOrderRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setShowStatusFilter(false);
      }
      if (actorTypeFilterRef.current && !actorTypeFilterRef.current.contains(event.target as Node)) {
        setShowActorTypeFilter(false);
      }
      if (priorityFilterRef.current && !priorityFilterRef.current.contains(event.target as Node)) {
        setShowPriorityFilter(false);
      }
      if (sortByRef.current && !sortByRef.current.contains(event.target as Node)) {
        setShowSortBy(false);
      }
      if (sortOrderRef.current && !sortOrderRef.current.contains(event.target as Node)) {
        setShowSortOrder(false);
      }
    };

    if (showStatusFilter || showActorTypeFilter || showPriorityFilter || showSortBy || showSortOrder) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusFilter, showActorTypeFilter, showPriorityFilter, showSortBy, showSortOrder]);

  // Get sort by label
  const getSortByLabel = (value: 'createdAt' | 'lastMessageAt'): string => {
    return value === 'createdAt' ? 'Created Date' : 'Last Message';
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
                  <span>Status: {selectedStatuses.length > 0 ? getStatusLabel(selectedStatuses[0]) : 'All'}</span>
                  {showStatusFilter ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showStatusFilter && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 p-2 max-h-64 overflow-y-auto">
                    <div className="space-y-1">
                      <button
                        onClick={() => updateFilters({ selectedStatuses: [] })}
                        className={cn(
                          'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                          selectedStatuses.length === 0
                            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                        )}
                      >
                        All
                      </button>
                      {allStatuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => toggleStatus(status)}
                          className={cn(
                            'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                            selectedStatuses.includes(status)
                              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                              : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                          )}
                        >
                          {getStatusLabel(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actor Type Filter */}
              <div className="relative" ref={actorTypeFilterRef}>
                <button
                  onClick={() => setShowActorTypeFilter(!showActorTypeFilter)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors',
                    selectedActorTypes.length > 0
                      ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                  )}
                >
                  <span>Actor: {selectedActorTypes.length > 0 ? selectedActorTypes[0].charAt(0).toUpperCase() + selectedActorTypes[0].slice(1) : 'All'}</span>
                  {showActorTypeFilter ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showActorTypeFilter && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 p-2 max-h-64 overflow-y-auto">
                    <div className="space-y-1">
                      <button
                        onClick={() => updateFilters({ selectedActorTypes: [] })}
                        className={cn(
                          'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                          selectedActorTypes.length === 0
                            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                        )}
                      >
                        All
                      </button>
                      {allActorTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleActorType(type)}
                          className={cn(
                            'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                            selectedActorTypes.includes(type)
                              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                              : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                          )}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Priority Filter */}
              <div className="relative" ref={priorityFilterRef}>
                <button
                  onClick={() => setShowPriorityFilter(!showPriorityFilter)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors',
                    selectedPriorities.length > 0
                      ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                  )}
                >
                  <span>Priority: {selectedPriorities.length > 0 ? selectedPriorities[0].charAt(0).toUpperCase() + selectedPriorities[0].slice(1) : 'All'}</span>
                  {showPriorityFilter ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showPriorityFilter && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 p-2 max-h-64 overflow-y-auto">
                    <div className="space-y-1">
                      <button
                        onClick={() => updateFilters({ selectedPriorities: [] })}
                        className={cn(
                          'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                          selectedPriorities.length === 0
                            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                        )}
                      >
                        All
                      </button>
                      {allPriorities.map((priority) => (
                        <button
                          key={priority}
                          onClick={() => togglePriority(priority)}
                          className={cn(
                            'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                            selectedPriorities.includes(priority)
                              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                              : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                          )}
                        >
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sort By */}
              <div className="relative" ref={sortByRef}>
                <button
                  onClick={() => setShowSortBy(!showSortBy)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                >
                  <span>Sort: {getSortByLabel(sortBy)}</span>
                  {showSortBy ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showSortBy && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 p-2">
                    <div className="space-y-1">
                      {(['createdAt', 'lastMessageAt'] as const).map((value) => (
                        <button
                          key={value}
                          onClick={() => updateFilters({ sortBy: value })}
                          className={cn(
                            'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                            sortBy === value
                              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                              : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                          )}
                        >
                          {getSortByLabel(value)}
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
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                >
                  <span>Order: {getSortOrderLabel(sortOrder)}</span>
                  {showSortOrder ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showSortOrder && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 p-2">
                    <div className="space-y-1">
                      {(['asc', 'desc'] as const).map((value) => (
                        <button
                          key={value}
                          onClick={() => updateFilters({ sortOrder: value })}
                          className={cn(
                            'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                            sortOrder === value
                              ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                              : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                          )}
                        >
                          {getSortOrderLabel(value)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              {(selectedStatuses.length > 0 || selectedActorTypes.length > 0 || selectedPriorities.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 min-h-0">
            <AdminSupportTable
              tickets={tickets}
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={handlePageChange}
              ticketId={ticketId}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
