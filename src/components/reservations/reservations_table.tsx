import { useSearchParams } from 'react-router-dom';
import { Pagination } from '../common/ui/pagination';
import { ReservationsTableRow } from './reservations_table_row';
import { ReservationsCard } from './reservations_card';
import { UserReservationDetailsView } from './user_reservation_details_view';
import { useReservationDetails } from '../../hooks/reservations/use_reservation_details';
import { TableSkeleton, QuoteDetailsSkeleton } from '../common/ui/loaders';
import type { ReservationListItem } from '../../types/reservations/reservation';

interface ReservationsTableProps {
  reservations: ReservationListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

/**
 * Reservations Table Component
 */
export const ReservationsTable: React.FC<ReservationsTableProps> = ({
  reservations,
  pagination,
  isLoading,
  onPageChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const reservationId = searchParams.get('reservationId') || undefined;

  // Fetch reservation details if reservationId is provided
  const { reservationDetails, isLoading: isLoadingDetails, error: detailsError } =
    useReservationDetails(reservationId || '');

  // Handle row/card click
  const handleReservationClick = (reservation: ReservationListItem) => {
    setSearchParams({ reservationId: reservation.reservationId });
  };

  // Handle back from details view
  const handleBack = () => {
    setSearchParams({});
  };

  // Reservation Details View
  if (reservationId) {
    if (isLoadingDetails) {
      return <QuoteDetailsSkeleton variant="user" />;
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
      <UserReservationDetailsView
        reservationDetails={reservationDetails}
        onBack={handleBack}
      />
    );
  }

  if (isLoading) {
    return (
      <TableSkeleton
        columns={[
          {}, // Trip Name
          {}, // Type
          {}, // Status
          {}, // Reservation Date
          {}, // Amount
          {}, // Start Location
          {}, // End Location
        ]}
        rowCount={5}
      />
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--color-text-secondary)]">No reservations found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:flex flex-1 flex-col min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <table className="w-full">
            <thead>
              <tr>
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
                  Reservation Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] h-[48px]">
                  Amount
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
        </div>
        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="w-full">
            <tbody className="divide-y divide-[var(--color-border)]">
              {reservations.map((reservation) => (
                <ReservationsTableRow
                  key={reservation.reservationId}
                  reservation={reservation}
                  onRowClick={() => handleReservationClick(reservation)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden flex-1 overflow-y-auto space-y-3">
        {reservations.map((reservation) => (
          <ReservationsCard
            key={reservation.reservationId}
            reservation={reservation}
            onCardClick={() => handleReservationClick(reservation)}
          />
        ))}
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
    </div>
  );
};

