import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { formatDate } from '../../../utils/quote_formatters';
import { UserStatusBadge } from '../user_status_badge';
import type { AdminUserDetails } from '../../../types/users/admin_user';

interface AccountInfoBentoCardProps {
  userDetails: AdminUserDetails;
}

/**
 * Account Info Bento Card Component
 * Displays account status, verification, and timestamps
 */
export const AccountInfoBentoCard: React.FC<AccountInfoBentoCardProps> = ({ userDetails }) => {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Account Information</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Status:</span>
          <div className="mt-1">
            <UserStatusBadge status={userDetails.status} />
          </div>
        </div>
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Verified:</span>
          <div className="mt-1">
            {userDetails.isVerified ? (
              <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-gray-400 text-sm font-medium">
                <XCircle className="w-4 h-4" />
                Unverified
              </span>
            )}
          </div>
        </div>
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Created:</span>
          <p className="mt-1 text-[var(--color-text-primary)]">
            {formatDate(userDetails.createdAt)}
          </p>
        </div>
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Last Updated:</span>
          <p className="mt-1 text-[var(--color-text-primary)]">
            {formatDate(userDetails.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

