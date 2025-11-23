import { useState, type InputHTMLAttributes, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label: string;
  error?: string;
  className?: string;
  hint?: string;
  showPasswordToggle?: boolean;
  showPasswordLabel?: {
    show: string;
    hide: string;
  };
}

/**
 * PasswordInput Component
 * Reusable password input field with show/hide toggle, label, error handling, and consistent styling
 * 
 * Supports both react-hook-form and controlled inputs:
 * - With react-hook-form: spread register directly: {...register('password')}
 * - With controlled: use value and onChange props normally
 * 
 * @example
 * // With react-hook-form
 * <PasswordInput label="Password" {...register('password')} error={errors.password?.message} />
 * 
 * @example
 * // Controlled input
 * <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      id,
      error,
      className,
      hint,
      disabled,
      showPasswordToggle = true,
      showPasswordLabel = { show: 'Show password', hide: 'Hide password' },
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || props.name || `password-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
        >
          {label}
        </label>
        <div className="relative">
          <input
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-lg',
              'border',
              'bg-[var(--color-bg-card)]',
              'text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
              'transition-colors',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-[var(--color-border)] focus:border-[var(--color-primary)]',
              showPasswordToggle ? 'pr-12' : '',
              disabled && 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]',
              className
            )}
            disabled={disabled}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label={showPassword ? showPasswordLabel.hide : showPasswordLabel.show}
              disabled={disabled}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
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

PasswordInput.displayName = 'PasswordInput';

