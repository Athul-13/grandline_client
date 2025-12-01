import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useLanguage } from '../../../hooks/use_language';
import { loginAsync, googleAuthAsync, clearAuth } from '../../../store/slices/auth_slice';
import { loginSchema, type LoginFormData } from '../../../types/auth/login';
import toast from 'react-hot-toast';
import { PasswordInput } from '../../common/forms/password_input';
import { rateLimiter, resetRateLimit } from '../../../utils/rate_limiter';
import { sanitizeErrorMessage, logErrorForDev } from '../../../utils/error_sanitizer';
import { ROUTES } from '../../../constants/routes';
import { FormInput } from '../../common/forms/form_input';
import { AuthFormCard } from '../auth_form_card';
import { ErrorMessage } from '../../common/ui/error_message';
import { Button } from '../../common/ui/button';

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

      // Check for account status errors
      const errorLower = sanitizedMessage.toLowerCase();
      const errorData = err && typeof err === 'object' && 'data' in err ? (err as { data?: unknown }).data : null;
      
      // Check if error contains account inactive message
      if (
        errorLower.includes('account is inactive') ||
        errorLower.includes('inactive') ||
        (errorData && typeof errorData === 'object' && 'code' in errorData && errorData.code === 'ACCOUNT_INACTIVE')
      ) {
        toast.error('Your account is inactive. Please contact support.');
        return;
      }

      // Check if error contains account blocked message
      if (
        errorLower.includes('account has been blocked') ||
        errorLower.includes('account is blocked') ||
        errorLower.includes('blocked') ||
        (errorData && typeof errorData === 'object' && 'code' in errorData && errorData.code === 'ACCOUNT_BLOCKED')
      ) {
        toast.error('Your account has been blocked. Please contact support.');
        return;
      }

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

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      toast.error('Google authentication failed. Please try again.');
      return;
    }

    try {
      const result = await dispatch(googleAuthAsync(credentialResponse.credential)).unwrap();

      if (result.success) {
        // Block admin users from using Google login
        if (result.user.role === 'admin') {
          toast.error('Admins cannot use Google authentication. Please use the admin login page.');
          dispatch(clearAuth());
          return;
        }

        toast.success(t('login.success'));
        toast(t('login.googleAuthSuccess'), {
          icon: 'ℹ️',
          duration: 5000,
        });
        navigate(ROUTES.dashboard);
      }
    } catch (err) {
      const sanitizedMessage = sanitizeErrorMessage(err);
      logErrorForDev(err, sanitizedMessage);
      toast.error(sanitizedMessage);
    }
  };

  const handleGoogleError = () => {
    toast.error(t('login.googleAuthError'));
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
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={isLoading}
            loadingText={t('login.loggingIn')}
          >
            {t('login.button')}
          </Button>

          {/* Error Message */}
          <ErrorMessage message={error || ''} />
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
        <div className="w-full [&>div]:w-full [&>div>div]:w-full [&>div>div]:!min-h-[48px]">
          {!isLoading && (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              locale="en"
            />
          )}
        </div>

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

