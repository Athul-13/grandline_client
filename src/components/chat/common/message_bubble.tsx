import { format } from 'date-fns';
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
      return format(messageDate, 'HH:mm');
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
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>

      <div
        className={cn(
          'flex items-center gap-1 text-xs text-[var(--color-text-secondary)] px-2',
          isOwnMessage ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <span>{formatTime(message.createdAt)}</span>
        {isOwnMessage && <MessageStatusIcon status={message.deliveryStatus} />}
      </div>
    </div>
  );
};

