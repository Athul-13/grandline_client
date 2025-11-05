import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT, API_ENDPOINTS } from '../../constants/api';
import { ROUTES } from '../../constants/routes';
import { store } from '../../store/store';
import { clearAuth, refreshTokenAsync } from '../../store/slices/auth_slice';

/**
 * Create and configure Axios instance
 * Handles authentication, error handling, and request/response interceptors
 */
export const grandlineAxiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

grandlineAxiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get auth state from Redux store
    const state = store.getState();
    const { isAuthenticated, user } = state.auth;

    if (!config.url) {
      return config;
    }

    // Role-based API endpoint validation
    if (isAuthenticated && user) {
      const url = config.url;
      
      // Check if URL matches admin endpoints
      const isAdminEndpoint = Object.values(API_ENDPOINTS.admin).some(endpoint =>
        url.includes(endpoint)
      );
      
      // Check if URL matches user endpoints
      const isUserEndpoint = Object.values(API_ENDPOINTS.users).some(endpoint =>
        url.includes(endpoint)
      );

      // Block admin users from accessing user-specific endpoints
      if (user.role === 'admin' && isUserEndpoint) {
        return Promise.reject({
          message: 'Admins cannot access user endpoints',
          code: 'FORBIDDEN',
        });
      }

      // Block regular users from accessing admin endpoints
      if (user.role === 'user' && isAdminEndpoint) {
        return Promise.reject({
          message: 'Access denied. Admin privileges required.',
          code: 'FORBIDDEN',
        });
      }
    }


    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

grandlineAxiosClient.interceptors.response.use(
  (response) => {
    // Return successful response as-is
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle network errors
    if (!error.response) {
      // Network error (no internet, server down, etc.)
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      });
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized - Token expired or invalid
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Don't try to refresh if this is already a refresh, login, or logout request
      const isRefreshRequest = originalRequest.url?.includes(API_ENDPOINTS.auth.refreshToken);
      const isLoginRequest = originalRequest.url?.includes(API_ENDPOINTS.auth.login);
      const isLogoutRequest = originalRequest.url?.includes(API_ENDPOINTS.auth.logout);
      
      if (isRefreshRequest || isLoginRequest || isLogoutRequest) {
        // Extract the original error message from the response
        const errorMessage =
          (data as { message?: string })?.message ||
          (data as { error?: string })?.error ||
          'Your session has expired. Please login again.';

        // Check if this is an account verification error
        const isVerificationError =
          errorMessage.includes('Please verify your account to continue') ||
          errorMessage.includes('verify your account') ||
          errorMessage.toLowerCase().includes('verify');

        if (isLoginRequest && isVerificationError) {
          // For login requests with verification error, preserve the message
          // Let the login form handle the redirect to OTP page
          return Promise.reject({
            message: errorMessage,
            code: 'UNAUTHORIZED',
          });
        }

        // For logout requests with 401, just reject - don't clear auth here
        // Let the logout reducer handle clearing auth state
        if (isLogoutRequest) {
          return Promise.reject({
            message: errorMessage,
            code: 'UNAUTHORIZED',
          });
        }

        // For other 401 errors on login/refresh, clear auth and redirect based on role
        const currentState = store.getState();
        const userRole = currentState.auth.user?.role;
        store.dispatch(clearAuth());
        
        if (typeof window !== 'undefined') {
          // Role-based redirect
          const redirectPath = userRole === 'admin' ? ROUTES.admin.login : ROUTES.login;
          if (!window.location.pathname.includes('/login')) {
            window.location.href = redirectPath;
          }
        }
        
        return Promise.reject({
          message: errorMessage,
          code: 'UNAUTHORIZED',
        });
      }

      // Check if user is still authenticated before trying to refresh
      // If user is already logged out (e.g., after logout), don't try to refresh
      const currentState = store.getState();
      if (!currentState.auth.isAuthenticated) {
        // User is already logged out - don't try to refresh, just reject
        return Promise.reject({
          message: 'Your session has expired. Please login again.',
          code: 'UNAUTHORIZED',
        });
      }

      // Try to refresh the token
      try {
        const refreshResult = await store.dispatch(refreshTokenAsync()).unwrap();
        
        if (refreshResult.success) {
          // Refresh successful - retry the original request
          return grandlineAxiosClient(originalRequest);
        }
      } catch {
        // Refresh failed - clear auth and redirect based on role
        const currentState = store.getState();
        const userRole = currentState.auth.user?.role;
        store.dispatch(clearAuth());
        
        if (typeof window !== 'undefined') {
          // Role-based redirect
          const redirectPath = userRole === 'admin' ? ROUTES.admin.login : ROUTES.login;
          if (!window.location.pathname.includes('/login')) {
            window.location.href = redirectPath;
          }
        }
        
        return Promise.reject({
          message: 'Your session has expired. Please login again.',
          code: 'UNAUTHORIZED',
        });
      }
    }

    // Handle 403 Forbidden
    if (status === 403) {
      return Promise.reject({
        message: 'You do not have permission to access this resource.',
        code: 'FORBIDDEN',
      });
    }

    // Handle 404 Not Found
    if (status === 404) {
      return Promise.reject({
        message: 'The requested resource was not found.',
        code: 'NOT_FOUND',
      });
    }

    // Handle 500 Internal Server Error
    if (status >= 500) {
      return Promise.reject({
        message: 'Server error. Please try again later.',
        code: 'SERVER_ERROR',
      });
    }

    // Extract error message from response
    const errorMessage =
      (data as { message?: string })?.message ||
      (data as { error?: string })?.error ||
      error.message ||
      'An error occurred. Please try again.';

    return Promise.reject({
      message: errorMessage,
      code: status.toString(),
      data: data,
    });
  }
);

export default grandlineAxiosClient;

