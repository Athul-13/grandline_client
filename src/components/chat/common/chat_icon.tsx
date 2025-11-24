import { MessageCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ChatIconProps {
  unreadCount?: number;
  onClick?: () => void;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

/**
 * Chat Icon Component
 * Displays chat icon with optional unread badge and label
 */
export const ChatIcon: React.FC<ChatIconProps> = ({
  unreadCount = 0,
  onClick,
  className,
  showLabel = false,
  label = 'Chat',
}) => {
  const hasUnread = unreadCount > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]',
        className
      )}
      title={hasUnread ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'Chat'}
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-semibold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
      )}
    </button>
  );
};

