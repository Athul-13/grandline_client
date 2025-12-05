import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quoteService } from '../../services/api/quote_service';
import { ROUTES } from '../../constants/routes';
import { formatPrice } from '../../utils/quote_formatters';
import { CreditCard, ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * Payment Page Component
 * Displays payment information and placeholder for payment integration
 */
export const PaymentPage: React.FC = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();

  const { data: paymentData, isLoading, error } = useQuery({
    queryKey: ['payment', quoteId],
    queryFn: () => quoteService.getPaymentPage(quoteId!),
    enabled: !!quoteId,
  });

  if (!quoteId) {
    return (
      <div className="p-5 sm:p-4 md:p-6 lg:p-8 xl:p-10">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">Quote ID is required</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-5 sm:p-4 md:p-6 lg:p-8 xl:p-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--color-text-secondary)]">Loading payment information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 sm:p-4 md:p-6 lg:p-8 xl:p-10">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-200 font-semibold">Error loading payment information</p>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <button
            onClick={() => navigate(ROUTES.quotes)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Quotes
          </button>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return null;
  }

  const paymentWindowExpiresAt = paymentData.paymentWindowExpiresAt
    ? new Date(paymentData.paymentWindowExpiresAt)
    : null;
  const timeRemaining = paymentWindowExpiresAt
    ? formatDistanceToNow(paymentWindowExpiresAt, { addSuffix: true })
    : null;

  return (
    <div className="p-5 sm:p-4 md:p-6 lg:p-8 xl:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(ROUTES.quotes)}
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quotes</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
          Payment
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--color-text-secondary)]">
          Complete your payment to confirm your booking
        </p>
      </div>

      {/* Payment Window Status */}
      {paymentWindowExpiresAt && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                Payment Window
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Payment expires {timeRemaining}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Information Card */}
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Payment Details
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Quote ID: {paymentData.quoteId}
            </p>
          </div>
        </div>

        {/* Total Amount */}
        <div className="border-t border-[var(--color-border)] pt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-[var(--color-text-primary)]">
              Total Amount
            </span>
            <span className="text-3xl font-bold text-[var(--color-primary)]">
              {formatPrice(paymentData.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Integration Placeholder */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
              Payment Integration
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {paymentData.message || 'Payment integration will be implemented here. This is a placeholder page.'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate(`${ROUTES.quotes}?quoteId=${quoteId}`)}
          className="flex-1 px-6 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
        >
          View Quote Details
        </button>
        <button
          disabled
          className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg opacity-50 cursor-not-allowed"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};
