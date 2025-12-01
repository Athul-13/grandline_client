import { useState, useEffect } from 'react';
import { Button } from '../../../components/common/ui/button';
import { useLanguage } from '../../../hooks/use_language';
import { useTheme } from '../../../hooks/use_theme';
import { getSettings, saveSettings } from '../../../utils/settings';
import type { Language } from '../../../constants/languages';
import toast from 'react-hot-toast';
import { useDeleteAccount } from '../../../hooks/user/use_delete_account';
import { DeleteAccountModal } from './delete_account_modal';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { useAppDispatch } from '../../../store/hooks';
import { logoutAsync } from '../../../store/slices/auth_slice';

/**
 * Account Settings Component
 * Handles language, theme, and other account preferences
 */
export const AccountSettings: React.FC = () => {
  const { language: contextLanguage, setLanguage: setContextLanguage, t } = useLanguage();
  const { theme: contextTheme, setTheme: setContextTheme } = useTheme();
  
  const getValidTheme = (themeValue: string | undefined): 'light' | 'dark' | 'system' => {
    if (themeValue && ['light', 'dark', 'system'].includes(themeValue)) {
      return themeValue as 'light' | 'dark' | 'system';
    }
    return 'system';
  };
  
  const [language, setLanguage] = useState<Language>(contextLanguage);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(getValidTheme(contextTheme));
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deleteAccount, isLoading: isDeleting } = useDeleteAccount();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Load settings from localStorage on mount
  useEffect(() => {
    const settings = getSettings();
    if (settings) {
      const validLanguage = ['en', 'es', 'fr', 'de', 'hi', 'ar'].includes(settings.language)
        ? (settings.language as Language)
        : contextLanguage;
      const validTheme = getValidTheme(settings.theme);
      
      setLanguage(validLanguage);
      setTheme(validTheme);
    } else {
      setLanguage(contextLanguage);
      setTheme(getValidTheme(contextTheme));
    }
  }, [contextLanguage, contextTheme]);

  const handleSave = () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      saveSettings({ language, theme });
      
      // Update context providers
      setContextLanguage(language);
      setContextTheme(theme);
      
      toast.success(t('profile.accountSettings.saveSuccess'));
    } catch {
      toast.error(t('profile.accountSettings.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async (password: string) => {
    const response = await deleteAccount(password);
    if (response) {
      toast.success(response.message || 'Account deleted successfully');
      // Logout and redirect to home
      await dispatch(logoutAsync()).unwrap();
      navigate(ROUTES.home);
    } else {
      // Error is handled by the hook and will be shown in the modal
      throw new Error('Failed to delete account');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Language Selection */}
      <div className="border-b border-[var(--color-border)] pb-4 sm:pb-6">
        <h2 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] mb-3 sm:mb-4">
          {t('profile.accountSettings.language')}
        </h2>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            {t('profile.accountSettings.selectLanguage')}
          </label>
          <select
            value={language}
            onChange={(e) => {
              const value = e.target.value;
              if (['en', 'es', 'fr', 'de', 'hi', 'ar'].includes(value)) {
                setLanguage(value as Language);
              }
            }}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-card)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            disabled={isSaving}
          >
            <option value="en">{t('profile.accountSettings.languages.english')}</option>
            <option value="es">{t('profile.accountSettings.languages.spanish')}</option>
            <option value="fr">{t('profile.accountSettings.languages.french')}</option>
            <option value="de">{t('profile.accountSettings.languages.german')}</option>
            <option value="hi">{t('profile.accountSettings.languages.hindi')}</option>
            <option value="ar">{t('profile.accountSettings.languages.arabic')}</option>
          </select>
        </div>
      </div>

      {/* Theme Selection */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] mb-3 sm:mb-4">
          {t('profile.accountSettings.theme')}
        </h2>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            {t('profile.accountSettings.selectTheme')}
          </label>
          <div className="space-y-2 sm:space-y-3">
            <label className="flex items-center space-x-3 p-3 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg-hover)] bg-[var(--color-bg-card)]">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={(e) => {
                  if (['light', 'dark', 'system'].includes(e.target.value)) {
                    setTheme(e.target.value as 'light' | 'dark' | 'system');
                  }
                }}
                className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                disabled={isSaving}
              />
              <span className="text-sm text-[var(--color-text-primary)]">
                {t('profile.accountSettings.light')}
              </span>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg-hover)] bg-[var(--color-bg-card)]">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={(e) => {
                  if (['light', 'dark', 'system'].includes(e.target.value)) {
                    setTheme(e.target.value as 'light' | 'dark' | 'system');
                  }
                }}
                className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                disabled={isSaving}
              />
              <span className="text-sm text-[var(--color-text-primary)]">
                {t('profile.accountSettings.dark')}
              </span>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg-hover)] bg-[var(--color-bg-card)]">
              <input
                type="radio"
                name="theme"
                value="system"
                checked={theme === 'system'}
                onChange={(e) => {
                  if (['light', 'dark', 'system'].includes(e.target.value)) {
                    setTheme(e.target.value as 'light' | 'dark' | 'system');
                  }
                }}
                className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                disabled={isSaving}
              />
              <span className="text-sm text-[var(--color-text-primary)]">
                {t('profile.accountSettings.systemDefault')}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="w-full sm:w-auto"
          disabled={isSaving}
        >
          {isSaving ? t('profile.accountSettings.saving') : t('profile.accountSettings.saveSettings')}
        </Button>
      </div>

      {/* Delete Account Section */}
      <div className="border-t border-[var(--color-border)] pt-4 sm:pt-6 mt-4 sm:mt-6">
        <h2 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] mb-3 sm:mb-4">
          Danger Zone
        </h2>
        <div className="p-4 border border-amber-300 dark:border-amber-800 rounded-lg bg-amber-50 dark:bg-amber-900/10">
          <p className="text-sm text-[var(--color-text-primary)] mb-2">
            Deactivate your account. You will be logged out immediately.
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            You can reactivate your account later by registering again with the same email address.
          </p>
          <Button
            variant="outline"
            onClick={() => setShowDeleteModal(true)}
            className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300"
            disabled={isDeleting}
          >
            Deactivate Account
          </Button>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
      />
    </div>
  );
};

