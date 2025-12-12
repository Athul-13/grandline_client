import { useState } from 'react';
import { X, User, DollarSign } from 'lucide-react';
import { useAdminDriversList } from '../../../hooks/drivers/use_admin_drivers_list';
import { DriverStatus } from '../../../types/drivers/admin_driver';
import { formatPrice } from '../../../utils/quote_formatters';
import { Button } from '../../common/ui/button';

interface DriverAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (driverId: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Driver Assignment Modal Component
 * Displays available drivers for assignment to a quote
 */
export const DriverAssignmentModal: React.FC<DriverAssignmentModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  isLoading = false,
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch available drivers (status: available, isOnboarded: true)
  const { drivers, isLoading: isLoadingDrivers } = useAdminDriversList({
    status: [DriverStatus.AVAILABLE],
    isOnboarded: true,
    search: searchQuery || undefined,
    limit: 50, // Get more drivers for selection
  });

  if (!isOpen) return null;

  const handleAssign = async () => {
    if (selectedDriverId) {
      await onAssign(selectedDriverId);
      setSelectedDriverId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Assign Driver
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
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
              {drivers.map((driver) => (
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
                        <p className="font-semibold text-[var(--color-text-primary)]">
                          {driver.fullName}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {driver.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm text-[var(--color-text-secondary)]">Rate</p>
                        <p className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatPrice(driver.salary)}/hr
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-border)]">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedDriverId || isLoading}
            className="bg-[var(--color-primary)] text-white hover:opacity-90"
          >
            {isLoading ? 'Assigning...' : 'Assign Driver'}
          </Button>
        </div>
      </div>
    </div>
  );
};
