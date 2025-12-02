import { DriverStatus, type DriverStatusType } from '../../types/drivers/admin_driver';
import { cn } from '../../utils/cn';

interface DriverStatusBadgeProps {
  status: DriverStatusType;
}

/**
 * Driver Status Badge Component
 * Displays driver status with appropriate color coding
 */
export const DriverStatusBadge: React.FC<DriverStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: DriverStatusType): string => {
    switch (status) {
      case DriverStatus.AVAILABLE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case DriverStatus.ON_TRIP:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case DriverStatus.OFFLINE:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case DriverStatus.SUSPENDED:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case DriverStatus.BLOCKED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: DriverStatusType): string => {
    switch (status) {
      case DriverStatus.AVAILABLE:
        return 'Available';
      case DriverStatus.ON_TRIP:
        return 'On Trip';
      case DriverStatus.OFFLINE:
        return 'Offline';
      case DriverStatus.SUSPENDED:
        return 'Suspended';
      case DriverStatus.BLOCKED:
        return 'Blocked';
      default:
        return String(status).charAt(0).toUpperCase() + String(status).slice(1);
    }
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

