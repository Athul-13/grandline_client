import { useState } from 'react';
import { ReservationsTable } from '../../components/reservations/reservations_table';
import { useReservationsList } from '../../hooks/reservations/use_reservations_list';

/**
 * Reservations Page
 * Displays user reservations in a table with pagination
 */
export const ReservationsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { reservations, pagination, isLoading, error } = useReservationsList({
    page: currentPage,
    limit: itemsPerPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-5 sm:p-4 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
          Reservations
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--color-text-secondary)]">
          View and manage your confirmed reservations
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
            <p className="text-sm sm:text-base text-red-800 dark:text-red-200">{error}</p>
          </div>
        ) : (
          <ReservationsTable
            reservations={reservations}
            pagination={pagination}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};
