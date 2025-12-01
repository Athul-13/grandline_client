import { useState } from 'react';
import { User, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import type { AdminUserDetails } from '../../../types/users/admin_user';

interface ProfileBentoCardProps {
  userDetails: AdminUserDetails;
}

/**
 * Profile Bento Card Component
 * Displays user profile picture, basic info, user ID (with copy), and role
 */
export const ProfileBentoCard: React.FC<ProfileBentoCardProps> = ({ userDetails }) => {
  const [copiedUserId, setCopiedUserId] = useState(false);

  const truncateUserId = (userId: string): string => {
    if (userId.length <= 16) return userId;
    return `${userId.slice(0, 8)}...${userId.slice(-4)}`;
  };

  const handleCopyUserId = async () => {
    try {
      await navigator.clipboard.writeText(userDetails.userId);
      setCopiedUserId(true);
      toast.success('User ID copied to clipboard');
      setTimeout(() => setCopiedUserId(false), 2000);
    } catch {
      toast.error('Failed to copy user ID');
    }
  };

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Profile & Basic Information</h3>
      </div>
      <div className="flex flex-col items-center gap-4">
        {userDetails.profilePicture ? (
          <img
            src={userDetails.profilePicture}
            alt={userDetails.fullName}
            className="w-32 h-32 rounded-full object-cover border-2 border-[var(--color-border)]"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center border-2 border-[var(--color-border)]">
            <span className="text-4xl font-semibold text-[var(--color-primary)]">
              {userDetails.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="w-full space-y-3 text-sm text-center">
          <div>
            <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
              {userDetails.fullName}
            </h4>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="font-medium text-[var(--color-text-secondary)]">User ID:</span>
            <div className="flex items-center gap-1">
              <span className="text-[var(--color-text-primary)] font-mono text-xs">
                {truncateUserId(userDetails.userId)}
              </span>
              <button
                onClick={handleCopyUserId}
                className={copiedUserId ? 'text-green-500' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors'}
                title="Copy user ID"
              >
                {copiedUserId ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <span className="font-medium text-[var(--color-text-secondary)]">Role:</span>
            <p className="mt-1 text-[var(--color-text-primary)] capitalize">
              {userDetails.role}
            </p>
          </div>
        </div>
        <div className="w-full border-t border-[var(--color-border)] pt-3 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-left">
            <div>
              <span className="font-medium text-[var(--color-text-secondary)]">Email:</span>
              <p className="mt-1 text-[var(--color-text-primary)] break-all">
                {userDetails.email}
              </p>
            </div>
            <div>
              <span className="font-medium text-[var(--color-text-secondary)]">Phone Number:</span>
              <p className="mt-1 text-[var(--color-text-primary)]">
                {userDetails.phoneNumber || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

