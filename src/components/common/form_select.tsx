import { type SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label: string;
  error?: string;
  className?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

/**
 * FormSelect Component
 * Reusable select dropdown with label, error handling, and consistent styling
 * 
 * @example
 * <FormSelect
 *   label="Event Type"
 *   value={eventType}
 *   onChange={(e) => setEventType(e.target.value)}
 *   options={[
 *     { value: 'wedding', label: 'Wedding' },
 *     { value: 'corporate', label: 'Corporate' },
 *   ]}
 *   placeholder="Select event type"
 *   error={errors.eventType}
 * />
 */
export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, id, error, className, hint, disabled, options, placeholder, ...props }, ref) => {
    const selectId = id || props.name || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div>
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
        >
          {label}
        </label>
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-lg',
            'border',
            'bg-[var(--color-bg-card)]',
            'text-[var(--color-text-primary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
            'transition-colors',
            'appearance-none',
            'cursor-pointer',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-[var(--color-border)] focus:border-[var(--color-primary)]',
            disabled && 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]',
            className
          )}
          disabled={disabled}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

