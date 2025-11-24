import { useContext } from 'react';
import { NotificationContext } from '../../contexts/notification_context';

/**
 * Hook to use notification context
 * Separated to avoid Fast Refresh issues
 */
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

