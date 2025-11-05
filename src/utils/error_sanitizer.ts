/**
 * Sanitizes error messages to prevent exposing sensitive information
 * Removes stack traces, file paths, internal error codes, and other sensitive data
 */
export const sanitizeErrorMessage = (error: unknown): string => {
  let message = 'An error occurred. Please try again.';

  // Extract message from various error types
  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object') {
    if ('message' in error) {
      message = String((error as { message: unknown }).message);
    } else if ('error' in error) {
      message = String((error as { error: unknown }).error);
    }
  }

  // Remove stack traces (everything after first line break)
  message = message.split('\n')[0].trim();

  // Remove file paths and URLs
  message = message.replace(/\/[^\s]+/g, '[path]');
  message = message.replace(/https?:\/\/[^\s]+/g, '[url]');

  // Remove internal error codes (e.g., [ERROR_CODE], SQLSTATE[23000])
  message = message.replace(/\[[A-Z0-9_]+\]/g, '');
  message = message.replace(/SQLSTATE\[[^\]]+\]/g, '');

  // Remove common internal error patterns
  message = message.replace(/at\s+\w+\.\w+\s*\([^)]+\)/g, '');
  message = message.replace(/Error:\s*/gi, '');
  message = message.replace(/Exception:\s*/gi, '');

  // Handle database-related errors
  if (
    message.toLowerCase().includes('sql') ||
    message.toLowerCase().includes('database') ||
    message.toLowerCase().includes('connection') ||
    message.toLowerCase().includes('query') ||
    message.toLowerCase().includes('constraint')
  ) {
    return 'A database error occurred. Please try again later.';
  }

  // Handle network errors
  if (
    message.toLowerCase().includes('network') ||
    message.toLowerCase().includes('fetch') ||
    message.toLowerCase().includes('timeout') ||
    message.toLowerCase().includes('connection refused')
  ) {
    return 'Network error. Please check your connection and try again.';
  }

  // Handle authentication errors
  if (
    message.toLowerCase().includes('unauthorized') ||
    message.toLowerCase().includes('forbidden') ||
    message.toLowerCase().includes('token') ||
    message.toLowerCase().includes('session')
  ) {
    return 'Your session has expired. Please login again.';
  }

  // Handle validation errors (keep these as they're user-friendly)
  if (
    message.toLowerCase().includes('required') ||
    message.toLowerCase().includes('invalid') ||
    message.toLowerCase().includes('must') ||
    message.toLowerCase().includes('should')
  ) {
    // Keep validation messages but clean them up
    message = message.replace(/^.*?:\s*/i, ''); // Remove prefix like "Error: "
    return message;
  }

  // Limit message length
  if (message.length > 200) {
    message = message.substring(0, 200) + '...';
  }

  // Final cleanup - remove multiple spaces
  message = message.replace(/\s+/g, ' ').trim();

  // If message is empty or too short, return default
  if (!message || message.length < 3) {
    return 'An error occurred. Please try again.';
  }

  return message;
};

/**
 * Logs original error in development mode while showing sanitized message to users
 */
export const logErrorForDev = (error: unknown, sanitizedMessage: string): void => {
  if (import.meta.env.DEV) {
    console.error('Original error:', error);
    console.log('Sanitized message:', sanitizedMessage);
  }
};

