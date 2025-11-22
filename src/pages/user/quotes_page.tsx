import { useState } from 'react';
import { useLanguage } from '../../hooks/use_language';
import { QuotesTable } from '../../components/quotes/quotes_table';
import { useQuotesList } from '../../hooks/quotes/use_quotes_list';

/**
 * Quotes Page
 * Displays user quotes in a table with pagination, selection, and actions
 */
export const QuotesPage: React.FC = () => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { quotes, pagination, isLoading, error, refetch } = useQuotesList({
    page: currentPage,
    limit: itemsPerPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteSuccess = () => {
    refetch();
  };

  return (
    <div className="p-5 sm:p-4 md:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
          {t('dashboard.quotes.title')}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--color-text-secondary)]">
          {t('dashboard.quotes.subtitle')}
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
            <p className="text-sm sm:text-base text-red-800 dark:text-red-200">{error}</p>
          </div>
        ) : (
          <QuotesTable
            quotes={quotes}
            pagination={pagination}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onDeleteSuccess={handleDeleteSuccess}
          />
        )}
      </div>
    </div>
  );
};

