import { Activity } from 'lucide-react';
import { DriverStatusBadge } from '../driver_status_badge';
import type { AdminDriverDetails } from '../../../types/drivers/admin_driver';

interface DriverStatusSectionProps {
  driverDetails: AdminDriverDetails;
  onStatusChange?: () => void; // Callback to refetch driver details after status change
}

/**
 * Driver Status Section Component
 * Displays driver status information
 * TODO: Add status update functionality in next commit
 */
export const DriverStatusSection: React.FC<DriverStatusSectionProps> = ({
  driverDetails,
  onStatusChange,
}) => {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Status</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-xs text-[var(--color-text-secondary)] mb-2">Current Status</p>
          <DriverStatusBadge status={driverDetails.status} />
        </div>
        
        <div className="pt-4 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-secondary)] mb-2">Status Information</p>
          <p className="text-sm text-[var(--color-text-primary)]">
            {driverDetails.status === 'available' && 'Driver is available and can accept trips.'}
            {driverDetails.status === 'ontrip' && 'Driver is currently on a trip.'}
            {driverDetails.status === 'offline' && 'Driver is offline and cannot accept trips.'}
            {driverDetails.status === 'suspended' && 'Driver account is suspended. Cannot accept trips.'}
            {driverDetails.status === 'blocked' && 'Driver account is blocked. Cannot login or accept trips.'}
          </p>
        </div>
      </div>
    </div>
  );
};

