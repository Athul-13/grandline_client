import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSearchContext } from '../../hooks/use_search_context';
import { AdminQuotesTable } from '../../components/quotes/admin_quotes_table';
import { useAdminQuotesList } from '../../hooks/quotes/use_admin_quotes_list';
import { Pagination } from '../../components/common/ui/pagination';

export const AdminQuotesPage: React.FC = () => {
  const { id: quoteId } = useParams<{ id?: string }>();
  const { searchQuery } = useSearchContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const itemsPerPage = 15;

  const { quotes, pagination, isLoading, error } = useAdminQuotesList({
    page: currentPage,
    limit: itemsPerPage,
    includeDeleted,
    search: searchQuery,
  });

  // Reset pagination to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, includeDeleted]);

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
            <div className="flex items-center gap-2">
              {/* Include Deleted Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeDeleted"
                  checked={includeDeleted}
                  onChange={(e) => setIncludeDeleted(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="includeDeleted"
                  className="text-sm text-[var(--color-text-primary)] cursor-pointer"
                >
                  Include Deleted
                </label>
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

