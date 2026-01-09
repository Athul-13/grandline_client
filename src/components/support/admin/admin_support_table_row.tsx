import { cn } from '../../../utils/cn';
import { formatDate } from '../../../utils/quote_formatters';
import { TicketStatusBadge } from '../../support/ticket_status_badge';
import { highlightSearchTerm } from '../../../utils/highlight_search';
import type { AdminTicketListItem } from '../../../types/support/ticket';
import { ActorType } from '../../../types/support/ticket';

interface AdminSupportTableRowProps {
  ticket: AdminTicketListItem;
  onRowClick: () => void;
  searchQuery?: string;
}

/**
 * Admin Support Table Row Component
 * Displays a single ticket row in the desktop table view
 */
export const AdminSupportTableRow: React.FC<AdminSupportTableRowProps> = ({
  ticket,
  onRowClick,
  searchQuery = '',
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getActorTypeLabel = (actorType: string) => {
    return actorType.charAt(0).toUpperCase() + actorType.slice(1);
  };

  return (
    <tr
      onClick={onRowClick}
      className={cn(
        'flex h-[56px] border-b border-[var(--color-border)] cursor-pointer transition-colors',
        'hover:bg-[var(--color-bg-hover)]'
      )}
    >
      <td className="px-4 py-3 flex-[0_0_10%] flex items-center text-sm text-[var(--color-text-primary)]">
        <span className="font-mono text-xs truncate" title={ticket.ticketId}>
          {highlightSearchTerm(ticket.ticketId.slice(0, 8) + '...', searchQuery)}
        </span>
      </td>
      <td className="px-4 py-3 flex-[0_0_20%] flex items-center text-sm text-[var(--color-text-primary)] min-w-0">
        <span className="truncate w-full" title={ticket.subject}>
          {highlightSearchTerm(ticket.subject, searchQuery)}
        </span>
      </td>
      <td className="px-4 py-3 flex-[0_0_10%] flex items-center text-sm">
        <span className={cn(
          'px-2 py-0.5 rounded text-xs font-medium',
          ticket.actorType === ActorType.USER
            ? 'bg-blue-100 text-blue-700'
            : 'bg-green-100 text-green-700'
        )}>
          {getActorTypeLabel(ticket.actorType)}
        </span>
      </td>
      <td className="px-4 py-3 flex-[0_0_15%] flex items-center text-sm text-[var(--color-text-primary)]">
        <span className="truncate" title={ticket.actorName}>
          {highlightSearchTerm(ticket.actorName, searchQuery)}
        </span>
      </td>
      <td className="px-4 py-3 flex-[0_0_10%] flex items-center text-sm">
        <span className={cn(
          'px-2 py-0.5 rounded text-xs font-medium border',
          getPriorityColor(ticket.priority)
        )}>
          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
        </span>
      </td>
      <td className="px-4 py-3 flex-[0_0_10%] flex items-center">
        <TicketStatusBadge status={ticket.status} />
      </td>
      <td className="px-4 py-3 flex-[0_0_15%] flex items-center text-sm text-[var(--color-text-secondary)]">
        {formatDate(ticket.createdAt)}
      </td>
      <td className="px-4 py-3 flex-[0_0_10%] flex items-center text-sm text-[var(--color-text-secondary)]">
        {ticket.assignedAdminId ? (
          <span className="text-xs">Assigned</span>
        ) : (
          <span className="text-xs text-[var(--color-text-secondary)]">Unassigned</span>
        )}
      </td>
    </tr>
  );
};

