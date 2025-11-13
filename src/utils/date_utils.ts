/**
 * Date/Time Utility Functions
 * Shared utilities for formatting and parsing dates/times
 */

/**
 * Format ISO date string to YYYY-MM-DD format
 */
export const formatDate = (isoString: string): string => {
  if (!isoString || isoString === '') return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

/**
 * Format ISO date string to HH:MM format
 */
export const formatTime = (isoString: string): string => {
  if (!isoString || isoString === '') return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
};

/**
 * Parse date and time values into ISO string
 */
export const parseDate = (dateValue: string, timeValue: string, fallback?: string): string => {
  if (!dateValue || !timeValue) {
    // If no fallback provided and values are empty, return empty string
    if (!fallback && (!dateValue || !timeValue)) return '';
    return fallback || new Date().toISOString();
  }
  const [hours, minutes] = timeValue.split(':');
  const date = new Date(dateValue);
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  return date.toISOString();
};

/**
 * Get minimum date/time for validation (current time or previous stop's time)
 */
export const getMinDateTime = (previousStopArrivalTime?: string | null): Date => {
  const now = new Date();
  if (previousStopArrivalTime) {
    const previousTime = new Date(previousStopArrivalTime);
    return previousTime > now ? previousTime : now;
  }
  return now;
};

