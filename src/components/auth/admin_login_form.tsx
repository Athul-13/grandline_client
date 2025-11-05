import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
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
import { AuthFormCard } from './auth_form_card';
import { ErrorMessage } from '../common/error_message';
import { Button } from '../common/button';

export const AdminLoginForm: React.FC = () => {
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

        // Block regular users from using admin login page
        if (result.user.role !== 'admin') {
          toast.error('Regular users must use the user login page');
          navigate(ROUTES.login);
          return;
        }

        toast.success('Admin login successful');
        navigate(ROUTES.admin.dashboard);
      }
    } catch (err) {
      // Sanitize error message
      const sanitizedMessage = sanitizeErrorMessage(err);
      logErrorForDev(err, sanitizedMessage);
      toast.error(sanitizedMessage);
    }
  };

  return (
    <AuthFormCard
      title="Admin Login"
      subtitle="Sign in to access the admin dashboard"
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

          {/* Remember Me */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="w-4 h-4 rounded border-(--color-border) text-(--color-primary) focus:ring-(--color-primary) focus:ring-2"
                disabled={isLoading}
              />
              <span className="text-sm text-(--color-text-primary)">{t('login.rememberMe')}</span>
            </label>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={isLoading}
            loadingText={t('login.loggingIn')}
          >
            Admin Login
          </Button>

          {/* Error Message */}
          <ErrorMessage message={error || ''} />
        </form>
    </AuthFormCard>
  );
};

