import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/api/auth_service';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { rateLimiter, resetRateLimit } from '../../utils/rate_limiter';
import { sanitizeErrorMessage, logErrorForDev } from '../../utils/error_sanitizer';
import { ROUTES } from '../../constants/routes';
import logo from '../../assets/logo.png';

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, 'Password is required')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      ),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Get token from URL query parameter
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      toast.error('Invalid or missing reset token');
      navigate(ROUTES.login);
      return;
    }
    setToken(tokenParam);
  }, [searchParams, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    // Check rate limit
    const rateLimit = rateLimiter('reset-password');
    if (!rateLimit.allowed) {
      toast.error(
        `Too many attempts. Please try again in ${rateLimit.retryAfter} seconds.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authService.resetPassword(token, data.newPassword);

      if (result.success) {
        // Reset rate limit on success
        resetRateLimit('reset-password');
        toast.success(result.message || 'Password has been reset successfully');
        navigate(ROUTES.login);
      } else {
        toast.error(result.message || 'Failed to reset password');
      }
    } catch (error) {
      // Sanitize error message
      const sanitizedMessage = sanitizeErrorMessage(error);
      logErrorForDev(error, sanitizedMessage);
      toast.error(sanitizedMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render form if token is not available
  if (!token) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-(--color-bg-card) rounded-2xl shadow-xl p-6 md:p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="GrandLine Logo" className="h-16 w-auto object-contain" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-primary) mb-2">
            Reset Password
          </h1>
          <p className="text-sm md:text-base text-(--color-text-secondary)">
            Enter your new password below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* New Password Field */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-(--color-text-primary) mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                {...register('newPassword')}
                className={cn(
                  'w-full px-4 py-3 pr-12 rounded-lg',
                  'border',
                  'text-(--color-text-primary) placeholder-(--color-text-muted)',
                  'focus:outline-none focus:ring-2 focus:ring-(--color-primary)',
                  'transition-colors',
                  errors.newPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-(--color-border) focus:border-(--color-primary)'
                )}
                placeholder="Enter your new password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
            )}
            <p className="mt-1 text-xs text-(--color-text-muted)">
              Password must contain at least one lowercase letter, one uppercase letter, and one number
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-(--color-text-primary) mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className={cn(
                  'w-full px-4 py-3 pr-12 rounded-lg',
                  'border',
                  'text-(--color-text-primary) placeholder-(--color-text-muted)',
                  'focus:outline-none focus:ring-2 focus:ring-(--color-primary)',
                  'transition-colors',
                  errors.confirmPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-(--color-border) focus:border-(--color-primary)'
                )}
                placeholder="Confirm your new password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full py-3 rounded-lg font-bold text-white',
              'bg-(--color-primary) hover:bg-(--color-primary-hover)',
              'shadow-md hover:shadow-lg',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isSubmitting && 'animate-pulse'
            )}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate(ROUTES.login)}
            className="text-sm font-medium text-(--color-primary) hover:text-(--color-primary-hover) transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

