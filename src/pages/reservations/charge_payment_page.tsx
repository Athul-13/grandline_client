import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { reservationService } from '../../services/api/reservation_service';
import { ROUTES } from '../../constants/routes';
import {
  PaymentHeader,
  PaymentMethodSelector,
  StripePaymentForm,
  PaymentLoadingState,
  PaymentErrorState,
} from '../../components/payment';
import { AlertCircle } from 'lucide-react';
import { formatPrice } from '../../utils/quote_formatters';

type PaymentMethod = 'stripe' | 'paypal' | null;

/**
 * Charge Payment Page Component
 * Displays payment information and payment form for outstanding charges
 */
export const ChargePaymentPage: React.FC = () => {
  const { reservationId, chargeId } = useParams<{ reservationId: string; chargeId: string }>();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Fetch reservation to get charge details
  const { data: reservation, isLoading: isLoadingReservation, error: reservationError } = useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: () => reservationService.getReservationById(reservationId!),
    enabled: !!reservationId,
  });

  // Find the charge from reservation
  const charge = reservation?.charges?.find((c) => c.chargeId === chargeId);

  const createPaymentIntentMutation = useMutation({
    mutationFn: () => reservationService.createChargePaymentIntent(reservationId!, chargeId!),
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
  if (!reservationId || !chargeId) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-200">Reservation ID and Charge ID are required</p>
        </div>
      </div>
    );
  }

  if (isLoadingReservation) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
          <p className="mt-4 text-sm text-[var(--color-text-secondary)]">Loading charge information...</p>
        </div>
      </div>
    );
  }

  if (reservationError || !reservation) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <PaymentHeader />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-red-800 dark:text-red-200">
              Error loading charge information
            </p>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1 ml-7">
            {reservationError instanceof Error ? reservationError.message : 'An unknown error occurred'}
          </p>
          <button
            onClick={() => navigate(ROUTES.reservations)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm w-full sm:w-auto"
          >
            Back to Reservations
          </button>
        </div>
      </div>
    );
  }

  if (!charge) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <PaymentHeader />
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Charge not found</p>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 ml-7">
            The charge you're looking for doesn't exist or has already been paid.
          </p>
          <button
            onClick={() => navigate(`${ROUTES.reservations}/${reservationId}`)}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm w-full sm:w-auto"
          >
            View Reservation
          </button>
        </div>
      </div>
    );
  }

  if (charge.isPaid) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <PaymentHeader />
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-green-800 dark:text-green-200">Charge Already Paid</p>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1 ml-7">
            This charge has already been paid. No payment is required.
          </p>
          <button
            onClick={() => navigate(`${ROUTES.reservations}/${reservationId}`)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm w-full sm:w-auto"
          >
            View Reservation
          </button>
        </div>
      </div>
    );
  }

  const handlePaymentSuccess = () => {
    navigate(`${ROUTES.reservations}/${reservationId}?payment=success`);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PaymentHeader />

      {/* Charge Information Card */}
      <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Payment Required</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--color-text-secondary)]">Reservation ID:</span>
            <span className="text-sm font-mono text-[var(--color-text-primary)]">{reservation.reservationId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--color-text-secondary)]">Charge Type:</span>
            <span className="text-sm text-[var(--color-text-primary)] capitalize">
              {charge.chargeType.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--color-text-secondary)]">Description:</span>
            <span className="text-sm text-[var(--color-text-primary)]">{charge.description}</span>
          </div>
          <div className="border-t border-[var(--color-border)] pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-[var(--color-text-primary)]">Amount Due:</span>
              <span className="text-2xl font-bold text-[var(--color-primary)]">
                {formatPrice(charge.amount)} {charge.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
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
              quoteId={`${reservationId}-${chargeId}`}
              totalPrice={charge.amount}
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
      <div className="mt-6">
        <button
          onClick={() => navigate(`${ROUTES.reservations}/${reservationId}`)}
          className="w-full px-6 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-base font-medium shadow-lg"
        >
          View Reservation Details
        </button>
      </div>
    </div>
  );
};

