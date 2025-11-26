import { cn } from '../../../utils/cn';

interface TypingIndicatorProps {
  className?: string;
}

/**
 * Typing Indicator Component
 * Shows animated dots when user is typing
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className }) => {
  return (
    <div className={cn('flex items-center gap-1 px-4 py-2', className)}>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-[var(--color-text-secondary)] rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-[var(--color-text-secondary)] rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-[var(--color-text-secondary)] rounded-full animate-bounce" />
      </div>
    </div>
  );
};

