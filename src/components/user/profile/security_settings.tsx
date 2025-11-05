import { useState } from 'react';
import { Button } from '../../../components/common/button';
import { PasswordInput } from '../../../components/common/password_input';
import { useLanguage } from '../../../hooks/use_language';

/**
 * Security Settings Component
 * Handles password change functionality
 */
export const SecuritySettings: React.FC = () => {
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Change Password Section */}
      <div className="pb-4 sm:pb-6">
        <h2 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] mb-3 sm:mb-4">
          {t('profile.security.changePassword')}
        </h2>
        <div className="space-y-3 sm:space-y-4 max-w-md">
          <PasswordInput
            label={t('profile.security.currentPassword')}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t('profile.security.currentPasswordPlaceholder')}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base"
          />

          <PasswordInput
            label={t('profile.security.newPassword')}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t('profile.security.newPasswordPlaceholder')}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base"
          />

          <PasswordInput
            label={t('profile.security.confirmPassword')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('profile.security.confirmPasswordPlaceholder')}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base"
          />

          <div className="flex justify-end">
            <Button className="w-full sm:w-auto">{t('profile.security.updatePassword')}</Button>
          </div>
        </div>
      </div>

    </div>
  );
};

