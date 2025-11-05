import { AccountSettings } from '../../../components/user/profile/account_settings';

/**
 * Account Settings Page
 * Displays account settings (language, theme, etc.)
 */
export const AccountSettingsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Account Settings</h1>
      <AccountSettings />
    </div>
  );
};

