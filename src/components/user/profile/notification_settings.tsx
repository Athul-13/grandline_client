import { useState } from 'react';
import { Button } from '../../../components/common/button';

/**
 * Notification Settings Component
 * Handles notification preferences
 */
export const NotificationSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [quoteUpdates, setQuoteUpdates] = useState(true);
  const [reservationReminders, setReservationReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-200 gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
            <p className="text-xs sm:text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-(--color-primary) rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--color-primary)"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Quote Updates</h3>
            <p className="text-sm text-gray-500">Get notified when your quotes are updated</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={quoteUpdates}
              onChange={(e) => setQuoteUpdates(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-(--color-primary) rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--color-primary)"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Reservation Reminders</h3>
            <p className="text-sm text-gray-500">Receive reminders about upcoming reservations</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={reservationReminders}
              onChange={(e) => setReservationReminders(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-(--color-primary) rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--color-primary)"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Marketing Emails</h3>
            <p className="text-sm text-gray-500">Receive promotional emails and updates</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={marketingEmails}
              onChange={(e) => setMarketingEmails(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-(--color-primary) rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--color-primary)"></div>
          </label>
        </div>
      </div>

          <div className="flex justify-end">
            <Button className="w-full sm:w-auto">Save Preferences</Button>
          </div>
    </div>
  );
};

