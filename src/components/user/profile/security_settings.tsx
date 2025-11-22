import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/common/button';
import { PasswordInput } from '../../../components/common/password_input';
import { useLanguage } from '../../../hooks/use_language';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setupPasswordAsync } from '../../../store/slices/auth_slice';
import { useProfileQuery } from '../../../hooks/profile/use_profile_query';
import { userService } from '../../../services/api/user_service';
import toast from 'react-hot-toast';
import { sanitizeErrorMessage, logErrorForDev } from '../../../utils/error_sanitizer';

const setupPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Password cannot be empty or contain only spaces',
    })
    .refine((val) => val.trim().length >= 8, {
      message: 'Password must be at least 8 characters',
    }),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password')
    .refine((val) => val.trim().length > 0, {
      message: 'Password confirmation cannot be empty or contain only spaces',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required')
    .refine((val) => val.trim().length > 0, {
      message: 'Current password cannot be empty or contain only spaces',
    }),
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .refine((val) => val.trim().length > 0, {
      message: 'New password cannot be empty or contain only spaces',
    })
    .refine((val) => val.trim().length >= 8, {
      message: 'Password must be at least 8 characters',
    }),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password')
    .refine((val) => val.trim().length > 0, {
      message: 'Password confirmation cannot be empty or contain only spaces',
    }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SetupPasswordFormData = z.infer<typeof setupPasswordSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/**
 * Security Settings Component
 * Handles password setup (for Google-authenticated users) and password change
 */
export const SecuritySettings: React.FC = () => {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const { isLoading: authLoading } = useAppSelector((state) => state.auth);
  // Use TanStack Query for profile data instead of Redux
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useProfileQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get hasPassword from profile data
  const hasPassword = profile?.hasPassword ?? false;

  // Setup Password Form (for Google-authenticated users)
  const {
    register: registerSetup,
    handleSubmit: handleSetupSubmit,
    formState: { errors: setupErrors },
    reset: resetSetup,
  } = useForm<SetupPasswordFormData>({
    resolver: zodResolver(setupPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Change Password Form (for users with existing password)
  const {
    register: registerChange,
    handleSubmit: handleChangeSubmit,
    formState: { errors: changeErrors },
    reset: resetChange,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSetupPassword = async (data: SetupPasswordFormData) => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(setupPasswordAsync(data.password)).unwrap();
      toast.success(result.message || 'Password set up successfully');
      resetSetup();
      // Refetch profile to get updated hasPassword value
      await refetchProfile();
    } catch (err) {
      const sanitizedMessage = sanitizeErrorMessage(err);
      logErrorForDev(err, sanitizedMessage);
      toast.error(sanitizedMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChangePassword = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);
    try {
      const result = await userService.changePassword(data.currentPassword, data.newPassword);
      toast.success(result.message || 'Password changed successfully');
      resetChange();
      // Refetch profile to ensure data is up to date
      await refetchProfile();
    } catch (err) {
      const sanitizedMessage = sanitizeErrorMessage(err);
      logErrorForDev(err, sanitizedMessage);
      toast.error(sanitizedMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loading = authLoading || profileLoading || isSubmitting;

  // Show loading state while profile is being fetched
  if (profileLoading && !profile) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-sm text-[var(--color-text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Setup Password Section (for Google-authenticated users) */}
      {!hasPassword && (
        <div className="pb-4 sm:pb-6">
          <h2 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] mb-3 sm:mb-4">
            {t('profile.security.setupPassword') || 'Setup Password'}
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            {t('profile.security.setupPasswordDescription') || 
              'Set up a password for your account to enable email/password login in addition to Google authentication.'}
          </p>
          <form onSubmit={handleSetupSubmit(onSetupPassword)} className="space-y-3 sm:space-y-4 max-w-md">
            <PasswordInput
              label={t('profile.security.newPassword') || 'New Password'}
              {...registerSetup('password')}
              error={setupErrors.password?.message}
              placeholder={t('profile.security.newPasswordPlaceholder') || 'Enter new password'}
              disabled={loading}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base"
            />

            <PasswordInput
              label={t('profile.security.confirmPassword') || 'Confirm Password'}
              {...registerSetup('confirmPassword')}
              error={setupErrors.confirmPassword?.message}
              placeholder={t('profile.security.confirmPasswordPlaceholder') || 'Confirm new password'}
              disabled={loading}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base"
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? (t('profile.security.settingUp') || 'Setting up...') : (t('profile.security.setupPassword') || 'Setup Password')}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Section (for users with existing password) */}
      {hasPassword && (
        <div className="pb-4 sm:pb-6">
          <h2 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] mb-3 sm:mb-4">
            {t('profile.security.changePassword') || 'Change Password'}
          </h2>
          <form onSubmit={handleChangeSubmit(onChangePassword)} className="space-y-3 sm:space-y-4 max-w-md">
            <PasswordInput
              label={t('profile.security.currentPassword') || 'Current Password'}
              {...registerChange('currentPassword')}
              error={changeErrors.currentPassword?.message}
              placeholder={t('profile.security.currentPasswordPlaceholder') || 'Enter current password'}
              disabled={loading}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base"
            />

            <PasswordInput
              label={t('profile.security.newPassword') || 'New Password'}
              {...registerChange('newPassword')}
              error={changeErrors.newPassword?.message}
              placeholder={t('profile.security.newPasswordPlaceholder') || 'Enter new password'}
              disabled={loading}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base"
            />

            <PasswordInput
              label={t('profile.security.confirmPassword') || 'Confirm Password'}
              {...registerChange('confirmPassword')}
              error={changeErrors.confirmPassword?.message}
              placeholder={t('profile.security.confirmPasswordPlaceholder') || 'Confirm new password'}
              disabled={loading}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base"
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? (t('profile.security.updating') || 'Updating...') : (t('profile.security.updatePassword') || 'Update Password')}
              </Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
