import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ROUTES } from '../../constants/routes';
import { formatPrice } from '../../utils/quote_formatters';
import { AlertCircle, Loader2 } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface StripePaymentFormProps {
  clientSecret: string;
  quoteId: string;
  totalPrice: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

/**
 * Inner payment form component (wrapped in Stripe Elements)
 */
const PaymentForm: React.FC<{
  clientSecret: string;
  quoteId: string;
  totalPrice: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}> = ({ quoteId, totalPrice, onSuccess, onError: _onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}${ROUTES.quotes}?quoteId=${quoteId}&payment=success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess();
      }
      } catch (err) {
      const error = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(error);
      setIsProcessing(false);
      _onError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="min-w-0">
        <PaymentElement />
      </div>
      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200 break-words">{errorMessage}</p>
          </div>
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base font-medium"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          `Pay ${formatPrice(totalPrice)}`
        )}
      </button>
    </form>
  );
};

/**
 * Stripe Payment Form Wrapper
 */
export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  clientSecret,
  quoteId,
  totalPrice,
  onSuccess,
  onError,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCancel: _onCancel,
}) => {
  return (
    <div>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
          },
        }}
      >
        <PaymentForm
          clientSecret={clientSecret}
          quoteId={quoteId}
          totalPrice={totalPrice}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    </div>
  );
};
