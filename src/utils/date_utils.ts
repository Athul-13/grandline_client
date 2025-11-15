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

/**
 * Format ISO date string to short date format: "Sat, Nov 15"
 */
export const formatShortDate = (isoString: string | null | undefined): string => {
  if (!isoString || isoString === '') return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    
    return `${dayName}, ${monthName} ${day}`;
  } catch {
    return '';
  }
};

/**
 * Format ISO date string to 12-hour time format: "9:00 am"
 */
export const format12HourTime = (isoString: string | null | undefined): string => {
  if (!isoString || isoString === '') return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  } catch {
    return '';
  }
};

/**
 * Add duration (in seconds) to an ISO date string
 */
export const addDurationToDate = (isoString: string, durationSeconds: number): string => {
  if (!isoString || isoString === '') return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    
    date.setSeconds(date.getSeconds() + durationSeconds);
    return date.toISOString();
  } catch {
    return '';
  }
};

