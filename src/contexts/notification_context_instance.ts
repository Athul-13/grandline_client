import { createContext } from 'react';
import type { NotificationContextValue } from './notification_context_value';

/**
 * Notification Context Instance
 * Exported separately to avoid Fast Refresh issues
 */
export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

