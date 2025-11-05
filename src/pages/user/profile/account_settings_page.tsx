import { useLanguage } from '../../../hooks/use_language';
import { AccountSettings } from '../../../components/user/profile/account_settings';

/**
 * Account Settings Page
 * Displays account settings (language, theme, etc.)
 */
export const AccountSettingsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-4 sm:mb-6">
        {t('profile.accountSettings.title')}
      </h1>
      <AccountSettings />
    </div>
  );
};

