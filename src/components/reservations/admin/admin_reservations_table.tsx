import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pagination } from '../../common/ui/pagination';
import { AdminReservationsTableRow } from './admin_reservations_table_row';
import { AdminReservationsCard } from './admin_reservations_card';
import { useAdminReservationDetails } from '../../../hooks/reservations/use_admin_reservation_details';
import { useUpdateReservationStatus } from '../../../hooks/reservations/use_update_reservation_status';
import { useSearchContext } from '../../../hooks/use_search_context';
import { ConfirmationModal } from '../../common/modals/confirmation_modal';
import { Button } from '../../common/ui/button';
import { TableSkeleton, ReservationDetailsSkeleton } from '../../common/ui/loaders';
import type { AdminReservationListItem } from '../../../types/reservations/admin_reservation';
import type { ReservationStatusType } from '../../../types/reservations/reservation';
import { AdminReservationDetailsView } from './admin_reservation_details_view';

interface AdminReservationsTableProps {
  reservations: AdminReservationListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  showPaginationOnly?: boolean;
  reservationId?: string; // When provided, show reservation details instead of table
}

/**
 * Admin Reservations Table Component
 * Displays admin reservations in a table with pagination and reservation details view
 */
const SELECTED_RESERVATIONS_STORAGE_KEY = 'admin_reservations_selected';

