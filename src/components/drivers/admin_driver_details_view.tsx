import type { AdminDriverDetails } from '../../types/drivers/admin_driver';
import { DriverBasicInfoSection } from './details/driver_basic_info_section';
import { DriverStatusSection } from './details/driver_status_section';
import { DriverOnboardingSection } from './details/driver_onboarding_section';

interface AdminDriverDetailsViewProps {
  driverDetails: AdminDriverDetails;
  onStatusChange?: () => void; // Callback to refetch driver details after status change
}

/**
 * Driver Details View Component
 * Bento-style layout for displaying all driver details
 * Note: Header is handled by AdminDriversTable component
 */
export const AdminDriverDetailsView: React.FC<AdminDriverDetailsViewProps> = ({
  driverDetails,
  onStatusChange,
}) => {
  if (!driverDetails) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--color-text-secondary)]">Driver details not available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
          {/* Left Column: Profile & Basic Info */}
          <div className="flex flex-col gap-4">
            <div>
              <DriverBasicInfoSection driverDetails={driverDetails} />
            </div>
          </div>

          {/* Right Column: Status and Onboarding */}
          <div className="flex flex-col gap-4">
            <div>
              <DriverStatusSection driverDetails={driverDetails} onStatusChange={onStatusChange} />
            </div>
            <div>
              <DriverOnboardingSection driverDetails={driverDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

