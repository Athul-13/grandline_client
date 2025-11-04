/**
 * API Constants
 * Base URLs and endpoint paths for API integration
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

/**
 * API Endpoints
 * Organized by feature/resource
 */
export const API_ENDPOINTS = {
  // Authentication endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    checkAuth: '/auth/me',
    refreshToken: '/auth/token/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  // OTP endpoints
  otp: {
    verify: '/auth/otp/verify',
    resend: '/auth/otp/resend',
  },
  // User endpoints
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    changePassword: '/users/change-password',
  },
  // Admin endpoints
  admin: {
    users: '/admin/users',
    bookings: '/admin/bookings',
    buses: '/admin/buses',
    routes: '/admin/routes',
  },
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Request timeout in milliseconds
 */
export const REQUEST_TIMEOUT = 30000; // 30 seconds

