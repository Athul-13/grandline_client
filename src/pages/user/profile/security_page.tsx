import { SecuritySettings } from '../../../components/user/profile/security_settings';

/**
 * Security Page
 * Displays security settings (password change, 2FA, etc.)
 */
export const SecurityPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Security</h1>
      <SecuritySettings />
    </div>
  );
};

