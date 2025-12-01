import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Pagination } from '../common/ui/pagination';
import { AdminUserDetailsView } from './admin_user_details_view';
import { AdminUsersTableRow } from './admin_users_table_row';
import { AdminUsersCard } from './admin_users_card';
import { useAdminUserDetails } from '../../hooks/users/use_admin_user_details';
import { ROUTES } from '../../constants/routes';
import { useSearchContext } from '../../hooks/use_search_context';
import type { AdminUserListItem } from '../../types/users/admin_user';

interface AdminUsersTableProps {
  users: AdminUserListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  showPaginationOnly?: boolean;
  userId?: string; // When provided, show user details instead of table
}

/**
 * Admin Users Table Component
 * Displays admin users in a table with pagination and user details view
 */
const SELECTED_USERS_STORAGE_KEY = 'admin_users_selected';

export const AdminUsersTable: React.FC<AdminUsersTableProps> = ({
  users,
  pagination,
  isLoading,
  onPageChange,
  showPaginationOnly = false,
  userId,
}) => {
  const { searchQuery } = useSearchContext();
  const navigate = useNavigate();
  
  // Refs for syncing horizontal scroll
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  
  // Selection state with persistence
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  
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
  
  // Load selected users from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SELECTED_USERS_STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        setSelectedUserIds(new Set(ids));
      }
    } catch (error) {
      console.error('Failed to load selected users from localStorage:', error);
    }
  }, []);

  // Save selected users to localStorage whenever selection changes
  useEffect(() => {
    try {
      if (selectedUserIds.size > 0) {
        localStorage.setItem(SELECTED_USERS_STORAGE_KEY, JSON.stringify(Array.from(selectedUserIds)));
      } else {
        localStorage.removeItem(SELECTED_USERS_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save selected users to localStorage:', error);
    }
  }, [selectedUserIds]);
  
  // User details state
  const { userDetails, isLoading: isLoadingDetails, error: detailsError, refetch: refetchUserDetails } = useAdminUserDetails(userId || '');

  // Selection handlers
  const handleSelectUser = useCallback((userId: string, isSelected: boolean) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((isSelected: boolean) => {
    if (isSelected) {
      const allIds = new Set(users.map((u) => u.userId));
      setSelectedUserIds(allIds);
    } else {
      setSelectedUserIds(new Set());
    }
  }, [users]);

  const handleDeselectAll = useCallback(() => {
    setSelectedUserIds(new Set());
  }, []);

  // Check if all users on current page are selected
  const allSelected = users.length > 0 && users.every((u) => selectedUserIds.has(u.userId));

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to previous page (maintains state)
  };

  // If only showing pagination
  if (showPaginationOnly) {
    return (
      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        <div className="flex justify-center">
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
    );
  }

  // Loading state (no header when loading)
  if (isLoading && !userId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  // Empty state (no header when empty)
  if (!isLoading && users.length === 0 && !userId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
          No users found
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          There are no users to display at this time.
        </p>
      </div>
    );
  }

  // Render table header always (even when viewing details) to maintain size
  const renderTableHeader = () => {
    // Show "User Details" header when viewing details
    if (userId) {
      return (
        <div 
          ref={headerScrollRef}
          className="flex-shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] h-[48px] flex items-center px-4"
        >
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
          </button>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            User Details
          </h2>
        </div>
      );
    }

    // Normal table header
    return (
      <div 
        ref={headerScrollRef}
        className="flex-shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-x-auto overflow-y-hidden hide-scrollbar h-[48px]"
        onScroll={handleHeaderScroll}
      >
        <div className="min-w-[800px]">
          {selectedUserIds.size > 0 ? (
            // Action buttons header when selection exists
            <div className="flex items-center px-4 py-3 h-[48px]">
              <div className="flex-[0_0_40px]">
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
                  {selectedUserIds.size} selected
                </span>
                <button
                  onClick={handleDeselectAll}
                  className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Deselect all
                </button>
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
                      checked={allSelected && users.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_18%] whitespace-nowrap flex items-center">
                    Full Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_20%] whitespace-nowrap flex items-center">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_15%] whitespace-nowrap flex items-center">
                    Phone Number
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_12%] whitespace-nowrap flex items-center">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_10%] whitespace-nowrap flex items-center">
                    Verified
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_15%] whitespace-nowrap flex items-center">
                    Created Date
                  </th>
                </tr>
              </thead>
            </table>
          )}
        </div>
      </div>
    );
  };

  // Render body content (table rows or details view)
  const renderBodyContent = () => {
    // User Details View
    if (userId) {
      if (isLoadingDetails) {
        return (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
            </div>
          </div>
        );
      }

      if (detailsError || !userDetails) {
        return (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <p className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Error</p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                {detailsError || 'User not found'}
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
        <div className="flex-1 min-h-0 overflow-y-auto">
          <AdminUserDetailsView
            userDetails={userDetails}
            onStatusChange={refetchUserDetails}
          />
        </div>
      );
    }

    // Table rows
    return (
      <div 
        ref={bodyScrollRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-auto overscroll-none"
        onScroll={handleBodyScroll}
      >
        <table className="w-full table-fixed min-w-[800px]">
          <tbody className="block">
            {users.map((user) => (
              <AdminUsersTableRow
                key={user.userId}
                user={user}
                searchQuery={searchQuery}
                isSelected={selectedUserIds.has(user.userId)}
                onSelectChange={(isSelected) => handleSelectUser(user.userId, isSelected)}
                onRowClick={() => navigate(ROUTES.admin.userDetails(user.userId))}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:flex flex-1 flex-col min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] overflow-hidden">
        {/* Fixed Header - Always visible to maintain size */}
        {renderTableHeader()}
        {/* Scrollable Body - Changes between table and details */}
        {renderBodyContent()}
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden flex-1 overflow-y-auto space-y-3">
        {/* Mobile action bar when selection exists */}
        {selectedUserIds.size > 0 && (
          <div className="sticky top-0 z-10 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg p-3 mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {selectedUserIds.size} selected
            </span>
            <button
              onClick={handleDeselectAll}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-2 py-1"
            >
              Clear
            </button>
          </div>
        )}
        {users.map((user) => (
          <AdminUsersCard
            key={user.userId}
            user={user}
            searchQuery={searchQuery}
            isSelected={selectedUserIds.has(user.userId)}
            onSelectChange={(isSelected) => handleSelectUser(user.userId, isSelected)}
            onCardClick={() => navigate(ROUTES.admin.userDetails(user.userId))}
          />
        ))}
      </div>
    </div>
  );
};

