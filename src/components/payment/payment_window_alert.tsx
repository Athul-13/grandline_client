import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PaymentWindowAlertProps {
  expiresAt: Date | null;
}

export const PaymentWindowAlert: React.FC<PaymentWindowAlertProps> = ({ expiresAt }) => {
  if (!expiresAt) return null;

  const timeRemaining = formatDistanceToNow(expiresAt, { addSuffix: true });

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
            Payment Window
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Payment expires {timeRemaining}
          </p>
        </div>
      </div>
    </div>
  );
};
