import { Key, Mail, CheckCircle2, XCircle } from 'lucide-react';
import type { AdminUserDetails } from '../../../types/users/admin_user';

interface AuthenticationBentoCardProps {
  userDetails: AdminUserDetails;
}

/**
 * Authentication Bento Card Component
 * Displays authentication methods (password and Google auth)
 */
export const AuthenticationBentoCard: React.FC<AuthenticationBentoCardProps> = ({ userDetails }) => {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Authentication Methods</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              Password Authentication
            </span>
          </div>
          {userDetails.hasPassword ? (
            <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Enabled
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-gray-400 text-sm font-medium">
              <XCircle className="w-4 h-4" />
              Not Set
            </span>
          )}
        </div>
        <div className="flex items-center justify-between p-3 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              Google Authentication
            </span>
          </div>
          {userDetails.hasGoogleAuth ? (
            <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Linked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-gray-400 text-sm font-medium">
              <XCircle className="w-4 h-4" />
              Not Linked
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

