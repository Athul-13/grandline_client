import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useLanguage } from '../../hooks/use_language';
import { loginAsync } from '../../store/slices/auth_slice';
import { loginSchema, type LoginFormData } from '../../types/auth/login';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { PasswordInput } from '../common/password_input';
import { rateLimiter, resetRateLimit } from '../../utils/rate_limiter';
import { sanitizeErrorMessage, logErrorForDev } from '../../utils/error_sanitizer';
import { ROUTES } from '../../constants/routes';
import { FormInput } from '../common/form_input';
import { AuthFormCard } from '../common/auth_form_card';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    // Check rate limit
    const rateLimit = rateLimiter('login');
    if (!rateLimit.allowed) {
      toast.error(
        `Too many login attempts. Please try again in ${rateLimit.retryAfter} seconds.`
      );
      return;
    }

    try {
      const result = await dispatch(
        loginAsync({
          email: data.email,
          password: data.password,
        })
      ).unwrap();

      // Check if login was successful
      if (result.success) {
        // Reset rate limit on success
        resetRateLimit('login');

        // Block admin users from using user login page
        if (result.user.role === 'admin') {
          toast.error('Admins must use the admin login page');
          navigate(ROUTES.admin.login);
          return;
        }

        toast.success(t('login.success'));
        navigate(ROUTES.dashboard);
      }
    } catch (err) {
      // Sanitize error message
      const sanitizedMessage = sanitizeErrorMessage(err);
      logErrorForDev(err, sanitizedMessage);

      // Check if user needs to verify account
      if (
        sanitizedMessage.includes('Please verify your account to continue') ||
        sanitizedMessage.includes('verify your account') ||
        sanitizedMessage.toLowerCase().includes('verify')
      ) {
        // Redirect to OTP verification page with email
        navigate(ROUTES.verifyOtp, { state: { email: data.email } });
        toast.error(sanitizedMessage);
      } else {
        toast.error(sanitizedMessage);
      }
    }
  };

  const handleGoogleLogin = () => {
    // Placeholder for Google OAuth
    toast(t('login.googleComingSoon'), { icon: '🔜' });
  };

  return (
    <AuthFormCard
      title={t('login.welcomeBack')}
      subtitle={
        <>
          {t('login.subtitle')}{' '}
          <span className="font-bold text-[#1e3a8a] dark:text-[#3b82f6]">
            GRANDLINE
          </span>
        </>
      }
      logoLink={ROUTES.home}
    >
      {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <FormInput
            label={t('login.emailLabel')}
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder={t('login.emailPlaceholder')}
            disabled={isLoading}
          />

          {/* Password Field */}
          <PasswordInput
            label={t('login.passwordLabel')}
            {...register('password')}
            error={errors.password?.message}
            placeholder={t('login.passwordPlaceholder')}
            disabled={isLoading}
            showPasswordLabel={{
              show: t('login.showPassword'),
              hide: t('login.hidePassword'),
            }}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="w-4 h-4 rounded border-(--color-border) text-(--color-primary) focus:ring-(--color-primary) focus:ring-2"
                disabled={isLoading}
              />
              <span className="text-sm text-(--color-text-primary)">{t('login.rememberMe')}</span>
            </label>
            <Link
              to={ROUTES.forgotPassword}
              className="text-sm font-medium text-(--color-primary) hover:text-(--color-primary-hover) transition-colors"
            >
              {t('login.forgotPassword')}
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full py-3 rounded-lg font-bold text-white',
              'bg-(--color-primary) hover:bg-(--color-primary-hover)',
              'shadow-md hover:shadow-lg',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isLoading && 'animate-pulse'
            )}
          >
            {isLoading ? t('login.loggingIn') : t('login.button')}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-(--color-border)"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-(--color-bg-card) text-(--color-text-secondary)">
              {t('login.or')}
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={cn(
            'w-full py-3 px-4 rounded-lg font-bold',
            'bg-(--color-bg-card) border border-(--color-border)',
            'text-(--color-text-primary) hover:bg-(--color-bg-hover)',
            'shadow-sm hover:shadow-md',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center justify-center gap-3'
          )}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>{t('login.continueWithGoogle')}</span>
        </button>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-(--color-text-secondary)">
            {t('login.noAccount')}{' '}
            <Link
              to={ROUTES.register}
              className="font-bold text-(--color-primary) hover:text-(--color-primary-hover) transition-colors"
            >
              {t('login.signUp')}
            </Link>
          </p>
        </div>
    </AuthFormCard>
  );
};

