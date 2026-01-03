import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../common/ui/button';
import { useGetMessages } from '../../../hooks/support/use_get_messages';
import { useAddMessage } from '../../../hooks/support/use_add_message';
import { useUpdateTicketStatus } from '../../../hooks/support/use_update_ticket_status';
import { useAssignTicketToAdmin } from '../../../hooks/support/use_assign_ticket_to_admin';
import { TicketStatusBadge } from '../../support/ticket_status_badge';
import { TicketStatus, ActorType, type TicketStatusType, type ActorTypeType, type GetTicketByIdResponse } from '../../../types/support/ticket';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage } from '../../../utils/error_sanitizer';
import { cn } from '../../../utils/cn';
import { useAppSelector } from '../../../store/hooks';
import { ConfirmationModal } from '../../common/modals/confirmation_modal';

interface AdminSupportTicketDetailViewProps {
  ticketDetails: GetTicketByIdResponse;
  onBack: () => void;
  onRefetch: () => void;
}

/**
 * Admin Support Ticket Detail View
 * Displays ticket details, first message, message thread, and reply input
 */
export const AdminSupportTicketDetailView: React.FC<AdminSupportTicketDetailViewProps> = ({
  ticketDetails,
  onBack,
  onRefetch,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAssignConfirm, setShowAssignConfirm] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TicketStatusType | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const limit = 50;

  const { data: messagesData, isLoading: isLoadingMessages, refetch: refetchMessages } = useGetMessages(
    ticketDetails.ticketId,
    page,
    limit
  );
  const { addMessage, isLoading: isSubmitting } = useAddMessage();
  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useUpdateTicketStatus();
  const { mutateAsync: assignToAdmin, isPending: isAssigning } = useAssignTicketToAdmin();

  // Get first message (the issue) - messages are sorted oldest first (createdAt: 1)
  const firstMessage = messagesData?.messages && messagesData.messages.length > 0 
    ? messagesData.messages[0] // First message is at index 0 (oldest)
    : null;

  // Get other messages (excluding first) - reverse to show newest first
  const otherMessages = messagesData?.messages && messagesData.messages.length > 1
    ? messagesData.messages.slice(1).reverse() // Skip first message, reverse to show newest first
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
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

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await addMessage({ ticketId: ticketDetails.ticketId, content: message.trim() });
      setMessage('');
      toast.success('Message sent successfully');
      refetchMessages();
      onRefetch();
    } catch (error) {
      toast.error(sanitizeErrorMessage(error));
    }
  };

  const handleAssignToMe = async () => {
    if (!user?.userId) {
      toast.error('User not found');
      return;
    }

    try {
      await assignToAdmin({
        ticketId: ticketDetails.ticketId,
        request: { adminId: user.userId },
      });
      toast.success('Ticket assigned to you');
      onRefetch();
    } catch (error) {
      toast.error(sanitizeErrorMessage(error));
    }
  };

  const handleStatusChange = (newStatus: TicketStatusType) => {
    setPendingStatus(newStatus);
    setShowStatusConfirm(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus) return;

    try {
      await updateStatus({
        ticketId: ticketDetails.ticketId,
        request: { status: pendingStatus },
      });
      toast.success(`Ticket status updated to ${pendingStatus}`);
      setShowStatusConfirm(false);
      setPendingStatus(null);
      onRefetch();
    } catch (error) {
      toast.error(sanitizeErrorMessage(error));
    }
  };

  const isUserMessage = (senderType: ActorTypeType, senderId: string) => {
    return senderType === ActorType.USER && senderId === ticketDetails.actorId;
  };

  const getStatusLabel = (status: TicketStatusType): string => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  const allStatuses = Object.values(TicketStatus);

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-[var(--color-border)] h-[48px] px-4 bg-[var(--color-bg-secondary)] flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-xs text-[var(--color-text-primary)] truncate">
              {ticketDetails.subject}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)] flex-shrink-0">
              • {ticketDetails.actorType === ActorType.USER ? 'User' : 'Driver'}
            </span>
            {ticketDetails.linkedEntityType && ticketDetails.linkedEntityId && (
              <span className="text-xs text-[var(--color-text-secondary)] flex-shrink-0">
                • {ticketDetails.linkedEntityType}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Status Dropdown */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={cn(
                'flex items-center gap-2 px-2 py-1 text-xs rounded border transition-colors',
                'bg-[var(--color-bg-primary)] border-[var(--color-border)] text-[var(--color-text-primary)]',
                'hover:bg-[var(--color-bg-hover)]'
              )}
            >
              <TicketStatusBadge status={ticketDetails.status} />
              {showStatusDropdown ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>

            {showStatusDropdown && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 p-2">
                <div className="space-y-1">
                  {allStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        handleStatusChange(status);
                        setShowStatusDropdown(false);
                      }}
                      disabled={status === ticketDetails.status}
                      className={cn(
                        'w-full text-left px-2 py-1.5 rounded text-sm transition-colors',
                        status === ticketDetails.status
                          ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium cursor-not-allowed'
                          : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                      )}
                    >
                      {getStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Assign to Me Button */}
          {!ticketDetails.assignedAdminId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAssignConfirm(true)}
              disabled={isAssigning}
              className="text-xs px-2 py-1 h-auto"
            >
              {isAssigning ? 'Assigning...' : 'Assign to Me'}
            </Button>
          )}
        </div>
      </div>

      {/* Body - First Message (Non-scrollable) */}
      {firstMessage && (
        <div className="flex-shrink-0 border-b border-[var(--color-border)] p-4 bg-[var(--color-bg-hover)]/30">
          <div className="mb-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase">
              Initial Issue
            </span>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-lg p-4 border border-[var(--color-border)]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {isUserMessage(firstMessage.senderType, firstMessage.senderId)
                  ? 'User'
                  : firstMessage.senderType === ActorType.ADMIN
                  ? 'Admin'
                  : 'Support'}
              </span>
              <span className="text-xs text-[var(--color-text-secondary)]">
                {format(new Date(firstMessage.createdAt), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap">
              {firstMessage.content}
            </p>
          </div>
        </div>
      )}

      {/* Messages Thread (Scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto"></div>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Loading messages...</p>
          </div>
        ) : otherMessages.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-text-secondary)]">
            No additional messages yet
          </div>
        ) : (
          otherMessages.map((msg) => {
            const isUser = isUserMessage(msg.senderType, msg.senderId);
            const isAdmin = msg.senderType === ActorType.ADMIN;
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
                    isAdmin
                      ? 'bg-[var(--color-primary)] text-white'
                      : isUser
                      ? 'bg-[var(--color-primary)]/20 text-[var(--color-text-primary)]'
                      : 'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn('text-sm font-medium', isAdmin ? 'text-white/90' : 'text-[var(--color-text-secondary)]')}>
                      {isUser ? 'User' : isAdmin ? 'Admin' : 'Support'}
                    </span>
                    <span className={cn('text-xs', isAdmin ? 'text-white/70' : 'text-[var(--color-text-secondary)]')}>
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={cn('whitespace-pre-wrap', isAdmin ? 'text-white' : 'text-[var(--color-text-primary)]')}>
                    {msg.content}
                  </p>
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
      {(ticketDetails.status !== TicketStatus.RESOLVED && ticketDetails.status !== TicketStatus.REJECTED) && (
        <div className="flex-shrink-0 border-t border-[var(--color-border)] p-4 bg-[var(--color-bg-secondary)]">
          <div className="flex items-end gap-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your reply..."
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
              Send Reply
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showAssignConfirm}
        onClose={() => setShowAssignConfirm(false)}
        onConfirm={handleAssignToMe}
        title="Assign Ticket to You"
        message="Are you sure you want to assign this ticket to yourself? The status will automatically change to In Progress."
        confirmText="Assign to Me"
        cancelText="Cancel"
        isLoading={isAssigning}
        variant="info"
      />

      <ConfirmationModal
        isOpen={showStatusConfirm}
        onClose={() => {
          setShowStatusConfirm(false);
          setPendingStatus(null);
        }}
        onConfirm={confirmStatusChange}
        title="Update Ticket Status"
        message={`Are you sure you want to change the ticket status from "${getStatusLabel(ticketDetails.status)}" to "${pendingStatus ? getStatusLabel(pendingStatus) : ''}"?`}
        confirmText="Update Status"
        cancelText="Cancel"
        isLoading={isUpdatingStatus}
        variant="info"
      />
    </div>
  );
};

