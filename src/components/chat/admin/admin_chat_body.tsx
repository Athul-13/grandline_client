import { useEffect, useRef, useState, useMemo } from 'react';
import { chatSocketService } from '../../../services/socket/chat_socket_service';
import { MessageBubble } from '../common/message_bubble';
import { TypingIndicator } from '../common/typing_indicator';
import { getDateLabel, isDifferentDay } from '../../../utils/chat_date_utils';
import type { Message } from '../../../types/chat/message';
import type { TypingEvent, TypingStoppedEvent } from '../../../types/chat/chat_socket_events';
import { cn } from '../../../utils/cn';

interface MessageWithSeparator {
  type: 'message' | 'dateSeparator';
  message?: Message;
  dateLabel?: string;
  key: string;
}

interface AdminChatBodyProps {
  messages: Message[];
  currentUserId: string;
  otherUserName?: string;
  chatId: string | null;
  isLoading?: boolean;
  className?: string;
}

/**
 * Admin Chat Body Component
 * Displays messages list with auto-scroll to bottom and real-time typing indicator
 */
export const AdminChatBody: React.FC<AdminChatBodyProps> = ({
  messages,
  currentUserId,
  otherUserName,
  chatId,
  isLoading = false,
  className,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Prepare messages with date separators
  const messagesWithSeparators = useMemo<MessageWithSeparator[]>(() => {
    if (messages.length === 0) return [];

    const result: MessageWithSeparator[] = [];
    
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const messageDate = message.createdAt;
      
      // Add date separator if this is the first message or date changed
      if (i === 0 || isDifferentDay(messageDate, messages[i - 1].createdAt)) {
        const dateKey = typeof messageDate === 'string' 
          ? messageDate.split('T')[0] 
          : messageDate.toISOString().split('T')[0];
        result.push({
          type: 'dateSeparator',
          dateLabel: getDateLabel(messageDate),
          key: `date-${dateKey}`,
        });
      }
      
      // Add the message
      result.push({
        type: 'message',
        message,
        key: message.messageId,
      });
    }
    
    return result;
  }, [messages]);

  // Listen for typing indicators
  useEffect(() => {
    if (!chatId) return;

    const handleTyping = (data: TypingEvent) => {
      if (data.chatId === chatId && data.userId !== currentUserId) {
        setIsTyping(true);

        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Auto-hide typing indicator after 3 seconds
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    };

    const handleTypingStopped = (data: TypingStoppedEvent) => {
      if (data.chatId === chatId && data.userId !== currentUserId) {
        setIsTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    };

    const cleanupTyping = chatSocketService.onTyping(handleTyping);
    const cleanupTypingStopped = chatSocketService.onTypingStopped(handleTypingStopped);

    return () => {
      cleanupTyping();
      cleanupTypingStopped();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId, currentUserId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  if (isLoading && messages.length === 0) {
    return (
      <div className={cn('flex-1 flex items-center justify-center', className)}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <div className="text-sm text-[var(--color-text-secondary)]">Loading messages...</div>
        </div>
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
      {messagesWithSeparators.map((item) => {
        if (item.type === 'dateSeparator') {
          return (
            <div key={item.key} className="flex items-center justify-center py-2">
              <div className="px-3 py-1 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  {item.dateLabel}
                </span>
              </div>
            </div>
          );
        }
        
        if (item.message) {
          return (
            <MessageBubble
              key={item.key}
              message={item.message}
              isOwnMessage={item.message.senderId === currentUserId}
              senderName={item.message.senderId === currentUserId ? undefined : otherUserName}
            />
          );
        }
        
        return null;
      })}

      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};

