import { UserStatus, type UserStatusType } from '../../types/users/admin_user';
import { cn } from '../../utils/cn';

interface UserStatusBadgeProps {
  status: UserStatusType;
}

/**
 * User Status Badge Component
 * Displays user status with appropriate color coding
 */
export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: UserStatusType): string => {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case UserStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case UserStatus.BLOCKED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: UserStatusType): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        getStatusColor(status)
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
};

