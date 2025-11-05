import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  error?: string;
  className?: string;
  hint?: string;
}

/**
 * FormInput Component
 * Reusable form input field with label, error handling, and consistent styling
 * 
 * Supports both react-hook-form and controlled inputs:
 * - With react-hook-form: spread register directly: {...register('fieldName')}
 * - With controlled: use value and onChange props normally
 * 
 * @example
 * // With react-hook-form
 * <FormInput label="Email" {...register('email')} error={errors.email?.message} />
 * 
 * @example
 * // Controlled input
 * <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, id, error, className, hint, disabled, ...props }, ref) => {
    const inputId = id || props.name || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-(--color-text-primary) mb-2"
        >
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-lg',
            'border',
            'text-(--color-text-primary) placeholder-(--color-text-muted)',
            'focus:outline-none focus:ring-2 focus:ring-(--color-primary)',
            'transition-colors',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-(--color-border) focus:border-(--color-primary)',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          disabled={disabled}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1 text-xs text-(--color-text-muted)">{hint}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

