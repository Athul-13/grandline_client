import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSupportTableRow } from './admin_support_table_row';
import { Pagination } from '../../common/ui/pagination';
import { ROUTES } from '../../../constants/routes';
import { AdminSupportTicketDetailView } from './admin_support_ticket_detail_view';
import { useGetTicketById } from '../../../hooks/support/use_get_ticket_by_id';
import { TableSkeleton } from '../../common/ui/loaders';
import type { AdminTicketListItem } from '../../../types/support/ticket';

interface AdminSupportTableProps {
  tickets: AdminTicketListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  ticketId?: string; // When provided, show ticket details instead of table
  searchQuery?: string; // Search query for highlighting
}

/**
 * Admin Support Table Component
 * Displays admin support tickets in a table with pagination and ticket details view
 */
export const AdminSupportTable: React.FC<AdminSupportTableProps> = ({
  tickets,
  pagination,
  isLoading,
  onPageChange,
  ticketId,
  searchQuery = '',
}) => {
  const navigate = useNavigate();
  
  // Refs for syncing horizontal scroll
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  
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

  // Ticket details state
  const { data: ticketDetails, isLoading: isLoadingDetails, error: detailsError, refetch } = useGetTicketById(ticketId || '');

  // Handle back navigation
  const handleBack = () => {
    navigate(ROUTES.admin.supportConcerns);
  };

  // Ticket Details View
  if (ticketId) {
    if (isLoadingDetails) {
      return (
        <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
          <div className="h-64 bg-[var(--color-bg-hover)] rounded animate-pulse"></div>
        </div>
      );
    }

    if (detailsError || !ticketDetails) {
      return (
        <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <p className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Error</p>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              {detailsError instanceof Error ? detailsError.message : String(detailsError || 'Ticket not found')}
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
      <AdminSupportTicketDetailView
        ticketDetails={ticketDetails}
        onBack={handleBack}
        onRefetch={refetch}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <TableSkeleton
        isTableFixed
        minWidth="1000px"
        columns={[
          { width: '10%' },
          { width: '20%' },
          { width: '10%' },
          { width: '15%' },
          { width: '10%' },
          { width: '10%' },
          { width: '15%' },
          { width: '10%' },
        ]}
        rowCount={5}
      />
    );
  }

  // Empty state
  if (!isLoading && tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
          No tickets found
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          There are no support tickets to display at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Desktop Table View */}
      <div className="flex-1 flex-col min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] overflow-hidden">
        {/* Fixed Header */}
        <div 
          ref={headerScrollRef}
          className="flex-shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-x-auto overflow-y-hidden hide-scrollbar"
          onScroll={handleHeaderScroll}
        >
          <div className="min-w-[1000px]">
            <table className="w-full table-fixed">
              <thead>
                <tr className="flex h-[48px]">
                  <th className="px-4 py-3 text-left text-xs text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_10%] whitespace-nowrap flex items-center">
                    Ticket ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_20%] whitespace-nowrap flex items-center">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_10%] whitespace-nowrap flex items-center">
                    Actor Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_15%] whitespace-nowrap flex items-center">
                    Actor Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_10%] whitespace-nowrap flex items-center">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_10%] whitespace-nowrap flex items-center">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_15%] whitespace-nowrap flex items-center">
                    Created At
                  </th>
                  <th className="px-4 py-3 text-left text-xs text-[var(--color-text-secondary)] uppercase tracking-wider flex-[0_0_10%] whitespace-nowrap flex items-center">
                    Actions
                  </th>
                </tr>
              </thead>
            </table>
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
              {tickets.map((ticket) => (
                <AdminSupportTableRow
                  key={ticket.ticketId}
                  ticket={ticket}
                  onRowClick={() => navigate(ROUTES.admin.supportTicketDetails(ticket.ticketId))}
                  searchQuery={searchQuery}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
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

