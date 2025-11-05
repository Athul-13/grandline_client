import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/api/auth_service';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { PasswordInput } from '../common/password_input';
import { rateLimiter, resetRateLimit } from '../../utils/rate_limiter';
import { sanitizeErrorMessage, logErrorForDev } from '../../utils/error_sanitizer';
import { ROUTES } from '../../constants/routes';
import { AuthFormCard } from './auth_form_card';
import { Button } from '../common/button';
import { useLanguage } from '../../hooks/use_language';

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
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    <AuthFormCard
      title={t('resetPassword.title')}
      subtitle={t('resetPassword.subtitle')}
      showLogo={true}
      logoLink={false}
    >
      {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* New Password Field */}
          <PasswordInput
            label={t('resetPassword.newPassword')}
            {...register('newPassword')}
            error={errors.newPassword?.message}
            placeholder={t('resetPassword.newPasswordPlaceholder')}
            disabled={isSubmitting}
            hint={t('resetPassword.passwordHint')}
          />

          {/* Confirm Password Field */}
          <PasswordInput
            label={t('resetPassword.confirmPassword')}
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            placeholder={t('resetPassword.confirmPasswordPlaceholder')}
            disabled={isSubmitting}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={isSubmitting}
            loadingText="Resetting..."
          >
            Reset Password
          </Button>
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
    </AuthFormCard>
  );
};

