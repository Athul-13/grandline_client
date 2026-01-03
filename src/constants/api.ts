/**
 * API Constants
 * Base URLs and endpoint paths for API integration
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

/**
 * Socket.io Base URL
 * Used for socket.io connection
 */
export const SOCKET_BASE_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

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
    deleteAccount: '/user/account',
  },
  // Admin endpoints
  admin: {
    users: '/admin/users',
    userDetails: (id: string) => `/admin/users/${id}`,
    changeUserStatus: (id: string) => `/admin/users/${id}/status`,
    userStatistics: '/admin/users/statistics',
    drivers: '/admin/drivers',
    driverStatistics: '/admin/drivers/statistics',
    changeDriverStatus: (id: string) => `/admin/drivers/${id}/status`,
    bookings: '/admin/bookings',
    buses: '/admin/buses',
    routes: '/admin/routes',
    quotes: '/admin/quotes',
    quoteDetails: (id: string) => `/admin/quotes/${id}`,
    updateQuoteStatus: (id: string) => `/admin/quotes/${id}/status`,
    assignDriver: (id: string) => `/admin/quotes/${id}/assign-driver`,
    recalculateQuote: (id: string) => `/admin/quotes/${id}/recalculate`,
    trips: '/admin/trips',
    reservations: '/admin/reservations',
    reservationDetails: (id: string) => `/admin/reservations/${id}`,
    updateReservationStatus: (id: string) => `/admin/reservations/${id}/status`,
    addPassengers: (id: string) => `/admin/reservations/${id}/passengers`,
    changeDriver: (id: string) => `/admin/reservations/${id}/change-driver`,
    adjustVehicles: (id: string) => `/admin/reservations/${id}/adjust-vehicles`,
    updateItinerary: (id: string) => `/admin/reservations/${id}/itinerary`,
    processRefund: (id: string) => `/admin/reservations/${id}/refund`,
    cancelReservation: (id: string) => `/admin/reservations/${id}/cancel`,
    addCharge: (id: string) => `/admin/reservations/${id}/charges`,
    markChargeAsPaid: (id: string, chargeId: string) => `/admin/reservations/${id}/charges/${chargeId}/mark-paid`,
    exportPDF: (id: string) => `/admin/reservations/${id}/export/pdf`,
    exportCSV: (id: string) => `/admin/reservations/${id}/export/csv`,
    pricingConfig: {
      active: '/admin/pricing-config',
      create: '/admin/pricing-config',
      history: '/admin/pricing-config/history',
      activate: (id: string) => `/admin/pricing-config/${id}/activate`,
    },
  },
  // Fleet endpoints
  fleet: {
    vehicleTypes: '/vehicle-types',
    vehicleTypesById: (id: string) => `/vehicle-types/${id}`,
    vehicles: '/vehicles',
    vehiclesById: (id: string) => `/vehicles/${id}`,
    filterOptions: '/vehicles/filter-options',
    uploadSignature: '/vehicles/upload-signature',
    deleteImages: '/vehicles/images',
    amenities: '/amenities',
    amenitiesById: (id: string) => `/amenities/${id}`,
    amenitiesPaid: '/amenities/paid',
  },
  // Quote endpoints
  quotes: {
    list: '/quotes',
    getById: (id: string) => `/quotes/${id}`,
    create: '/quotes',
    update: (id: string) => `/quotes/${id}`,
    delete: (id: string) => `/quotes/${id}`,
    calculateRoutes: (id: string) => `/quotes/${id}/calculate-routes`,
    calculatePricing: (id: string) => `/quotes/${id}/calculate-pricing`,
    submit: (id: string) => `/quotes/${id}/submit`,
    recommendations: '/quotes/recommendations',
    payment: {
      getPage: (id: string) => `/quotes/${id}/payment`,
      createIntent: (id: string) => `/quotes/${id}/payment/create-intent`,
    },
  },
  // Event type endpoints
  eventTypes: {
    list: '/event-types',
    create: '/event-types',
  },
  // Chat endpoints
  chat: {
    list: '/chats',
    byContext: '/chats/by-context',
    create: '/chats',
  },
  // Message endpoints
  messages: {
    getByChat: (chatId: string) => `/messages/chat/${chatId}`,
    unreadCount: (chatId: string) => `/messages/chat/${chatId}/unread-count`,
    totalUnreadCount: '/messages/unread-count',
  },
  // Notification endpoints
  notifications: {
    list: '/notifications',
    create: '/notifications',
    markRead: (notificationId: string) => `/notifications/${notificationId}/mark-read`,
    markAllRead: '/notifications/mark-all-read',
    unreadCount: '/notifications/unread-count',
  },
  // Reservation endpoints
  reservations: {
    list: '/reservations',
    getById: (id: string) => `/reservations/${id}`,
    chargePayment: {
      createIntent: (reservationId: string, chargeId: string) => `/reservations/${reservationId}/charges/${chargeId}/payment/create-intent`,
    },
  },
  // Dashboard endpoints
  dashboard: {
    stats: '/dashboard/stats',
    activity: '/dashboard/activity',
    adminAnalytics: '/dashboard/admin/analytics',
  },
  // Support endpoints
  support: {
    tickets: '/support/tickets',
    ticketById: (id: string) => `/support/tickets/${id}`,
    ticketMessages: (id: string) => `/support/tickets/${id}/messages`,
    addMessage: (id: string) => `/support/tickets/${id}/messages`,
    updateStatus: (id: string) => `/support/tickets/${id}/status`,
    assignToAdmin: (id: string) => `/support/tickets/${id}/assign`,
  },
} as const;

/**
 * Request timeout in milliseconds
 */
export const REQUEST_TIMEOUT = 30000; // 30 seconds

