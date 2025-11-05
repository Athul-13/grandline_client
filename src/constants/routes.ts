/**
 * Application Route Constants
 * Centralized route paths to avoid hardcoded strings throughout the app
 */

export const ROUTES = {
  // Public routes
  home: '/',
  login: '/login',
  register: '/register',
  verifyOtp: '/verify-otp',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',

  // User protected routes
  dashboard: '/dashboard',
  quotes: '/quotes',
  reservations: '/reservations',
  support: '/support',
  buildQuote: '/build-quote',
  profile: {
    base: '/profile',
    myProfile: '/profile/my-profile',
    security: '/profile/security',
    notifications: '/profile/notifications',
    settings: '/profile/settings',
  },

  // Admin routes
  admin: {
    login: '/admin/login',
    dashboard: '/admin/dashboard',
    tripManagement: '/admin/trip-management',
    quotesReservations: '/admin/quotes-reservations',
    fleetManagement: '/admin/fleet-management',
    userManagement: '/admin/user-management',
    driverManagement: '/admin/driver-management',
    supportConcerns: '/admin/support-concerns',
    settings: '/admin/settings',
  },
} as const;

/**
 * Type for route paths
 */
export type RoutePath =
  | typeof ROUTES[keyof typeof ROUTES]
  | typeof ROUTES.admin[keyof typeof ROUTES.admin];

