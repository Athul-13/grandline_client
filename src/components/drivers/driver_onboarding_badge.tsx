import { cn } from '../../utils/cn';
import { CheckCircle2, XCircle } from 'lucide-react';

interface DriverOnboardingBadgeProps {
  isOnboarded: boolean;
}

/**
 * Driver Onboarding Badge Component
 * Displays onboarding status (Complete/Incomplete)
 */
export const DriverOnboardingBadge: React.FC<DriverOnboardingBadgeProps> = ({ isOnboarded }) => {
  if (isOnboarded) {
    return (
      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
        <CheckCircle2 className="w-4 h-4" />
        <span className="text-xs">Complete</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-gray-400">
      <XCircle className="w-4 h-4" />
      <span className="text-xs">Incomplete</span>
    </span>
  );
};

