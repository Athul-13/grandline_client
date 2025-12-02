import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, MoreVertical, ChevronDown, Activity, Clock, ShieldOff, Ban, XCircle } from 'lucide-react';
import { Pagination } from '../common/ui/pagination';
import { AdminDriversTableRow } from './admin_drivers_table_row';
import { AdminDriverDetailsView } from './admin_driver_details_view';
import { TableSkeleton, UserDetailsSkeleton } from '../common/ui/loaders';
import { useAdminDriverDetails } from '../../hooks/drivers/use_admin_driver_details';
import { useDeleteDriver } from '../../hooks/drivers/use_delete_driver';
import { useBulkDriverActions } from '../../hooks/drivers/use_bulk_driver_actions';
import { ConfirmationModal } from '../common/modals/confirmation_modal';
import { Button } from '../common/ui/button';
import { ROUTES } from '../../constants/routes';
import { DriverStatus } from '../../types/drivers/admin_driver';
import { useLanguage } from '../../hooks/use_language';
import type { AdminDriverListItem, DriverStatusType } from '../../types/drivers/admin_driver';

interface AdminDriversTableProps {
  drivers: AdminDriverListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  showPaginationOnly?: boolean;
  driverId?: string; // When provided, show driver details instead of table
}

/**
 * Admin Drivers Table Component
 * Displays admin drivers in a table with pagination
 */
const SELECTED_DRIVERS_STORAGE_KEY = 'admin_drivers_selected';

