import { useState } from 'react';
import { Button } from '../../../components/common/button';
import { PasswordInput } from '../../../components/common/password_input';

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
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="px-3 sm:px-4 py-2 text-sm sm:text-base"
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="px-3 sm:px-4 py-2 text-sm sm:text-base"
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="px-3 sm:px-4 py-2 text-sm sm:text-base"
          />

          <div className="flex justify-end">
            <Button className="w-full sm:w-auto">Update Password</Button>
          </div>
        </div>
      </div>

    </div>
  );
};

