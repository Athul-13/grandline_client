import { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { formatDate } from '../../../utils/quote_formatters';
import { UserStatusBadge } from '../user_status_badge';
import { useChangeUserStatus } from '../../../hooks/users/use_change_user_status';
import { UserStatus, type UserStatusType } from '../../../types/users/admin_user';
import { ConfirmationModal } from '../../common/modals/confirmation_modal';
import toast from 'react-hot-toast';
import { cn } from '../../../utils/cn';
import type { AdminUserDetails } from '../../../types/users/admin_user';

interface AccountInfoBentoCardProps {
  userDetails: AdminUserDetails;
  onStatusChange?: () => void; // Callback to refetch user details after status change
}

/**
 * Account Info Bento Card Component
 * Displays account status, verification, and timestamps
 * Allows admin to change user status
 */
export const AccountInfoBentoCard: React.FC<AccountInfoBentoCardProps> = ({ userDetails, onStatusChange }) => {
  const { changeStatus, isLoading: isChangingStatus } = useChangeUserStatus();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<UserStatusType | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    };

    if (showStatusDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);

  // Get available statuses (all except current)
  const availableStatuses = Object.values(UserStatus).filter(
    (status) => status !== userDetails.status
  );

  const getStatusLabel = (status: UserStatusType): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleStatusOptionClick = (newStatus: UserStatusType) => {
    setPendingStatus(newStatus);
    setShowConfirmation(true);
    setShowStatusDropdown(false);
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingStatus) return;

    try {
      const response = await changeStatus(userDetails.userId, { status: pendingStatus });
      
      if (response && response.success && response.user) {
        toast.success(response.message || 'User status updated successfully');
        
        // Refetch user details to get updated data
        if (onStatusChange) {
          setTimeout(async () => {
            await onStatusChange();
          }, 200);
        }
      } else {
        const errorMsg = response?.message || 'Failed to update user status';
        console.error('Status change failed:', response);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error changing user status:', error);
      toast.error('Failed to update user status. Please try again.');
    } finally {
      setShowConfirmation(false);
      setPendingStatus(null);
    }
  };

  const handleCancelStatusChange = () => {
    setShowConfirmation(false);
    setPendingStatus(null);
  };

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Account Information</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="font-medium text-[var(--color-text-secondary)]">Status:</span>
          <div className="mt-1 flex items-center gap-2">
            <UserStatusBadge status={userDetails.status} />
            {availableStatuses.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  disabled={isChangingStatus}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors',
                    'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]',
                    isChangingStatus && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isChangingStatus ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Changing...</span>
                    </>
                  ) : (
                    <>
                      <span>{getStatusLabel(userDetails.status)}</span>
                      {showStatusDropdown ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </>
                  )}
                </button>

                {/* Status Dropdown */}
                {showStatusDropdown && !isChangingStatus && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 p-2">
                    <div className="space-y-1">
                      {availableStatuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusOptionClick(status)}
                          className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--color-bg-secondary)] cursor-pointer transition-colors"
                        >
                          <span className="text-sm text-[var(--color-text-primary)]">
                            {getStatusLabel(status)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={handleCancelStatusChange}
        onConfirm={handleConfirmStatusChange}
        title="Change User Status"
        message={`Are you sure you want to change the user status from "${getStatusLabel(userDetails.status)}" to "${pendingStatus ? getStatusLabel(pendingStatus) : ''}"?`}
        warning={
          pendingStatus === UserStatus.BLOCKED
            ? "Blocking a user will prevent them from accessing their account."
            : pendingStatus === UserStatus.INACTIVE
            ? "Inactivating a user will prevent them from accessing their account."
            : undefined
        }
        confirmText="Change Status"
        cancelText="Cancel"
        isLoading={isChangingStatus}
        variant={pendingStatus === UserStatus.BLOCKED || pendingStatus === UserStatus.INACTIVE ? 'warning' : 'info'}
      />
    </div>
  );
};