export const AdminDriversTable: React.FC<AdminDriversTableProps> = ({
  drivers,
  pagination,
  isLoading,
  onPageChange,
  showPaginationOnly = false,
  driverId,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Refs for syncing horizontal scroll
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  
  // Selection state with persistence
  const [selectedDriverIds, setSelectedDriverIds] = useState<Set<string>>(new Set());
  
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
  
  // Load selected drivers from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SELECTED_DRIVERS_STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        setSelectedDriverIds(new Set(ids));
      }
    } catch (error) {
      console.error('Failed to load selected drivers from localStorage:', error);
    }
  }, []);

  // Save selected drivers to localStorage whenever selection changes
  useEffect(() => {
    try {
      if (selectedDriverIds.size > 0) {
        localStorage.setItem(SELECTED_DRIVERS_STORAGE_KEY, JSON.stringify(Array.from(selectedDriverIds)));
      } else {
        localStorage.removeItem(SELECTED_DRIVERS_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save selected drivers to localStorage:', error);
    }
  }, [selectedDriverIds]);
  
  // Selection handlers
  const handleSelectDriver = useCallback((driverId: string, isSelected: boolean) => {
    setSelectedDriverIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(driverId);
      } else {
        newSet.delete(driverId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((isSelected: boolean) => {
    if (isSelected) {
      const allIds = new Set(drivers.map((d) => d.driverId));
      setSelectedDriverIds(allIds);
    } else {
      setSelectedDriverIds(new Set());
    }
  }, [drivers]);

  const handleDeselectAll = useCallback(() => {
    setSelectedDriverIds(new Set());
  }, []);

  // Check if all drivers on current page are selected
  const allSelected = drivers.length > 0 && drivers.every((d) => selectedDriverIds.has(d.driverId));

  // Driver details state
  const { driverDetails, isLoading: isLoadingDetails, error: detailsError, refetch: refetchDriverDetails } = useAdminDriverDetails(driverId || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showBulkStatusModal, setShowBulkStatusModal] = useState(false);
  const [pendingBulkStatus, setPendingBulkStatus] = useState<DriverStatusType | null>(null);
  const [showBulkStatusDropdown, setShowBulkStatusDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; right: number } | null>(null);
  const bulkStatusDropdownRef = useRef<HTMLDivElement>(null);
  
  const deleteDriverMutation = useDeleteDriver({
    driverId: driverId || '',
    onSuccess: () => {
      setShowDeleteModal(false);
    },
  });

  const { bulkDelete, bulkUpdateStatus, isDeleting: isBulkDeleting, isUpdatingStatus: isBulkUpdatingStatus } = useBulkDriverActions();

  // Only enable delete mutation when driverId is available
  const handleDelete = () => {
    if (driverId) {
      deleteDriverMutation.mutate();
    }
  };

  const handleBulkDelete = async () => {
    const driverIds = Array.from(selectedDriverIds);
    await bulkDelete(driverIds);
    setShowBulkDeleteModal(false);
    setSelectedDriverIds(new Set());
  };

  const handleBulkStatusChange = async () => {
    if (!pendingBulkStatus) return;
    const driverIds = Array.from(selectedDriverIds);
    await bulkUpdateStatus(driverIds, pendingBulkStatus);
    setShowBulkStatusModal(false);
    setPendingBulkStatus(null);
    setSelectedDriverIds(new Set());
  };

  const getStatusLabel = (status: DriverStatusType): string => {
    return t(`driver.status.${status}`);
  };

  const getStatusIcon = (status: DriverStatusType) => {
    switch (status) {
      case DriverStatus.AVAILABLE:
        return <Activity className="w-4 h-4 text-green-500" />;
      case DriverStatus.ON_TRIP:
        return <Clock className="w-4 h-4 text-blue-500" />;
      case DriverStatus.OFFLINE:
        return <ShieldOff className="w-4 h-4 text-gray-500" />;
      case DriverStatus.SUSPENDED:
        return <Ban className="w-4 h-4 text-yellow-500" />;
      case DriverStatus.BLOCKED:
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  // Update dropdown position and handle outside clicks
  useEffect(() => {
    const updateDropdownPosition = () => {
      if (bulkStatusDropdownRef.current && showBulkStatusDropdown) {
        const rect = bulkStatusDropdownRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 4,
          right: window.innerWidth - rect.right,
        });
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (bulkStatusDropdownRef.current && !bulkStatusDropdownRef.current.contains(event.target as Node)) {
        setShowBulkStatusDropdown(false);
      }
    };

    if (showBulkStatusDropdown) {
      updateDropdownPosition();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [showBulkStatusDropdown]);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
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

  // Loading state
  if (isLoading && !driverId) {
    return (
      <TableSkeleton
        hasCheckbox
        isTableFixed
        minWidth="1000px"
        columns={[
          { width: '15%' },
          { width: '18%' },
          { width: '12%' },
          { width: '12%' },
          { width: '12%' },
          { width: '12%' },
          { width: '10%' },
          { width: '9%' },
        ]}
        rowCount={5}
      />
    );
  }

  // Empty state
  if (!isLoading && drivers.length === 0 && !driverId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
          {t('driver.list.noDriversFound')}
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t('driver.list.noDriversToDisplay')}
        </p>
      </div>
    );
  }

  // Render table header
  const renderTableHeader = () => {
    if (driverId) {
      return (
        <div 
          ref={headerScrollRef}
          className="shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] h-[48px] flex items-center justify-between px-4"
        >
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors mr-2"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
            </button>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {t('driver.details.title')}
            </h2>
          </div>
          {driverDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
              {t('common.deleteDriver')}
            </Button>
          )}
        </div>
      );
    }

    return (
      <div 
        ref={headerScrollRef}
        className="shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-x-auto overflow-y-hidden hide-scrollbar h-[48px]"
        onScroll={handleHeaderScroll}
      >
        <div className="min-w-[1000px]">
          {selectedDriverIds.size > 0 ? (
            <div className="flex items-center justify-between px-4 py-3 h-[48px]">
              <div className="flex items-center gap-3">
                <div className="flex-[0_0_40px]">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {selectedDriverIds.size} selected
                </span>
                <button
                  onClick={handleDeselectAll}
                  className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Deselect all
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative z-[100]" ref={bulkStatusDropdownRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBulkStatusDropdown(!showBulkStatusDropdown)}
                    disabled={isBulkUpdatingStatus || isBulkDeleting}
                    className="flex items-center gap-2"
                  >
                    <MoreVertical className="w-4 h-4" />
                    {t('common.changeStatus')}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  {showBulkStatusDropdown && dropdownPosition && (
                    <div 
                      className="fixed w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-[9999] p-2" 
                      style={{ 
                        top: `${dropdownPosition.top}px`,
                        right: `${dropdownPosition.right}px`
                      }}
                    >
                      <div className="space-y-1">
                        {Object.values(DriverStatus).map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setPendingBulkStatus(status);
                              setShowBulkStatusModal(true);
                              setShowBulkStatusDropdown(false);
                            }}
                            className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                          >
                            {getStatusIcon(status)}
                            <span>{getStatusLabel(status)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkDeleteModal(true)}
                  disabled={isBulkDeleting || isBulkUpdatingStatus}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                  {t('common.delete')}
                </Button>
              </div>
            </div>
          ) : (
            <table className="w-full table-fixed">
              <thead>
                <tr className="flex h-[48px]">
                  <th className="px-4 py-3 flex-[0_0_40px] flex items-center">
                    <input
                      type="checkbox"
                      checked={allSelected && drivers.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_15%] whitespace-nowrap flex items-center">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_18%] whitespace-nowrap flex items-center">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_12%] whitespace-nowrap flex items-center">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_12%] whitespace-nowrap flex items-center">
                    License
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_12%] whitespace-nowrap flex items-center">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_12%] whitespace-nowrap flex items-center">
                    Onboarding
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_10%] whitespace-nowrap flex items-center">
                    Salary
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)] flex-[0_0_9%] whitespace-nowrap flex items-center">
                    Created
                  </th>
                </tr>
              </thead>
            </table>
          )}
        </div>
      </div>
    );
  };

  // Render body content
  const renderBodyContent = () => {
    // Driver Details View
    if (driverId) {
      if (isLoadingDetails) {
        return (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <UserDetailsSkeleton />
          </div>
        );
      }

      if (detailsError || !driverDetails) {
        return (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <p className="text-lg font-medium text-[var(--color-text-primary)] mb-2">{t('common.error')}</p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                {detailsError || t('driver.details.notFound')}
              </p>
              <button
                onClick={handleBack}
                className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                {t('common.goBack')}
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="flex-1 min-h-0">
          <AdminDriverDetailsView
            driverDetails={driverDetails}
            onStatusChange={refetchDriverDetails}
            onUpdate={refetchDriverDetails}
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
        <table className="w-full table-fixed min-w-[1000px]">
          <tbody className="block">
            {drivers.map((driver) => (
              <AdminDriversTableRow
                key={driver.driverId}
                driver={driver}
                searchQuery="" // Will be passed from parent
                isSelected={selectedDriverIds.has(driver.driverId)}
                onSelectChange={(isSelected) => handleSelectDriver(driver.driverId, isSelected)}
                onRowClick={() => navigate(ROUTES.admin.driverDetails(driver.driverId))}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col h-full min-h-0">
        <div className="flex flex-col flex-1 min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] overflow-hidden">
          {renderTableHeader()}
          {renderBodyContent()}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {driverId && driverDetails && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title={t('driver.delete.title')}
          message={t('driver.delete.message', { driverName: driverDetails.fullName })}
          warning={t('driver.delete.warning')}
          confirmText={t('common.deleteDriver')}
          cancelText={t('common.cancel')}
          isLoading={deleteDriverMutation.isPending}
          variant="danger"
        />
      )}

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={handleBulkDelete}
        title={t('driver.bulkDelete.title')}
        message={t('driver.bulkDelete.message', { count: selectedDriverIds.size })}
        warning={t('driver.bulkDelete.warning')}
        confirmText={t('driver.bulkDelete.confirm', { count: selectedDriverIds.size })}
        cancelText={t('common.cancel')}
        isLoading={isBulkDeleting}
        variant="danger"
      />

      {/* Bulk Status Update Confirmation Modal */}
      {pendingBulkStatus && (
        <ConfirmationModal
          isOpen={showBulkStatusModal}
          onClose={() => {
            setShowBulkStatusModal(false);
            setPendingBulkStatus(null);
          }}
          onConfirm={handleBulkStatusChange}
          title={t('driver.bulkStatus.title')}
          message={t('driver.bulkStatus.message', { count: selectedDriverIds.size, status: getStatusLabel(pendingBulkStatus) })}
          warning={
            pendingBulkStatus === DriverStatus.BLOCKED
              ? t('driver.status.warning.blocked')
              : pendingBulkStatus === DriverStatus.SUSPENDED
              ? t('driver.status.warning.suspended')
              : undefined
          }
          confirmText={t('driver.bulkStatus.confirm', { count: selectedDriverIds.size })}
          cancelText={t('common.cancel')}
          isLoading={isBulkUpdatingStatus}
          variant={pendingBulkStatus === DriverStatus.BLOCKED || pendingBulkStatus === DriverStatus.SUSPENDED ? 'warning' : 'info'}
        />
      )}
    </>
  );
};

