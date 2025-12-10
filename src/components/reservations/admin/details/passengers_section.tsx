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
        <div className="space-y-3">
          {reservationDetails.passengers.map((passenger) => (
            <div
              key={passenger.passengerId}
              className="p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)]"
            >
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-[var(--color-text-secondary)]">Name:</span>
                  <span className="ml-2 text-[var(--color-text-primary)] font-medium">
                    {passenger.fullName}
                  </span>
                </div>
                {passenger.phoneNumber && (
                  <div>
                    <span className="text-[var(--color-text-secondary)]">Phone:</span>
                    <span className="ml-2 text-[var(--color-text-primary)]">
                      {passenger.phoneNumber}
                    </span>
                  </div>
                )}
                {passenger.age !== undefined && (
                  <div>
                    <span className="text-[var(--color-text-secondary)]">Age:</span>
                    <span className="ml-2 text-[var(--color-text-primary)]">
                      {passenger.age} years
                    </span>
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

