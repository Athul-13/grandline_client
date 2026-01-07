import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { quoteService } from '../../services/api/quote_service';
import { ROUTES } from '../../constants/routes';
import {
  PaymentHeader,
  PaymentWindowAlert,
  PaymentMethodSelector,
  StripePaymentForm,
  PaymentLoadingState,
  PaymentErrorState,
} from '../../components/payment';
import { PricingDetailsSidebar } from '../../components/payment/pricing_details_sidebar';
import { AlertCircle } from 'lucide-react';

type PaymentMethod = 'stripe' | 'paypal' | null;

/**
 * Payment Page Component
 * Displays payment information and payment form
 */
export const PaymentPage: React.FC = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { data: paymentData, isLoading, error } = useQuery<{
    quoteId: string;
    totalPrice: number;
    pricing?: {
      baseFare?: number;
      distanceFare?: number;
      driverCharge?: number;
      fuelMaintenance?: number;
      nightCharge?: number;
      amenitiesTotal?: number;
      subtotal?: number;
      tax?: number;
      taxPercentageAtTime?: number;
      total?: number;
    };
    paymentWindowExpiresAt: string | null;
  }>({
    queryKey: ['payment', quoteId],
    queryFn: () => quoteService.getPaymentPage(quoteId!),
    enabled: !!quoteId,
  });

  const createPaymentIntentMutation = useMutation({
    mutationFn: () => quoteService.createPaymentIntent(quoteId!),
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error) => {
      console.error('Failed to create payment intent:', error);
    },
  });

  useEffect(() => {
    if (selectedPaymentMethod === 'stripe' && !clientSecret && !createPaymentIntentMutation.isPending) {
      createPaymentIntentMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPaymentMethod, clientSecret]);

  // Error states
  if (!quoteId) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-200">Quote ID is required</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">Loading payment information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <PaymentHeader />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-red-800 dark:text-red-200">
              Error loading payment information
            </p>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1 ml-7">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <button
            onClick={() => navigate(ROUTES.quotes)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm w-full sm:w-auto"
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

  const handlePaymentSuccess = () => {
    navigate(ROUTES.reservations);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PaymentHeader />

      <PaymentWindowAlert expiresAt={paymentWindowExpiresAt} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Area - Left Side (2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method Selection with Expandable Forms */}
          <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] p-6 shadow-lg">
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onSelect={setSelectedPaymentMethod}
            >
              {/* Stripe Payment Form Content */}
              {createPaymentIntentMutation.isPending && <PaymentLoadingState />}

              {createPaymentIntentMutation.isError && (
                <PaymentErrorState message="Failed to initialize payment. Please try again." />
              )}

              {clientSecret && !createPaymentIntentMutation.isPending && (
                <StripePaymentForm
                  clientSecret={clientSecret}
                  quoteId={quoteId}
                  totalPrice={paymentData.totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onCancel={() => {
                    setSelectedPaymentMethod(null);
                    setClientSecret(null);
                  }}
                />
              )}
            </PaymentMethodSelector>
          </div>

          {/* Action Button */}
          <div>
            <button
              onClick={() => navigate(`${ROUTES.quotes}?quoteId=${quoteId}`)}
              className="w-full px-6 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-base font-medium shadow-lg"
            >
              View Quote Details
            </button>
          </div>
        </div>

        {/* Pricing Details Sidebar - Right Side (1 column on large screens) */}
        <div className="lg:col-span-1">
          <PricingDetailsSidebar pricing={paymentData.pricing} quoteId={paymentData.quoteId} />
        </div>
      </div>
    </div>
  );
};
