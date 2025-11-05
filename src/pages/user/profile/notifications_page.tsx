import { NotificationSettings } from '../../../components/user/profile/notification_settings';

/**
 * Notifications Page
 * Displays notification preferences
 */
export const NotificationsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Notifications</h1>
      <NotificationSettings />
    </div>
  );
};

