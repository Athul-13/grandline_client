import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface AdminChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * Admin Chat Input Component
 * Message input field with send button
 */
export const AdminChatInput: React.FC<AdminChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message...',
  className,
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
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

