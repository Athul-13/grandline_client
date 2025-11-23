import { useState } from 'react';
import { Button } from '../../../components/common/ui/button';
import { useLanguage } from '../../../hooks/use_language';

/**
 * Notification Settings Component
 * Handles notification preferences
 */
export const NotificationSettings: React.FC = () => {
  const { t } = useLanguage();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [quoteUpdates, setQuoteUpdates] = useState(true);
  const [reservationReminders, setReservationReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)] gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
              {t('profile.notifications.emailNotifications')}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              {t('profile.notifications.emailNotificationsDesc')}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--color-bg-secondary)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
          <div>
            <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
              {t('profile.notifications.quoteUpdates')}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {t('profile.notifications.quoteUpdatesDesc')}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={quoteUpdates}
              onChange={(e) => setQuoteUpdates(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--color-bg-secondary)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
          <div>
            <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
              {t('profile.notifications.reservationReminders')}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {t('profile.notifications.reservationRemindersDesc')}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={reservationReminders}
              onChange={(e) => setReservationReminders(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--color-bg-secondary)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
          <div>
            <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
              {t('profile.notifications.marketingEmails')}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {t('profile.notifications.marketingEmailsDesc')}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={marketingEmails}
              onChange={(e) => setMarketingEmails(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--color-bg-secondary)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-border)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
          </label>
        </div>
      </div>

          <div className="flex justify-end">
            <Button className="w-full sm:w-auto">{t('profile.notifications.savePreferences')}</Button>
          </div>
    </div>
  );
};

