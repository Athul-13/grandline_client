import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxPageNumbers?: number;
  className?: string;
  onPageHover?: (page: number) => void;
}

/**
 * Pagination Component
 * Reusable pagination component for tables, lists, and grids
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxPageNumbers = 7,
  className,
  onPageHover,
}) => {
  // Always render, even if there's only one page

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= maxPageNumbers) {
      // Show all pages if total is less than max
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];
    const half = Math.floor(maxPageNumbers / 2);

    if (currentPage <= half + 1) {
      // Near the start
      for (let i = 1; i <= maxPageNumbers - 2; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - half) {
      // Near the end
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - (maxPageNumbers - 3); i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle
      pages.push(1);
      pages.push('ellipsis');
      for (let i = currentPage - Math.floor((maxPageNumbers - 4) / 2); i <= currentPage + Math.floor((maxPageNumbers - 4) / 2); i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      {/* Page Info */}
      <div className="text-sm text-[var(--color-text-secondary)]">
        Page <span className="font-medium text-[var(--color-text-primary)]">{currentPage}</span> of{' '}
        <span className="font-medium text-[var(--color-text-primary)]">{totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]',
            'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-bg-secondary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]'
          )}
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]',
            'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-bg-secondary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]'
          )}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-[var(--color-text-secondary)]"
                  >
                    ...
                  </span>
                );
              }

              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  onMouseEnter={() => onPageHover?.(page)}
                  className={cn(
                    'min-w-[2.5rem] px-3 py-2 rounded-lg border transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
                    isActive
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] font-medium'
                      : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}

        {/* Next Page */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          onMouseEnter={() => onPageHover?.(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]',
            'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-bg-secondary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]'
          )}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]',
            'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-bg-secondary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]'
          )}
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

