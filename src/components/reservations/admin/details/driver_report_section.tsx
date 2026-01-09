/**
 * Driver Report Section Component
 * Displays driver trip report in admin reservation details view
 */

import React from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import type { AdminReservationDetailsResponse } from '../../../../types/reservations/admin_reservation';

interface DriverReportSectionProps {
  reservationDetails: AdminReservationDetailsResponse;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Format date for display
 */
const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const DriverReportSection: React.FC<DriverReportSectionProps> = ({
  reservationDetails,
  isExpanded,
  onToggle,
}) => {
  // Only show if report exists
  if (!reservationDetails.driverReport) {
    return null;
  }

  const { driverReport } = reservationDetails;

  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Driver Report</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Submitted {formatDate(driverReport.submittedAt)}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-[var(--color-text-secondary)]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed">
              {driverReport.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

