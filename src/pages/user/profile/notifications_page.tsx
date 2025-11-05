import { useLanguage } from '../../../hooks/use_language';
import { NotificationSettings } from '../../../components/user/profile/notification_settings';

/**
 * Notifications Page
 * Displays notification preferences
 */
export const NotificationsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-4 sm:mb-6">
        {t('profile.notifications.title')}
      </h1>
      <NotificationSettings />
    </div>
  );
};

