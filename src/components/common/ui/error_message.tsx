import { cn } from '../../utils/cn';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

/**
 * ErrorMessage Component
 * Reusable error message display with consistent styling and dark mode support
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        'p-3 rounded-lg',
        'bg-red-50 dark:bg-red-900/20',
        'border border-red-200 dark:border-red-800',
        className
      )}
    >
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
};

