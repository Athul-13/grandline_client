import type { AdminUserDetails } from '../../types/users/admin_user';
import { ProfileBentoCard } from './details/profile_bento_card';
import { AccountInfoBentoCard } from './details/account_info_bento_card';
import { AuthenticationBentoCard } from './details/authentication_bento_card';

interface AdminUserDetailsViewProps {
  userDetails: AdminUserDetails;
}

/**
 * User Details View Component
 * Bento-style layout for displaying all user details
 * Note: Header is handled by AdminUsersTable component
 */
export const AdminUserDetailsView: React.FC<AdminUserDetailsViewProps> = ({
  userDetails,
}) => {
  if (!userDetails) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--color-text-secondary)]">User details not available.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
        {/* Left Column: Profile & Basic Info */}
        <div className="flex flex-col gap-4">
          <div>
            <ProfileBentoCard userDetails={userDetails} />
          </div>
        </div>

        {/* Right Column: Account Info and Authentication */}
        <div className="flex flex-col gap-4">
          <div>
            <AccountInfoBentoCard userDetails={userDetails} />
          </div>
          <div>
            <AuthenticationBentoCard userDetails={userDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

