import { Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { QuoteResponse } from '../../../types/quotes/quote';
import { QuoteStatus } from '../../../types/quotes/quote';

interface PaymentWindowStatusProps {
  quoteDetails: QuoteResponse;
}

/**
 * Payment Window Status Component
 * Displays payment window expiration information for QUOTED quotes
 */
export const PaymentWindowStatus: React.FC<PaymentWindowStatusProps> = ({ quoteDetails }) => {
  // Only show for QUOTED status quotes
  if (quoteDetails.status !== QuoteStatus.QUOTED || !quoteDetails.quotedAt) {
    return null;
  }

  const quotedAt = typeof quoteDetails.quotedAt === 'string' 
    ? new Date(quoteDetails.quotedAt) 
    : quoteDetails.quotedAt;
  
  const paymentWindowExpiresAt = new Date(quotedAt.getTime() + 24 * 60 * 60 * 1000);
  const now = new Date();
  const isExpired = now > paymentWindowExpiresAt;
  const timeRemaining = formatDistanceToNow(paymentWindowExpiresAt, { addSuffix: true });

  if (isExpired) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <div>
            <p className="text-sm font-semibold text-red-800 dark:text-red-200">
              Payment Window Expired
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              The payment window has expired. Please request a new quote.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <div>
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
            Payment Window Active
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Payment expires {timeRemaining}
          </p>
        </div>
      </div>
    </div>
  );
};
