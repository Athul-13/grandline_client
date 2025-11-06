import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useLanguage } from '../../hooks/use_language';
import { registerAsync, googleAuthAsync, clearAuth } from '../../store/slices/auth_slice';
import { registerSchema, type RegisterFormData } from '../../types/auth/register';
import toast from 'react-hot-toast';
import { PasswordInput } from '../common/password_input';
import { rateLimiter, resetRateLimit } from '../../utils/rate_limiter';
import { sanitizeErrorMessage, logErrorForDev } from '../../utils/error_sanitizer';
import { ROUTES } from '../../constants/routes';
import { FormInput } from '../common/form_input';
import { AuthFormCard } from './auth_form_card';
import { ErrorMessage } from '../common/error_message';
import { Button } from '../common/button';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const { isLoading, error } = useAppSelector((state) => state.auth);

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

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      toast.error('Google authentication failed. Please try again.');
      return;
    }

    try {
      const result = await dispatch(googleAuthAsync(credentialResponse.credential)).unwrap();

      if (result.success) {
        // Block admin users from using Google signup
        if (result.user.role === 'admin') {
          toast.error('Admins cannot use Google authentication. Please use the admin login page.');
          dispatch(clearAuth());
          return;
        }

        toast.success(t('register.success'));
        toast(t('register.googleAuthSuccess'), {
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
    toast.error(t('register.googleAuthError'));
  };

  return (
    <AuthFormCard
      title={t('register.title')}
      subtitle={
        <>
          {t('register.subtitle')}{' '}
          <span className="font-bold text-[#1e3a8a] dark:text-[#3b82f6]">
            GRANDLINE
          </span>
        </>
      }
      logoLink={ROUTES.home}
    >
      {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name Field */}
          <FormInput
            label={t('register.fullNameLabel')}
            type="text"
            {...register('fullName')}
            error={errors.fullName?.message}
            placeholder={t('register.fullNamePlaceholder')}
            disabled={isLoading}
          />

          {/* Email Field */}
          <FormInput
            label={t('register.emailLabel')}
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder={t('register.emailPlaceholder')}
            disabled={isLoading}
          />

          {/* Phone Number Field */}
          <FormInput
            label={t('register.phoneLabel')}
            type="tel"
            {...register('phoneNumber')}
            error={errors.phoneNumber?.message}
            placeholder={t('register.phonePlaceholder')}
            maxLength={10}
            disabled={isLoading}
          />

          {/* Password Field */}
          <PasswordInput
            label={t('register.passwordLabel')}
            {...register('password')}
            error={errors.password?.message}
            placeholder={t('register.passwordPlaceholder')}
            disabled={isLoading}
            hint={t('register.passwordHint')}
            showPasswordLabel={{
              show: t('login.showPassword'),
              hide: t('login.hidePassword'),
            }}
          />

          {/* Confirm Password Field */}
          <PasswordInput
            label={t('register.confirmPasswordLabel')}
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            placeholder={t('register.confirmPasswordPlaceholder')}
            disabled={isLoading}
            showPasswordLabel={{
              show: t('login.showPassword'),
              hide: t('login.hidePassword'),
            }}
          />

          {/* Register Button */}
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={isLoading}
            loadingText={t('register.registering')}
          >
            {t('register.button')}
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

        {/* Google Signup Button */}
        <div className="w-full [&>div]:w-full [&>div>div]:w-full [&>div>div]:!min-h-[48px]">
          {!isLoading && (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              text="signup_with"
              shape="rectangular"
              locale="en"
            />
          )}
        </div>

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
    </AuthFormCard>
  );
};

