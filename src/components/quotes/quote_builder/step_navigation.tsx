import { cn } from '../../../utils/cn';
import { Check } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
}

/**
 * Step Navigation Component
 * Shows 5 steps with progress indication
 */
export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  const steps = [
    { number: 1, label: 'Trip Type' },
    { number: 2, label: 'Itinerary' },
    { number: 3, label: 'Details' },
    { number: 4, label: 'Vehicles' },
    { number: 5, label: 'Amenities' },
  ];

  const handleStepClick = (step: number) => {
    // Can only click on completed steps or current step
    if (completedSteps.includes(step) || step === currentStep) {
      onStepClick?.(step);
    }
  };

  return (
    <div className="w-full bg-transparent border-b border-[var(--color-border)] px-6 py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = step.number === currentStep;
          const isClickable = isCompleted || isCurrent;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => handleStepClick(step.number)}
                  disabled={!isClickable}
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2',
                    isCurrent
                      ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                      : isCompleted
                      ? 'bg-green-500 border-green-500 text-white cursor-pointer hover:scale-110'
                      : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)] cursor-not-allowed'
                  )}
                  aria-label={`Step ${step.number}: ${step.label}`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{step.number}</span>
                  )}
                </button>

                {/* Step Label */}
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center',
                    isCurrent
                      ? 'text-[var(--color-primary)]'
                      : isCompleted
                      ? 'text-green-600'
                      : 'text-[var(--color-text-secondary)]'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 -mt-5',
                    completedSteps.includes(step.number + 1) || currentStep > step.number
                      ? 'bg-green-500'
                      : 'bg-[var(--color-border)]'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

