import { FilterSection } from '../../../common/filters/filter_section';
import { formatDate } from '../../../../utils/quote_formatters';
import type { AdminReservationDetailsResponse } from '../../../../types/reservations/admin_reservation';

interface ModificationsSectionProps {
  reservationDetails: AdminReservationDetailsResponse;
  isExpanded: boolean;
  onToggle: () => void;
}

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
      <div className="space-y-2">
        {reservationDetails.modifications.map((mod) => (
          <div key={mod.modificationId} className="p-3 bg-[var(--color-bg-secondary)] rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[var(--color-text-primary)] capitalize">
                {mod.modificationType.replace('_', ' ')}
              </span>
              <span className="text-xs text-[var(--color-text-secondary)]">
                {formatDate(mod.createdAt)}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-primary)] mb-1">{mod.description}</p>
            {mod.previousValue && mod.newValue && (
              <div className="text-xs text-[var(--color-text-secondary)]">
                <span className="line-through">{mod.previousValue}</span>
                {' → '}
                <span>{mod.newValue}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </FilterSection>
  );
};

