import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export const PaymentHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <button
        onClick={() => navigate(ROUTES.quotes)}
        className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Quotes</span>
      </button>
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
        Payment
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)]">
        Complete your payment to confirm your booking
      </p>
    </div>
  );
};
