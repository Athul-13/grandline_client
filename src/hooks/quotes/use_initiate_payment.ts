import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

/**
 * Hook for initiating payment for a quote
 * Redirects to payment page which handles payment intent creation
 */
export const useInitiatePayment = () => {
  const navigate = useNavigate();

  const initiatePayment = (quoteId: string) => {
    // Redirect to payment page which will create payment intent when user selects payment method
    navigate(ROUTES.payment(quoteId));
  };

  return {
    initiatePayment,
    isPending: false,
    isError: false,
    error: null,
  };
};

