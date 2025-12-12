import { useState } from 'react';
import { X, User } from 'lucide-react';
import { useAdminDriversList } from '../../../../hooks/drivers/use_admin_drivers_list';
import { DriverStatus } from '../../../../types/drivers/admin_driver';
import { Button } from '../../../common/ui/button';

interface ChangeDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: (driverId: string, reason?: string) => Promise<void>;
  isLoading?: boolean;
  currentDriverId?: string;
}

/**
 * Change Driver Modal Component
 * Allows admin to change the driver for a reservation
 */
export const ChangeDriverModal: React.FC<ChangeDriverModalProps> = ({
  isOpen,
  onClose,
  onChange,
  isLoading = false,
  currentDriverId,
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [reason, setReason] = useState('');

  // Fetch available drivers
  const { drivers, isLoading: isLoadingDrivers } = useAdminDriversList({
    status: [DriverStatus.AVAILABLE],
    isOnboarded: true,
    search: searchQuery || undefined,
    limit: 50,
  });

  if (!isOpen) return null;

  const handleChange = async () => {
    if (selectedDriverId) {
      await onChange(selectedDriverId, reason.trim() || undefined);
      setSelectedDriverId(null);
      setReason('');
    }
  };

  const handleClose = () => {
    setSelectedDriverId(null);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Change Driver
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[var(--color-border)]">
          <input
            type="text"
            placeholder="Search drivers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
        </div>

        {/* Driver List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoadingDrivers ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto"></div>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Loading drivers...</p>
            </div>
          ) : drivers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-[var(--color-text-secondary)]">No available drivers found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {drivers
                .filter((driver) => driver.driverId !== currentDriverId)
                .map((driver) => (
                  <button
                    key={driver.driverId}
                    onClick={() => setSelectedDriverId(driver.driverId)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedDriverId === driver.driverId
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">
                            {driver.fullName}
                          </p>
                          <p className="text-xs text-[var(--color-text-secondary)]">{driver.email}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Reason Input */}
        <div className="p-4 border-t border-[var(--color-border)]">
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Reason (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for driver change..."
            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-border)]">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleChange}
            disabled={isLoading || !selectedDriverId}
          >
            {isLoading ? 'Changing...' : 'Change Driver'}
          </Button>
        </div>
      </div>
    </div>
  );
};

