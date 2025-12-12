import { AlertCircle } from 'lucide-react';

interface PaymentErrorStateProps {
  message: string;
}

export const PaymentErrorState: React.FC<PaymentErrorStateProps> = ({ message }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-800 dark:text-red-200">{message}</p>
      </div>
    </div>
  );
};