export const AdminReservationsTable: React.FC<AdminReservationsTableProps> = ({
  reservations,
  pagination,
  isLoading,
  onPageChange,
  showPaginationOnly = false,
  reservationId,
}) => {
  const { searchQuery } = useSearchContext();
  const [copiedReservationId, setCopiedReservationId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Refs for syncing horizontal scroll
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  
  // Selection state with persistence
  const [selectedReservationIds, setSelectedReservationIds] = useState<Set<string>>(new Set());
  const [showStatusConfirmModal, setShowStatusConfirmModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ reservationId: string; newStatus: string; currentStatus: string } | null>(null);
  
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
  
  // Load selected reservations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SELECTED_RESERVATIONS_STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        setSelectedReservationIds(new Set(ids));
      }
    } catch (error) {
      console.error('Failed to load selected reservations from localStorage:', error);
    }
  }, []);

  // Save selected reservations to localStorage whenever selection changes
  useEffect(() => {
    try {
      if (selectedReservationIds.size > 0) {
        localStorage.setItem(SELECTED_RESERVATIONS_STORAGE_KEY, JSON.stringify(Array.from(selectedReservationIds)));
      } else {
        localStorage.removeItem(SELECTED_RESERVATIONS_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save selected reservations to localStorage:', error);
    }
  }, [selectedReservationIds]);
  
  // Reservation details state
  const { reservationDetails, isLoading: isLoadingDetails, error: detailsError, refetch } = useAdminReservationDetails(reservationId || '');
  const { updateStatus, isLoading: isUpdatingStatus } = useUpdateReservationStatus();

  // Handle status update with confirmation
  const handleStatusChange = async (newStatus: string) => {
    if (!reservationId || !reservationDetails) return;

    // Show confirmation modal
    setPendingStatusChange({
      reservationId,
      newStatus,
      currentStatus: reservationDetails.status,
    });
    setShowStatusConfirmModal(true);
  };

  // Confirm status update
  const handleConfirmStatusChange = async () => {
    if (!pendingStatusChange) return;

    const result = await updateStatus(pendingStatusChange.reservationId, { 
      status: pendingStatusChange.newStatus as ReservationStatusType,
    });

    if (result) {
      toast.success(`Reservation status updated to ${pendingStatusChange.newStatus}`);
      await refetch();
    } else {
      toast.error('Failed to update reservation status');
    }

    setShowStatusConfirmModal(false);
    setPendingStatusChange(null);
  };

  // Selection handlers
  const handleSelectReservation = useCallback((reservationId: string, isSelected: boolean) => {
    setSelectedReservationIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(reservationId);
      } else {
        newSet.delete(reservationId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((isSelected: boolean) => {
    if (isSelected) {
      const allIds = new Set(reservations.map((r) => r.reservationId));
      setSelectedReservationIds(allIds);
    } else {
      setSelectedReservationIds(new Set());
    }
  }, [reservations]);

  const handleDeselectAll = useCallback(() => {
    setSelectedReservationIds(new Set());
  }, []);

  // Check if all reservations on current page are selected
  const allSelected = reservations.length > 0 && reservations.every((r) => selectedReservationIds.has(r.reservationId));

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Copy reservation ID to clipboard
  const handleCopyReservationId = async (idToCopy: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(idToCopy);
      setCopiedReservationId(idToCopy);
      toast.success('Reservation ID copied to clipboard');
      setTimeout(() => setCopiedReservationId(null), 2000);
    } catch {
      toast.error('Failed to copy reservation ID');
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

  // Reservation Details View
  if (reservationId) {
    if (isLoadingDetails) {
      return <ReservationDetailsSkeleton variant="admin" />;
    }

    if (detailsError || !reservationDetails) {
      return (
        <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <p className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Error</p>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              {detailsError || 'Reservation not found'}
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
      <AdminReservationDetailsView
        reservationDetails={reservationDetails}
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
        minWidth="1000px"
        columns={[
          { width: '5%' },
          { width: '10%' },
          { width: '12%' },
          { width: '12%' },
          { width: '8%' },
          { width: '10%' },
          { width: '10%' },
          { width: '15%' },
          { width: '10%' },
          { width: '8%' },
        ]}
        rowCount={5}
      />
    );
  }

  // Empty state
  if (!isLoading && reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
          No reservations found
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          There are no reservations to display at this time.
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
            <div className="min-w-[1000px]">
              {selectedReservationIds.size > 0 ? (
                // Action buttons header when selection exists
                <div className="flex items-center px-4 py-3 h-[48px]">
                  <div className="w-[40px]">
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
                      {selectedReservationIds.size} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAll}
                      className="text-sm"
                    >
                      Deselect All
                    </Button>
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
                          checked={allSelected && reservations.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_12%] whitespace-nowrap flex items-center">
                        Reservation ID
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
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_12%] whitespace-nowrap flex items-center">
                        Trip Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_15%] whitespace-nowrap flex items-center">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_18%] whitespace-nowrap flex items-center">
                        Locations
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
            <table className="w-full table-fixed min-w-[1000px]">
              <tbody className="block">
                {reservations.map((reservation) => (
                  <AdminReservationsTableRow
                    key={reservation.reservationId}
                    reservation={reservation}
                    searchQuery={searchQuery}
                    copiedReservationId={copiedReservationId}
                    onCopyReservationId={handleCopyReservationId}
                    isSelected={selectedReservationIds.has(reservation.reservationId)}
                    onSelectChange={(isSelected) => handleSelectReservation(reservation.reservationId, isSelected)}
                    onRowClick={() => navigate(`/admin/reservations/${reservation.reservationId}`)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View - Hidden on desktop */}
        <div className="md:hidden space-y-3">
          {reservations.map((reservation) => (
            <AdminReservationsCard
              key={reservation.reservationId}
              reservation={reservation}
              searchQuery={searchQuery}
              copiedReservationId={copiedReservationId}
              onCopyReservationId={handleCopyReservationId}
              isSelected={selectedReservationIds.has(reservation.reservationId)}
              onSelectChange={(isSelected) => handleSelectReservation(reservation.reservationId, isSelected)}
              onCardClick={() => navigate(`/admin/reservations/${reservation.reservationId}`)}
            />
          ))}
        </div>
      </div>

      {/* Status Change Confirmation Modal */}
      {showStatusConfirmModal && pendingStatusChange && (
        <ConfirmationModal
          isOpen={showStatusConfirmModal}
          onClose={() => {
            setShowStatusConfirmModal(false);
            setPendingStatusChange(null);
          }}
          onConfirm={handleConfirmStatusChange}
          title="Confirm Status Change"
          message={`Are you sure you want to change the reservation status from "${pendingStatusChange.currentStatus}" to "${pendingStatusChange.newStatus}"?`}
          confirmText="Update Status"
          cancelText="Cancel"
          variant="warning"
        />
      )}
    </>
  );
};

