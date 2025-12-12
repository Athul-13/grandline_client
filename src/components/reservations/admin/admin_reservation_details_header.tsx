import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Users, UserCog, Truck, Route, DollarSign, X, Plus, MoreVertical, Download, FileText } from 'lucide-react';
import { Button } from '../../common/ui/button';
import { useExportReservation } from '../../../hooks/reservations/use_export_reservation';
import type { AdminReservationDetailsResponse } from '../../../types/reservations/admin_reservation';

interface AdminReservationDetailsHeaderProps {
  reservationDetails: AdminReservationDetailsResponse;
  isUpdatingStatus: boolean;
  onBack: () => void;
  onStatusChange: (newStatus: string) => Promise<void>;
  availableStatuses: Array<{ value: string; label: string }>;
  onAddPassengers?: () => void;
  onChangeDriver?: () => void;
  onAdjustVehicles?: () => void;
  onUpdateItinerary?: () => void;
  onProcessRefund?: () => void;
  onCancel?: () => void;
  onAddCharge?: () => void;
  onExportPDF?: () => void;
  onExportCSV?: () => void;
}

/**
 * Admin Reservation Details Header Component
 * Displays reservation header with actions
 */
export const AdminReservationDetailsHeader: React.FC<AdminReservationDetailsHeaderProps> = ({
  reservationDetails,
  isUpdatingStatus,
  onBack,
  onStatusChange,
  availableStatuses,
  onAddPassengers,
  onChangeDriver,
  onAdjustVehicles,
  onUpdateItinerary,
  onProcessRefund,
  onCancel,
  onAddCharge,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onExportPDF: _onExportPDF,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onExportCSV: _onExportCSV,
}) => {
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const { exportPDF, exportCSV, isLoading: isExporting } = useExportReservation();

  const canModify = reservationDetails.status !== 'cancelled' && reservationDetails.status !== 'refunded';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowActionsDropdown(false);
      }
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    };

    if (showActionsDropdown || showExportDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActionsDropdown, showExportDropdown]);

  const handleActionClick = (action: () => void) => {
    action();
    setShowActionsDropdown(false);
  };

  return (
    <div className="flex-shrink-0 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
            title="Back to reservations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {reservationDetails.tripName || 'Reservation Details'}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] font-mono">
              {reservationDetails.reservationId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Dropdown */}
          <div className="relative" ref={exportDropdownRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>

            {/* Export Dropdown Menu */}
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 py-1">
                <button
                  onClick={() => {
                    exportPDF(reservationDetails.reservationId);
                    setShowExportDropdown(false);
                  }}
                  disabled={isExporting}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  Export as PDF
                </button>
                <button
                  onClick={() => {
                    exportCSV(reservationDetails.reservationId);
                    setShowExportDropdown(false);
                  }}
                  disabled={isExporting}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  Export as CSV
                </button>
              </div>
            )}
          </div>

          {/* Actions Dropdown */}
          {canModify && (
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                className="flex items-center gap-2"
              >
                <MoreVertical className="w-4 h-4" />
                Actions
              </Button>

              {/* Dropdown Menu */}
              {showActionsDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 py-1">
                  {onAddPassengers && (
                    <button
                      onClick={() => handleActionClick(onAddPassengers)}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      Add Passengers
                    </button>
                  )}
                  {onChangeDriver && (
                    <button
                      onClick={() => handleActionClick(onChangeDriver)}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      <UserCog className="w-4 h-4" />
                      Change Driver
                    </button>
                  )}
                  {onAdjustVehicles && (
                    <button
                      onClick={() => handleActionClick(onAdjustVehicles)}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      <Truck className="w-4 h-4" />
                      Adjust Vehicles
                    </button>
                  )}
                  {onUpdateItinerary && (
                    <button
                      onClick={() => handleActionClick(onUpdateItinerary)}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      <Route className="w-4 h-4" />
                      Update Itinerary
                    </button>
                  )}
                  {onProcessRefund && (
                    <button
                      onClick={() => handleActionClick(onProcessRefund)}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      <DollarSign className="w-4 h-4" />
                      Process Refund
                    </button>
                  )}
                  {onAddCharge && (
                    <button
                      onClick={() => handleActionClick(onAddCharge)}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Charge
                    </button>
                  )}
                  {onCancel && (
                    <>
                      <div className="border-t border-[var(--color-border)] my-1" />
                      <button
                        onClick={() => handleActionClick(onCancel)}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel Reservation
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Status Update Control */}
          {availableStatuses.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-secondary)]">Status:</span>
              <select
                value={reservationDetails.status}
                onChange={(e) => onStatusChange(e.target.value)}
                disabled={isUpdatingStatus}
                className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value={reservationDetails.status}>
                  {reservationDetails.status.charAt(0).toUpperCase() + reservationDetails.status.slice(1)}
                </option>
                {availableStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

