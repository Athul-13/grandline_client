import { cn } from '../../utils/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: ReactNode;
}

/**
 * Button Component
 * Reusable button component with variants
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-(--color-primary) text-white hover:bg-(--color-primary)/90 active:scale-95',
    outline: 'border-2 border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary)/10 active:scale-95',
    ghost: 'text-(--color-primary) hover:bg-(--color-primary)/10 active:scale-95',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

