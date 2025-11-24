import { useContext } from 'react';
import { NotificationContext } from '../../contexts/notification_context_instance';
import type { NotificationContextValue } from '../../contexts/notification_context_value';

/**
 * Hook to use notification context
 * Separated to avoid Fast Refresh issues
 */
export const useNotificationContext = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

