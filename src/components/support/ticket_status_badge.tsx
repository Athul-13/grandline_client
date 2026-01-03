import { cn } from '../../utils/cn';
import { TicketStatus, type TicketStatusType } from '../../types/support/ticket';

interface TicketStatusBadgeProps {
  status: TicketStatusType;
}

/**
 * Ticket Status Badge Component
 * Displays ticket status with appropriate color coding
 */
export const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    [TicketStatus.OPEN]: {
      label: 'Open',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    [TicketStatus.IN_PROGRESS]: {
      label: 'In Progress',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    [TicketStatus.RESOLVED]: {
      label: 'Resolved',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    [TicketStatus.REJECTED]: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
  };

  const config = statusConfig[status] || statusConfig[TicketStatus.OPEN];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className
      )}
    >
      {config.label}
    </span>
  );
};

