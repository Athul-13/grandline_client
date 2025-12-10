import { FilterSection } from '../../../common/filters/filter_section';
import type { AdminReservationDetailsResponse } from '../../../../types/reservations/admin_reservation';

interface PassengersSectionProps {
  reservationDetails: AdminReservationDetailsResponse;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Passengers Section Component
 * Displays passenger information for a reservation
 */
export const PassengersSection: React.FC<PassengersSectionProps> = ({
  reservationDetails,
  isExpanded,
  onToggle,
}) => {
  return (
    <FilterSection
      title="Passengers"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {reservationDetails.passengers && reservationDetails.passengers.length > 0 ? (
        <div className="space-y-2">
          {reservationDetails.passengers.map((passenger) => (
            <div
              key={passenger.passengerId}
              className="p-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)]"
            >
              <div className="flex items-center gap-4 text-sm">
                <div className="flex-1">
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {passenger.fullName}
                  </span>
                </div>
                {passenger.phoneNumber && (
                  <div className="text-[var(--color-text-secondary)]">
                    <span className="text-xs">{passenger.phoneNumber}</span>
                  </div>
                )}
                {passenger.age !== undefined && (
                  <div className="text-[var(--color-text-secondary)]">
                    <span className="text-xs">{passenger.age} years</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {reservationDetails.passengerCount && reservationDetails.passengerCount > 0
            ? `Passenger count: ${reservationDetails.passengerCount} (details not available)`
            : 'No passengers listed'}
        </p>
      )}
    </FilterSection>
  );
};

