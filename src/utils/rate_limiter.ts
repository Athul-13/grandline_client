/**
 * Rate limiting configuration for different actions
 */
export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // Time window in milliseconds
}

/**
 * Attempt record stored in memory
 */
interface AttemptRecord {
  count: number;
  firstAttempt: number; // Timestamp of first attempt in window
  lastAttempt: number; // Timestamp of last attempt
}

/**
 * In-memory storage for rate limit attempts
 * Clears on page refresh (for security - prevents localStorage manipulation)
 */
const attempts = new Map<string, AttemptRecord>();

/**
 * Default rate limit configurations for different actions
 */
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  login: {
    maxAttempts: 5,
    windowMs: 60000, // 5 attempts per minute
  },
  register: {
    maxAttempts: 3,
    windowMs: 300000, // 3 attempts per 5 minutes
  },
  'forgot-password': {
    maxAttempts: 3,
    windowMs: 3600000, // 3 attempts per hour
  },
  'reset-password': {
    maxAttempts: 5,
    windowMs: 300000, // 5 attempts per 5 minutes
  },
  'verify-otp': {
    maxAttempts: 10,
    windowMs: 60000, // 10 attempts per minute
  },
  'resend-otp': {
    maxAttempts: 3,
    windowMs: 60000, // 3 attempts per minute
  },
};

/**
 * Rate limiter result
 */
export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number; // Seconds until retry is allowed
  remainingAttempts?: number; // Remaining attempts in current window
}

/**
 * Checks if an action is allowed based on rate limiting
 */
export const rateLimiter = (
  action: string,
  customConfig?: RateLimitConfig
): RateLimitResult => {
  const config = customConfig || RATE_LIMIT_CONFIGS[action] || {
    maxAttempts: 5,
    windowMs: 60000,
  };

  const key = `rate_limit_${action}`;
  const now = Date.now();
  const record = attempts.get(key);

  // No previous attempts or window expired - start fresh
  if (!record || now - record.firstAttempt >= config.windowMs) {
    attempts.set(key, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - 1,
    };
  }

  // Check if limit exceeded
  if (record.count >= config.maxAttempts) {
    const timeUntilReset = config.windowMs - (now - record.firstAttempt);
    const retryAfter = Math.ceil(timeUntilReset / 1000); // Convert to seconds
    
    return {
      allowed: false,
      retryAfter,
      remainingAttempts: 0,
    };
  }

  // Increment count (within window and under limit)
  record.count++;
  record.lastAttempt = now;
  attempts.set(key, record);

  return {
    allowed: true,
    remainingAttempts: config.maxAttempts - record.count,
  };
};

/**
 * Resets rate limit for an action (call on successful action)
 */
export const resetRateLimit = (action: string): void => {
  const key = `rate_limit_${action}`;
  attempts.delete(key);
};

/**
 * Gets remaining attempts for an action
 */
export const getRemainingAttempts = (action: string): number | undefined => {
  const key = `rate_limit_${action}`;
  const record = attempts.get(key);
  
  if (!record) {
    return undefined;
  }

  const config = RATE_LIMIT_CONFIGS[action] || {
    maxAttempts: 5,
    windowMs: 60000,
  };

  const now = Date.now();
  
  // If window expired, return undefined
  if (now - record.firstAttempt >= config.windowMs) {
    return undefined;
  }

  return Math.max(0, config.maxAttempts - record.count);
};

