import {
  format,
  formatDistance,
  formatRelative,
  isToday,
  isYesterday,
  parseISO,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';

/**
 * Format date to a readable string
 * @example formatDate(new Date()) // "Jan 15, 2024"
 */
export const formatDate = (date: Date | string, formatStr = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @example formatRelativeTime(new Date()) // "just now"
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

/**
 * Format date to relative format (e.g., "Today at 3:00 PM")
 * @example formatRelativeDate(new Date()) // "Today at 3:00 PM"
 */
export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatRelative(dateObj, new Date());
};

/**
 * Smart date formatter - shows "Today", "Yesterday", or formatted date
 * @example formatSmartDate(new Date()) // "Today at 3:00 PM"
 */
export const formatSmartDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'h:mm a')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'h:mm a')}`;
  }
  
  const daysDiff = differenceInDays(new Date(), dateObj);
  if (daysDiff < 7) {
    return format(dateObj, 'EEEE \'at\' h:mm a');
  }
  
  return format(dateObj, 'MMM dd, yyyy \'at\' h:mm a');
};

/**
 * Get time ago string (e.g., "2 minutes ago", "3 hours ago")
 */
export const getTimeAgo = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const minutes = differenceInMinutes(new Date(), dateObj);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  
  const hours = differenceInHours(new Date(), dateObj);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = differenceInDays(new Date(), dateObj);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};

