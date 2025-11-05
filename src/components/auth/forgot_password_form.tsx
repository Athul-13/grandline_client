import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/api/auth_service';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { rateLimiter, resetRateLimit } from '../../utils/rate_limiter';
import { sanitizeErrorMessage, logErrorForDev } from '../../utils/error_sanitizer';
import { ROUTES } from '../../constants/routes';
import logo from '../../assets/logo.png';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // Check rate limit
    const rateLimit = rateLimiter('forgot-password');
    if (!rateLimit.allowed) {
      toast.error(
        `Too many attempts. Please try again in ${rateLimit.retryAfter} seconds.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authService.forgotPassword(data.email);

      if (result.success) {
        // Reset rate limit on success
        resetRateLimit('forgot-password');
        toast.success(result.message || 'Password reset link has been sent to your email');
        navigate(ROUTES.login);
      } else {
        toast.error(result.message || 'Failed to send reset link');
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
            Forgot Password
          </h1>
          <p className="text-sm md:text-base text-(--color-text-secondary)">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-(--color-text-primary) mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={cn(
                'w-full px-4 py-3 rounded-lg',
                'border',
                'text-(--color-text-primary) placeholder-(--color-text-muted)',
                'focus:outline-none focus:ring-2 focus:ring-(--color-primary)',
                'transition-colors',
                errors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-(--color-border) focus:border-(--color-primary)'
              )}
              placeholder="Enter your email address"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
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
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

