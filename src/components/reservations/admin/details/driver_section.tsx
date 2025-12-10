import { FilterSection } from '../../../common/filters/filter_section';
import { Mail, Phone, CreditCard } from 'lucide-react';
import { formatDateTime } from '../../../../utils/quote_formatters';
import type { AdminReservationDetailsResponse } from '../../../../types/reservations/admin_reservation';

interface DriverSectionProps {
  reservationDetails: AdminReservationDetailsResponse;
  isExpanded: boolean;
  onToggle: () => void;
  onChangeDriverClick?: () => void;
}

/**
 * Driver Section Component
 * Displays driver information with change driver action
 */
export const DriverSection: React.FC<DriverSectionProps> = ({
  reservationDetails,
  isExpanded,
  onToggle,
  onChangeDriverClick,
}) => {
  const driver = reservationDetails.driver;

  return (
    <FilterSection
      title="Driver Information"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {driver ? (
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

          {/* Change Driver Button */}
          {onChangeDriverClick && (
            <div className="pt-2">
              <button
                onClick={onChangeDriverClick}
                className="w-full px-4 py-2 text-sm border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors"
              >
                Change Driver
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-[var(--color-text-secondary)]">
            No driver assigned yet
          </p>
          {onChangeDriverClick && (
            <button
              onClick={onChangeDriverClick}
              className="w-full px-4 py-2 text-sm border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors"
            >
              Assign Driver
            </button>
          )}
        </div>
      )}
    </FilterSection>
  );
};

