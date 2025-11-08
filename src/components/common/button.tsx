import { cn } from '../../utils/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

/**
 * Button Component
 * Reusable button component with variants, sizes, and loading states
 * 
 * @example
 * // Standard button
 * <Button variant="primary">Click me</Button>
 * 
 * @example
 * // Form submit button with loading
 * <Button type="submit" loading={isLoading} loadingText="Submitting...">
 *   Submit
 * </Button>
 * 
 * @example
 * // Full width large button
 * <Button size="lg" fullWidth>Submit</Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  loadingText,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-(--color-primary) text-white hover:bg-(--color-primary-hover) active:scale-95 shadow-md hover:shadow-lg',
    outline: 'border-2 border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary)/10 active:scale-95',
    ghost: 'text-(--color-primary) hover:bg-(--color-primary)/10 active:scale-95',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-base font-bold',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        loading && 'animate-pulse',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && loadingText ? loadingText : children}
    </button>
  );
};

