import React, { useState } from 'react';
import { FilterSection } from '../../../common/filters/filter_section';
import { formatDate } from '../../../../utils/quote_formatters';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { AdminReservationDetailsResponse } from '../../../../types/reservations/admin_reservation';


interface ModificationsSectionProps {
  reservationDetails: AdminReservationDetailsResponse;
  isExpanded: boolean;
  onToggle: () => void;
}

interface ModificationItemProps {
  mod: NonNullable<AdminReservationDetailsResponse['modifications']>[0];
}

/**
 * Individual modification item component
 * Uses hooks properly at component level
 */
const ModificationItem: React.FC<ModificationItemProps> = ({ mod }) => {
  const [showDetails, setShowDetails] = useState(false);
  const hasMetadata = mod.metadata && Object.keys(mod.metadata).length > 0;

  return (
    <div className="p-3 bg-[var(--color-bg-secondary)] rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--color-text-primary)] capitalize">
            {mod.modificationType.replace('_', ' ')}
          </span>
          {hasMetadata && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-1 hover:bg-[var(--color-bg-hover)] rounded transition-colors"
              title="Toggle details"
            >
              {showDetails ? (
                <ChevronDown className="w-4 h-4 text-[var(--color-text-secondary)]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
              )}
            </button>
          )}
        </div>
        <span className="text-xs text-[var(--color-text-secondary)]">
          {formatDate(mod.createdAt)}
        </span>
      </div>
      <p className="text-sm text-[var(--color-text-primary)] mb-2">{mod.description}</p>
      {mod.previousValue && mod.newValue && (
        <div className="text-xs text-[var(--color-text-secondary)] mb-2">
          <span className="line-through opacity-75">{mod.previousValue}</span>
          {' → '}
          <span className="font-medium">{mod.newValue}</span>
        </div>
      )}
      {mod.modifiedBy && (
        <div className="text-xs text-[var(--color-text-secondary)] mb-2">
          Modified by: <span className="font-mono">{mod.modifiedBy}</span>
        </div>
      )}
      {showDetails && hasMetadata && (
        <div className="mt-2 pt-2 border-t border-[var(--color-border)]">
          <div className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">Additional Details:</div>
          <div className="space-y-1">
            {Object.entries(mod.metadata || {}).map(([key, value]) => (
              <div key={key} className="text-xs text-[var(--color-text-secondary)]">
                <span className="capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                <span className="text-[var(--color-text-primary)]">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Modification History Section Component
 * Displays modification history for the reservation
 */
export const ModificationsSection: React.FC<ModificationsSectionProps> = ({
  reservationDetails,
  isExpanded,
  onToggle,
}) => {
  if (!reservationDetails.modifications || reservationDetails.modifications.length === 0) {
    return null;
  }

  return (
    <FilterSection
      title={`Modification History (${reservationDetails.modifications.length})`}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-3">
        {reservationDetails.modifications.map((mod) => (
          <ModificationItem key={mod.modificationId} mod={mod} />
        ))}
      </div>
    </FilterSection>
  );
};

