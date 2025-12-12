import { Loader2 } from 'lucide-react';

interface PaymentLoadingStateProps {
  message?: string;
}

export const PaymentLoadingState: React.FC<PaymentLoadingStateProps> = ({
  message = 'Setting up payment...',
}) => {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      <p className="ml-3 text-base text-[var(--color-text-secondary)]">{message}</p>
    </div>
  );
};
