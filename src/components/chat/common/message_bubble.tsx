import { MessageStatusIcon } from './message_status_icon';
import type { Message } from '../../../types/chat/message';
import { cn } from '../../../utils/cn';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  senderName?: string;
}

/**
 * Message Bubble Component
 * Displays individual chat message with sender info, timestamp, and status indicators
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  senderName,
}) => {
  const formatTime = (date: string | Date): string => {
    try {
      const messageDate = typeof date === 'string' ? new Date(date) : date;
      // Use Intl.DateTimeFormat for locale-aware time formatting (12h or 24h)
      return new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      }).format(messageDate);
    } catch {
      return '';
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-1 max-w-[70%]',
        isOwnMessage ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      {!isOwnMessage && senderName && (
        <span className="text-xs text-[var(--color-text-secondary)] px-2">{senderName}</span>
      )}

      <div
        className={cn(
          'rounded-lg px-4 py-2 break-words',
          isOwnMessage
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]'
        )}
      >
        <div className="flex items-end gap-2 flex-wrap">
          <p className="text-sm whitespace-pre-wrap flex-1">{message.content}</p>
          <span className={cn(
            'text-xs whitespace-nowrap',
            isOwnMessage ? 'text-white/70' : 'text-[var(--color-text-secondary)]'
          )}>
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>

      {isOwnMessage && (
        <div className="flex items-center justify-end gap-1 text-xs text-[var(--color-text-secondary)] px-2">
          <MessageStatusIcon status={message.deliveryStatus} />
        </div>
      )}
    </div>
  );
};

