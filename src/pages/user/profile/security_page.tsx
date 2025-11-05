import { useLanguage } from '../../../hooks/use_language';
import { SecuritySettings } from '../../../components/user/profile/security_settings';

/**
 * Security Page
 * Displays security settings (password change, 2FA, etc.)
 */
export const SecurityPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-4 sm:mb-6">
        {t('profile.security.title')}
      </h1>
      <SecuritySettings />
    </div>
  );
};

