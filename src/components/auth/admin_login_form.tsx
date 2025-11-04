import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useLanguage } from '../../hooks/use_language';
import { loginAsync } from '../../store/slices/auth_slice';
import { loginSchema, type LoginFormData } from '../../types/auth/login';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/logo.png';

export const AdminLoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

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
    try {
      const result = await dispatch(
        loginAsync({
          email: data.email,
          password: data.password,
        })
      ).unwrap();

      // Check if login was successful
      if (result.success) {
        // Block regular users from using admin login page
        if (result.user.role !== 'admin') {
          toast.error('Regular users must use the user login page');
          navigate('/login');
          return;
        }

        toast.success('Admin login successful');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      // Extract error message - handle Error instances, error objects, and strings from Redux rejectWithValue
      let message = t('login.error');
      if (typeof err === 'string') {
        // Redux rejectWithValue throws the value directly as a string
        message = err;
      } else if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null) {
        message = (err as { message?: string })?.message || t('login.error');
      }
      
      toast.error(message);
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
            Admin Login
          </h1>
          <p className="text-sm md:text-base text-(--color-text-secondary)">
            Sign in to access the admin dashboard
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
              {t('login.emailLabel')}
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
              placeholder={t('login.emailPlaceholder')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-(--color-text-primary) mb-2"
            >
              {t('login.passwordLabel')}
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
                placeholder={t('login.passwordPlaceholder')}
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
          </div>

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
            {isLoading ? t('login.loggingIn') : 'Admin Login'}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

