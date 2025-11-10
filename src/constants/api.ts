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
    google: '/auth/google',
    setupPassword: '/auth/setup-password',
    linkGoogle: '/auth/link-google',
  },
  // OTP endpoints
  otp: {
    verify: '/auth/otp/verify',
    resend: '/auth/otp/resend',
  },
  // User endpoints
  users: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
    changePassword: '/user/change-password',
    uploadProfileUrl: '/user/profile/upload-url',
  },
  // Admin endpoints
  admin: {
    users: '/admin/users',
    bookings: '/admin/bookings',
    buses: '/admin/buses',
    routes: '/admin/routes',
  },
  // Fleet endpoints
  fleet: {
    vehicleTypes: '/vehicle-types',
    vehicleTypesById: (id: string) => `/vehicle-types/${id}`,
    vehicles: '/vehicles',
    vehiclesById: (id: string) => `/vehicles/${id}`,
    filterOptions: '/vehicles/filter-options',
  },
} as const;

/**
 * Request timeout in milliseconds
 */
export const REQUEST_TIMEOUT = 30000; // 30 seconds

