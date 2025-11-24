import { useEffect, useRef } from 'react';
import { MessageBubble } from '../common/message_bubble';
import { TypingIndicator } from '../common/typing_indicator';
import type { Message } from '../../../types/chat/message';
import { cn } from '../../../utils/cn';

interface AdminChatBodyProps {
  messages: Message[];
  currentUserId: string;
  otherUserName?: string;
  isTyping?: boolean;
  isLoading?: boolean;
  className?: string;
}

/**
 * Admin Chat Body Component
 * Displays messages list with auto-scroll to bottom
 */
export const AdminChatBody: React.FC<AdminChatBodyProps> = ({
  messages,
  currentUserId,
  otherUserName,
  isTyping = false,
  isLoading = false,
  className,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  if (isLoading && messages.length === 0) {
    return (
      <div className={cn('flex-1 flex items-center justify-center', className)}>
        <div className="text-sm text-[var(--color-text-secondary)]">Loading messages...</div>
      </div>
    );
  }

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={cn('flex-1 flex items-center justify-center', className)}>
        <div className="text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">No messages yet</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Start the conversation by sending a message
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-4',
        className
      )}
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.messageId}
          message={message}
          isOwnMessage={message.senderId === currentUserId}
          senderName={message.senderId === currentUserId ? undefined : otherUserName}
        />
      ))}

      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};

