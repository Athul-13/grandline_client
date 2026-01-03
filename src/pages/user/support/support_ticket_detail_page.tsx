import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '../../../components/common/ui/button';
import { useGetTicketById } from '../../../hooks/support/use_get_ticket_by_id';
import { useGetMessages } from '../../../hooks/support/use_get_messages';
import { useAddMessage } from '../../../hooks/support/use_add_message';
import { TicketStatusBadge } from '../../../components/support/ticket_status_badge';
import { ActorType, TicketStatus, type ActorTypeType } from '../../../types/support/ticket';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage } from '../../../utils/error_sanitizer';
import { cn } from '../../../utils/cn';

/**
 * Support Ticket Detail Page
 * Displays ticket details and message thread
 */
export const SupportTicketDetailPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const limit = 50;

  const { data: ticket, isLoading: isLoadingTicket } = useGetTicketById(ticketId || null);
  const { data: messagesData, isLoading: isLoadingMessages } = useGetMessages(
    ticketId || null,
    page,
    limit
  );
  const { addMessage, isLoading: isSubmitting } = useAddMessage();

  const handleSendMessage = async () => {
    if (!message.trim() || !ticketId) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await addMessage({ ticketId, content: message.trim() });
      setMessage('');
      toast.success('Message sent successfully');
    } catch (error) {
      toast.error(sanitizeErrorMessage(error));
    }
  };

  if (isLoadingTicket) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-[var(--color-bg-hover)] rounded animate-pulse"></div>
        <div className="h-64 bg-[var(--color-bg-hover)] rounded animate-pulse"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-secondary)]">Ticket not found</p>
        <Button variant="outline" onClick={() => navigate('/profile/support')} className="mt-4">
          Back to Tickets
        </Button>
      </div>
    );
  }

  const messages = messagesData?.messages || [];
  const isUserMessage = (senderType: ActorTypeType, senderId: string) => {
    return senderType === ActorType.USER && senderId === ticket.actorId;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/profile/support')}
          className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
            {ticket.subject}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <TicketStatusBadge status={ticket.status} />
            {ticket.linkedEntityType && ticket.linkedEntityId && (
              <span className="text-sm text-[var(--color-text-secondary)]">
                Related to: {ticket.linkedEntityType}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="space-y-4 mb-6">
        {isLoadingMessages ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto"></div>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-text-secondary)]">
            No messages yet
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = isUserMessage(msg.senderType, msg.senderId);
            return (
              <div
                key={msg.messageId}
                className={cn(
                  'flex',
                  isUser ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] sm:max-w-[70%] rounded-lg p-4',
                    isUser
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn('text-sm font-medium', isUser ? 'text-white/90' : 'text-[var(--color-text-secondary)]')}>
                      {isUser ? 'You' : (msg.senderType === ActorType.ADMIN ? 'Admin' : 'Support')}
                    </span>
                    <span className={cn('text-xs', isUser ? 'text-white/70' : 'text-[var(--color-text-secondary)]')}>
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={cn('whitespace-pre-wrap', isUser ? 'text-white' : 'text-[var(--color-text-primary)]')}>
                    {msg.content}
                  </p>
                  {msg.updatedAt && msg.updatedAt !== msg.createdAt && (
                    <p className={cn('text-xs mt-2', isUser ? 'text-white/70' : 'text-[var(--color-text-secondary)]')}>
                      Edited {format(new Date(msg.updatedAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Load More */}
        {messagesData?.pagination?.hasMore && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoadingMessages}
            >
              Load More Messages
            </Button>
          </div>
        )}
      </div>

      {/* Reply Box */}
      {(ticket.status !== TicketStatus.RESOLVED && ticket.status !== TicketStatus.REJECTED) && (
        <div className="border-t border-[var(--color-border)] pt-4">
          <div className="flex items-end gap-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={2}
              className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              loading={isSubmitting}
              loadingText="Sending..."
              disabled={!message.trim() || isSubmitting}
              className="flex-shrink-0"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      )}

      {ticket.status === TicketStatus.RESOLVED && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-green-800 font-medium">This ticket has been resolved</p>
        </div>
      )}

      {ticket.status === TicketStatus.REJECTED && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-800 font-medium">This ticket has been rejected</p>
        </div>
      )}
    </div>
  );
};

