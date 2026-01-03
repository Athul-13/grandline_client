/**
 * Chat Date Utilities
 * Helper functions for formatting dates and times in chat messages
 */

/**
 * Format time only (locale-aware, 12h or 24h based on browser locale)
 */
export const formatMessageTime = (date: string | Date): string => {
  try {
    const messageDate = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(messageDate);
  } catch {
    return '';
  }
};

/**
 * Get date label for date separator (Today / Yesterday / formatted date)
 */
export const getDateLabel = (date: string | Date): string => {
  try {
    const messageDate = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare dates only
    const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (messageDateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else {
      // Format date (locale-aware)
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      }).format(messageDate);
    }
  } catch {
    return '';
  }
};

/**
 * Check if two dates are on different days
 */
export const isDifferentDay = (date1: string | Date, date2: string | Date): boolean => {
  try {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
    
    return (
      d1.getFullYear() !== d2.getFullYear() ||
      d1.getMonth() !== d2.getMonth() ||
      d1.getDate() !== d2.getDate()
    );
  } catch {
    return false;
  }
};

