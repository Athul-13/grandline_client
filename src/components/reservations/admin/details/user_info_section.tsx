import { FilterSection } from '../../../common/filters/filter_section';
import type { AdminReservationDetailsResponse } from '../../../../types/reservations/admin_reservation';

interface UserInfoSectionProps {
  reservationDetails: AdminReservationDetailsResponse;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * User Information Section Component
 * Displays user information
 */
export const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  reservationDetails,
  isExpanded,
  onToggle,
}) => {
  if (!reservationDetails.user) {
    return null;
  }

  return (
    <FilterSection
      title="User Information"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Name:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {reservationDetails.user.fullName}
          </span>
        </div>
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Email:</span>
          <span className="ml-2 text-[var(--color-text-primary)]">
            {reservationDetails.user.email}
          </span>
        </div>
        {reservationDetails.user.phoneNumber && (
          <div>
            <span className="font-medium text-[var(--color-text-secondary)]">Phone:</span>
            <span className="ml-2 text-[var(--color-text-primary)]">
              {reservationDetails.user.phoneNumber}
            </span>
          </div>
        )}
      </div>
    </FilterSection>
  );
};

