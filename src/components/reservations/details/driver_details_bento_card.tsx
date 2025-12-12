import { User, Mail, Phone, CreditCard } from 'lucide-react';
import type { ReservationResponse } from '../../../types/reservations/reservation';
import { formatDateTime } from '../../../utils/quote_formatters';

interface DriverDetailsBentoCardProps {
  reservationDetails: ReservationResponse;
}

/**
 * Driver Details Bento Card Component
 * Displays driver information for a reservation
 */
export const DriverDetailsBentoCard: React.FC<DriverDetailsBentoCardProps> = ({
  reservationDetails,
}) => {
  const driver = reservationDetails.driver;

  if (!driver) {
    return (
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Driver Details</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-[var(--color-text-secondary)]">
            No driver assigned yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Driver Details</h3>
      </div>
      
      <div className="space-y-4">
        {/* Driver Profile Picture */}
        {driver.profilePictureUrl && (
          <div className="flex justify-center">
            <img
              src={driver.profilePictureUrl}
              alt={driver.fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-[var(--color-border)]"
            />
          </div>
        )}

        {/* Driver Name */}
        <div>
          <h4 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">
            {driver.fullName}
          </h4>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="text-[var(--color-text-primary)]">{driver.email}</span>
          </div>
          {driver.phoneNumber && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-[var(--color-text-secondary)]" />
              <span className="text-[var(--color-text-primary)]">{driver.phoneNumber}</span>
            </div>
          )}
          {driver.licenseNumber && (
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4 text-[var(--color-text-secondary)]" />
              <span className="text-[var(--color-text-primary)]">License: {driver.licenseNumber}</span>
            </div>
          )}
        </div>

        {/* Driver Change Info */}
        {reservationDetails.driverChangedAt && (
          <div className="pt-2 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-secondary)]">
              Driver changed on {formatDateTime(reservationDetails.driverChangedAt)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
