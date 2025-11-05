import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useLanguage } from '../../hooks/use_language';
import { registerAsync } from '../../store/slices/auth_slice';
import { registerSchema, type RegisterFormData } from '../../types/auth/register';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { rateLimiter, resetRateLimit } from '../../utils/rate_limiter';
import { sanitizeErrorMessage, logErrorForDev } from '../../utils/error_sanitizer';
import { ROUTES } from '../../constants/routes';
import logo from '../../assets/logo.png';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData) => {
    // Check rate limit
    const rateLimit = rateLimiter('register');
    if (!rateLimit.allowed) {
      toast.error(
        `Too many registration attempts. Please try again in ${rateLimit.retryAfter} seconds.`
      );
      return;
    }

    try {
      // Extract only the fields needed for API (exclude confirmPassword)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;
      const result = await dispatch(registerAsync(registerData)).unwrap();

      if (result.success) {
        // Reset rate limit on success
        resetRateLimit('register');
        toast.success(t('register.success'));
        // Redirect to OTP verification page with email
        navigate(ROUTES.verifyOtp, { state: { email: data.email } });
      }
    } catch (err) {
      // Sanitize error message
      const sanitizedMessage = sanitizeErrorMessage(err);
      logErrorForDev(err, sanitizedMessage);
      toast.error(sanitizedMessage);
    }
  };

  const handleGoogleSignup = () => {
    // Placeholder for Google OAuth
    toast(t('register.googleComingSoon'), { icon: '🔜' });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-(--color-bg-card) rounded-2xl shadow-xl p-6 md:p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link to={ROUTES.home}>
            <img src={logo} alt="GrandLine Logo" className="h-16 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-(--color-text-primary) mb-2">
            {t('register.title')}
          </h1>
          <p className="text-sm md:text-base text-(--color-text-secondary)">
            {t('register.subtitle')}{' '}
            <span className="font-bold text-[#1e3a8a] dark:text-[#3b82f6]">
              GRANDLINE
            </span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name Field */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-(--color-text-primary) mb-2"
            >
              {t('register.fullNameLabel')}
            </label>
            <input
              id="fullName"
              type="text"
              {...register('fullName')}
              className={cn(
                'w-full px-4 py-3 rounded-lg',
                'border',
                'text-(--color-text-primary) placeholder-(--color-text-muted)',
                'focus:outline-none focus:ring-2 focus:ring-(--color-primary)',
                'transition-colors',
                errors.fullName
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-(--color-border) focus:border-(--color-primary)'
              )}
              placeholder={t('register.fullNamePlaceholder')}
              disabled={isLoading}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-(--color-text-primary) mb-2"
            >
              {t('register.emailLabel')}
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
              placeholder={t('register.emailPlaceholder')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-(--color-text-primary) mb-2"
            >
              {t('register.phoneLabel')}
            </label>
            <input
              id="phoneNumber"
              type="tel"
              {...register('phoneNumber')}
              className={cn(
                'w-full px-4 py-3 rounded-lg',
                'border',
                'text-(--color-text-primary) placeholder-(--color-text-muted)',
                'focus:outline-none focus:ring-2 focus:ring-(--color-primary)',
                'transition-colors',
                errors.phoneNumber
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-(--color-border) focus:border-(--color-primary)'
              )}
              placeholder={t('register.phonePlaceholder')}
              maxLength={10}
              disabled={isLoading}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-(--color-text-primary) mb-2"
            >
              {t('register.passwordLabel')}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={cn(
                  'w-full px-4 py-3 pr-12 rounded-lg',
                  'border',
                  'text-(--color-text-primary) placeholder-(--color-text-muted)',
                  'focus:outline-none focus:ring-2 focus:ring-(--color-primary)',
                  'transition-colors',
                  errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-(--color-border) focus:border-(--color-primary)'
                )}
                placeholder={t('register.passwordPlaceholder')}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors"
                aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
            <p className="mt-1 text-xs text-(--color-text-muted)">
              {t('register.passwordHint')}
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-(--color-text-primary) mb-2"
            >
              {t('register.confirmPasswordLabel')}
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
                placeholder={t('register.confirmPasswordPlaceholder')}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors"
                aria-label={showConfirmPassword ? t('login.hidePassword') : t('login.showPassword')}
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

          {/* Register Button */}
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
            {isLoading ? t('register.registering') : t('register.button')}
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

        {/* Google Signup Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
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
          <span>{t('register.continueWithGoogle')}</span>
        </button>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-(--color-text-secondary)">
            {t('register.haveAccount')}{' '}
            <Link
              to={ROUTES.login}
              className="font-bold text-(--color-primary) hover:text-(--color-primary-hover) transition-colors"
            >
              {t('register.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

