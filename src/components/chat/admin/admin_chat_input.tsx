import { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { chatSocketService } from '../../../services/socket/chat_socket_service';
import { cn } from '../../../utils/cn';

interface AdminChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  chatId: string | null;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * Admin Chat Input Component
 * Message input field with send button and typing indicator
 */
export const AdminChatInput: React.FC<AdminChatInputProps> = ({
  onSendMessage,
  chatId,
  disabled = false,
  placeholder = 'Type a message...',
  className,
}) => {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // Handle typing indicator with debounce
  useEffect(() => {
    if (!chatId) return;

    if (message.trim() && !isTypingRef.current) {
      isTypingRef.current = true;
      chatSocketService.startTyping(chatId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current && chatId) {
        chatSocketService.stopTyping(chatId);
        isTypingRef.current = false;
      }
    }, 3000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, chatId]);

  // Cleanup typing indicator on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current && chatId) {
        chatSocketService.stopTyping(chatId);
      }
    };
  }, [chatId]);

  const handleSend = async () => {
    if (message.trim() && !disabled) {
      // Stop typing indicator (only if chatId exists)
      if (chatId && isTypingRef.current) {
        chatSocketService.stopTyping(chatId);
        isTypingRef.current = false;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      try {
        await onSendMessage(message.trim());
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
        // Message will remain in input so user can retry
        // Error will be shown via toast or error state in parent component
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        'flex-shrink-0 border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]',
        className
      )}
    >
      <div className="flex items-end gap-2 px-4 py-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="flex-1 px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ maxHeight: '120px', minHeight: '40px' }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="p-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

