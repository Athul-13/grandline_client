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

  // Remove file paths and URLs (but preserve the error context)
  message = message.replace(/\/[^\s]+/g, '[path]');
  message = message.replace(/https?:\/\/[^\s]+/g, '[url]');

  // Remove internal error codes (e.g., [ERROR_CODE], SQLSTATE[23000])
  // But keep the error message that follows
  message = message.replace(/\[[A-Z0-9_]+\]\s*/g, '');
  message = message.replace(/SQLSTATE\[[^\]]+\]\s*/g, '');

  // Remove common internal error patterns (stack trace patterns)
  message = message.replace(/at\s+\w+\.\w+\s*\([^)]+\)/g, '');
  message = message.replace(/Error:\s*/gi, '');
  message = message.replace(/Exception:\s*/gi, '');

  // Remove sensitive patterns that might expose internal structure
  // Remove absolute file paths (but keep relative error context)
  message = message.replace(/[A-Z]:\\[^\s]+/g, '[path]');
  message = message.replace(/\/[a-z0-9_\-]+\/[a-z0-9_\-]+\/[^\s]+/gi, '[path]');

  // Remove email addresses (might be in error messages)
  message = message.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]');

  // Remove potential API keys or tokens (long alphanumeric strings)
  message = message.replace(/\b[a-zA-Z0-9]{32,}\b/g, '[token]');

  // Clean up multiple spaces and trim
  message = message.replace(/\s+/g, ' ').trim();

  // Limit message length to prevent extremely long error messages
  if (message.length > 200) {
    message = message.substring(0, 200) + '...';
  }

  // If message is empty or too short after sanitization, return default
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

