import { useNavigate } from 'react-router-dom';
import { useGetTickets } from '../../../hooks/support/use_get_tickets';
import { ActorType, type ActorTypeType } from '../../../types/support/ticket';
import { TicketStatusBadge } from '../../../components/support/ticket_status_badge';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Clock } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Support Tickets List Page
 * Displays all support tickets for the authenticated user
 */
export const SupportTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetTickets(ActorType.USER as ActorTypeType);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-[var(--color-bg-hover)] rounded animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[var(--color-bg-hover)] rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-secondary)]">
          Failed to load tickets. Please try again later.
        </p>
      </div>
    );
  }

  const tickets = data?.tickets || [];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-4 sm:mb-6">
        Support Tickets
      </h1>

      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-[var(--color-text-secondary)] mx-auto mb-4 opacity-50" />
          <p className="text-[var(--color-text-secondary)] mb-2">No support tickets yet</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Create a ticket to get help with your quotes or reservations
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <button
              key={ticket.ticketId}
              onClick={() => navigate(`/profile/support/${ticket.ticketId}`)}
              className={cn(
                'w-full p-4 rounded-lg border border-[var(--color-border)]',
                'bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-hover)]',
                'transition-all text-left'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-[var(--color-text-primary)] truncate">
                      {ticket.subject}
                    </h3>
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                  {ticket.linkedEntityType && ticket.linkedEntityId && (
                    <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                      Related to: {ticket.linkedEntityNumber || '-'}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                    {ticket.lastMessageAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          Updated {formatDistanceToNow(new Date(ticket.lastMessageAt), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>
                        Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

