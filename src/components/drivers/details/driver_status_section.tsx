import { useState, useEffect, useRef } from 'react';
import { Activity, Clock, ShieldOff, Ban, XCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { DriverStatusBadge } from '../driver_status_badge';
import { useUpdateDriverStatus } from '../../../hooks/drivers/use_update_driver_status';
import { DriverStatus, type DriverStatusType } from '../../../types/drivers/admin_driver';
import { ConfirmationModal } from '../../common/modals/confirmation_modal';
import { cn } from '../../../utils/cn';
import type { AdminDriverDetails } from '../../../types/drivers/admin_driver';

interface DriverStatusSectionProps {
  driverDetails: AdminDriverDetails;
  onStatusChange?: () => void; // Callback to refetch driver details after status change
}

/**
 * Driver Status Section Component
 * Displays driver status information and allows admin to change status
 */
export const DriverStatusSection: React.FC<DriverStatusSectionProps> = ({
  driverDetails,
  onStatusChange,
}) => {
  const updateStatusMutation = useUpdateDriverStatus({
    driverId: driverDetails.driverId,
    onSuccess: onStatusChange,
  });
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<DriverStatusType | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    };

    if (showStatusDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);

  // Get available statuses (all except current)
  const availableStatuses = Object.values(DriverStatus).filter(
    (status) => status !== driverDetails.status
  );

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

  const getStatusLabel = (status: DriverStatusType): string => {
    const labels: Record<DriverStatusType, string> = {
      [DriverStatus.AVAILABLE]: 'Available',
      [DriverStatus.ON_TRIP]: 'On Trip',
      [DriverStatus.OFFLINE]: 'Offline',
      [DriverStatus.SUSPENDED]: 'Suspended',
      [DriverStatus.BLOCKED]: 'Blocked',
    };
    return labels[status] || status;
  };

  const handleStatusOptionClick = (newStatus: DriverStatusType) => {
    setPendingStatus(newStatus);
    setShowConfirmation(true);
    setShowStatusDropdown(false);
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingStatus) return;

    try {
      await updateStatusMutation.mutateAsync({ status: pendingStatus });
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setShowConfirmation(false);
      setPendingStatus(null);
    }
  };

  const handleCancelStatusChange = () => {
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  return (
    <>
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
        <div className="flex items-center gap-2 mb-4">
          {getStatusIcon(driverDetails.status)}
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Status</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Current Status</p>
            <div className="flex items-center gap-2">
              <DriverStatusBadge status={driverDetails.status} />
              {availableStatuses.length > 0 && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    disabled={updateStatusMutation.isPending}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors',
                      'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]',
                      updateStatusMutation.isPending && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {updateStatusMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Changing...</span>
                      </>
                    ) : (
                      <>
                        <span>{getStatusLabel(driverDetails.status)}</span>
                        {showStatusDropdown ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>

                  {/* Status Dropdown */}
                  {showStatusDropdown && !updateStatusMutation.isPending && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 p-2">
                      <div className="space-y-1">
                        {availableStatuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusOptionClick(status)}
                            className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--color-bg-secondary)] cursor-pointer transition-colors"
                          >
                            {getStatusIcon(status)}
                            <span className="text-sm text-[var(--color-text-primary)]">
                              {getStatusLabel(status)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Status Information</p>
            <p className="text-sm text-[var(--color-text-primary)]">
              {driverDetails.status === DriverStatus.AVAILABLE && 'Driver is available and can accept trips.'}
              {driverDetails.status === DriverStatus.ON_TRIP && 'Driver is currently on a trip.'}
              {driverDetails.status === DriverStatus.OFFLINE && 'Driver is offline and cannot accept trips.'}
              {driverDetails.status === DriverStatus.SUSPENDED && 'Driver account is suspended. Cannot accept trips.'}
              {driverDetails.status === DriverStatus.BLOCKED && 'Driver account is blocked. Cannot login or accept trips.'}
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleCancelStatusChange}
        onConfirm={handleConfirmStatusChange}
        title="Change Driver Status"
        message={`Are you sure you want to change the driver status from "${getStatusLabel(driverDetails.status)}" to "${pendingStatus ? getStatusLabel(pendingStatus) : ''}"?`}
        warning={
          pendingStatus === DriverStatus.BLOCKED
            ? "Blocking a driver will prevent them from accessing their account and accepting trips."
            : pendingStatus === DriverStatus.SUSPENDED
            ? "Suspending a driver will prevent them from accepting trips."
            : undefined
        }
        confirmText="Change Status"
        cancelText="Cancel"
        isLoading={updateStatusMutation.isPending}
        variant={pendingStatus === DriverStatus.BLOCKED || pendingStatus === DriverStatus.SUSPENDED ? 'warning' : 'info'}
      />
    </>
  );
};

