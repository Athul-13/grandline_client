import { useState } from 'react';
import { Button } from '../../../components/common/button';

/**
 * Security Settings Component
 * Handles password change functionality
 */
export const SecuritySettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Change Password Section */}
      <div className="pb-4 sm:pb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Change Password</h2>
        <div className="space-y-3 sm:space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex justify-end">
            <Button className="w-full sm:w-auto">Update Password</Button>
          </div>
        </div>
      </div>

    </div>
  );
};

