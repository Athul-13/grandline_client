import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/ui/button';
import { Pagination } from '../common/ui/pagination';
import { ConfirmationModal } from '../common/modals/confirmation_modal';
import { usePricingConfigHistory } from '../../hooks/pricing_config/use_pricing_config_history';
import { useActivatePricingConfig } from '../../hooks/pricing_config/use_activate_pricing_config';
import { useActivePricingConfig } from '../../hooks/pricing_config/use_active_pricing_config';
import type { PricingConfigResponse } from '../../types/quotes/pricing_config';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface PricingConfigHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshTrigger?: number; // When this changes, refetch history
}

/**
 * Pricing Configuration History Modal Component
 * Displays all pricing configuration versions in a table with pagination
 * Active version is always shown first
 */
export const PricingConfigHistoryModal: React.FC<PricingConfigHistoryModalProps> = ({
  isOpen,
  onClose,
  refreshTrigger,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [configToActivate, setConfigToActivate] = useState<PricingConfigResponse | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const itemsPerPage = 15;

  const { pricingConfigs, pagination, isLoading, error, refetch } = usePricingConfigHistory({
    page: currentPage,
    limit: itemsPerPage,
  });

  const { refetch: refetchActive } = useActivePricingConfig();
  const { activatePricingConfig, isLoading: isActivating } = useActivatePricingConfig();

  // Reset page and refetch when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setConfigToActivate(null);
      setShowConfirmModal(false);
      // Refetch history when modal opens to get latest data
      refetch();
    }
  }, [isOpen, refetch]);

  // Refetch when refreshTrigger changes (e.g., when new config is created)
  useEffect(() => {
    if (isOpen && refreshTrigger !== undefined && refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, isOpen, refetch]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle keyboard escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showConfirmModal) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, showConfirmModal, onClose]);

  // Sort configs: active first, then by version descending
  const sortedConfigs = [...pricingConfigs].sort((a, b) => {
    if (a.isActive) return -1;
    if (b.isActive) return 1;
    return b.version - a.version;
  });

  // Format date
  const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle activate button click
  const handleActivateClick = (config: PricingConfigResponse) => {
    setConfigToActivate(config);
    setShowConfirmModal(true);
  };

  // Handle confirmation
  const handleConfirmActivate = async () => {
    if (!configToActivate) return;

    const result = await activatePricingConfig(configToActivate.pricingConfigId);

    if (result) {
      toast.success('Pricing configuration activated successfully');
      // Refetch both history and active config to ensure UI is updated
      await Promise.all([refetch(), refetchActive()]);
      setShowConfirmModal(false);
      setConfigToActivate(null);
    } else {
      toast.error('Failed to activate pricing configuration');
    }
  };

  // Handle cancel in confirmation modal
  const handleCancelActivate = () => {
    setShowConfirmModal(false);
    setConfigToActivate(null);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget && !showConfirmModal) {
            onClose();
          }
        }}
      >
        {/* Modal Content */}
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col border border-[var(--color-border)]">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] flex-shrink-0">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              Pricing Configuration History
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              disabled={showConfirmModal}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            ) : sortedConfigs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[var(--color-text-secondary)]">No pricing configurations found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                        Version
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                        Fuel Price
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                        Driver Rate
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                        Tax %
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                        Night Charge
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                        Created At
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-primary)]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedConfigs.map((config) => (
                      <tr
                        key={config.pricingConfigId}
                        className={cn(
                          'border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]',
                          config.isActive && 'bg-[var(--color-primary)]/10'
                        )}
                      >
                        <td className="py-3 px-4 text-sm text-[var(--color-text-primary)]">
                          {config.version}
                        </td>
                        <td className="py-3 px-4 text-sm text-[var(--color-text-primary)]">
                          ₹{config.fuelPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/L
                        </td>
                        <td className="py-3 px-4 text-sm text-[var(--color-text-primary)]">
                          ₹{config.averageDriverPerHourRate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/hr
                        </td>
                        <td className="py-3 px-4 text-sm text-[var(--color-text-primary)]">
                          {config.taxPercentage.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                        </td>
                        <td className="py-3 px-4 text-sm text-[var(--color-text-primary)]">
                          ₹{config.nightChargePerNight.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/night
                        </td>
                        <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)]">
                          {formatDate(config.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {config.isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {!config.isActive && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleActivateClick(config)}
                              disabled={isActivating}
                            >
                              Activate
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal Footer with Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="border-t border-[var(--color-border)] p-4 flex-shrink-0">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelActivate}
        onConfirm={handleConfirmActivate}
        title="Activate Pricing Configuration"
        message={
          configToActivate
            ? `Are you sure you want to activate version ${configToActivate.version}? This will make it the active pricing configuration.`
            : 'Are you sure you want to activate this pricing configuration?'
        }
        confirmText="Activate"
        cancelText="Cancel"
        variant="info"
        isLoading={isActivating}
      />
    </>
  );
};

