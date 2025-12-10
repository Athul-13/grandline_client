import { cn } from '../../utils/cn';
import type { ReservationStatusType } from '../../types/reservations/reservation';

interface ReservationStatusBadgeProps {
  status: ReservationStatusType;
  className?: string;
}

/**
 * Reservation Status Badge Component
 * Displays a colored badge for reservation status
 */
export const ReservationStatusBadge: React.FC<ReservationStatusBadgeProps> = ({
  status,
  className,
}) => {
  const getStatusConfig = (status: ReservationStatusType) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmed',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-800 dark:text-green-300',
          borderColor: 'border-green-200 dark:border-green-800',
        };
      case 'modified':
        return {
          label: 'Modified',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          textColor: 'text-blue-800 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          textColor: 'text-red-800 dark:text-red-300',
          borderColor: 'border-red-200 dark:border-red-800',
        };
      case 'completed':
        return {
          label: 'Completed',
          bgColor: 'bg-purple-100 dark:bg-purple-900/30',
          textColor: 'text-purple-800 dark:text-purple-300',
          borderColor: 'border-purple-200 dark:border-purple-800',
        };
      case 'refunded':
        return {
          label: 'Refunded',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          textColor: 'text-gray-800 dark:text-gray-300',
          borderColor: 'border-gray-200 dark:border-gray-700',
        };
      default:
        return {
          label: status,
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          textColor: 'text-gray-800 dark:text-gray-300',
          borderColor: 'border-gray-200 dark:border-gray-700',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      {config.label}
    </span>
  );
};

