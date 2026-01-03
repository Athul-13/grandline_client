import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSearchContext } from '../../hooks/use_search_context';
import { useAdminTripsList } from '../../hooks/trips/use_admin_trips_list';
import { AdminTripCard } from '../../components/trips/admin_trip_card';
import { Pagination } from '../../components/common/ui/pagination';
import { TripCardSkeleton } from '../../components/common/ui/loaders';
import { cn } from '../../utils/cn';
import type { TripState } from '../../types/trips/admin_trip';
import { AdminTripDetailsView } from '../../components/trips/admin_trip_details_view';

export const AdminTripManagementPage: React.FC = () => {
  const { id: reservationId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { searchQuery } = useSearchContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedState, setSelectedState] = useState<TripState | undefined>(undefined);
  const itemsPerPage = 15;

  // Call all hooks before any conditional returns (React Rules of Hooks)
  // Note: This hook will run even when showing details, but its results won't be used
  const { trips, pagination, isLoading, error } = useAdminTripsList({
    page: currentPage,
    limit: itemsPerPage,
    state: selectedState,
    search: searchQuery,
  });

  // Reset pagination to page 1 when filters change
  useEffect(() => {
    if (!reservationId) {
      setCurrentPage(1);
    }
  }, [searchQuery, selectedState, reservationId]);

  // Show details view if reservationId is provided
  // IMPORTANT: All hooks must be called before this conditional return
  if (reservationId) {
    return (
      <AdminTripDetailsView
        reservationId={reservationId}
        onBack={() => navigate('/admin/trip-management')}
      />
    );
  }

  const handleStateChange = (state: TripState | undefined) => {
    setSelectedState(state);
  };

  const states: Array<{ value: TripState | undefined; label: string }> = [
    { value: undefined, label: 'All' },
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'CURRENT', label: 'Current' },
    { value: 'PAST', label: 'Past' },
  ];

  return (
    <div className="h-full overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      {/* Main Content */}
      <div className="h-full flex flex-col">
        <div className="h-full flex flex-col px-4 py-3">
          {/* Tabs / State Filter */}
          <div className="mb-3 flex-shrink-0">
            <div className="flex items-center gap-2 border-b border-[var(--color-border)]">
              {states.map((state) => (
                <button
                  key={state.value || 'all'}
                  onClick={() => handleStateChange(state.value)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium transition-colors relative',
                    'hover:text-[var(--color-primary)]',
                    selectedState === state.value
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-text-secondary)]'
                  )}
                >
                  {state.label}
                  {selectedState === state.value && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-3 flex-shrink-0 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
              <p className="text-sm sm:text-base text-red-800 dark:text-red-200">Error: {error}</p>
            </div>
          )}

          {/* Trips Grid - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <TripCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? null : (
              <>
                {trips.length === 0 ? (
                  <div className="bg-[var(--color-bg-card)] rounded-lg shadow-md p-8 text-center">
                    <p className="text-[var(--color-text-secondary)]">
                      {selectedState
                        ? `No ${selectedState.toLowerCase()} trips found.`
                        : 'No trips found.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {trips.map((trip) => (
                      <AdminTripCard key={trip.reservationId} trip={trip} searchQuery={searchQuery} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pagination - Fixed at bottom */}
          {pagination && (
            <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex-shrink-0">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
