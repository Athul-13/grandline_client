import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  GetProfileResponse,
  GetUploadUrlResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '../../types/profile/user_profile';
import type {
  AdminUserListResponse,
  AdminUserListParams,
  AdminUserDetailsResponse,
} from '../../types/users/admin_user';

/**
 * User Service
 */
export const userService = {
  /**
   * Fetch user profile
   * GET /api/v1/user/profile
   */
  getProfile: async (): Promise<GetProfileResponse> => {
    const response = await grandlineAxiosClient.get<GetProfileResponse>(
      API_ENDPOINTS.users.profile
    );
    return response.data;
  },

  /**
   * Update user profile
   * PATCH /api/v1/user/profile
   */
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> => {
    const response = await grandlineAxiosClient.patch<UpdateProfileResponse>(
      API_ENDPOINTS.users.updateProfile,
      data
    );
    return response.data;
  },

  /**
   * Get Cloudinary upload URL and signed parameters
   * GET /api/v1/user/profile/upload-url
   */
  getUploadUrl: async (): Promise<GetUploadUrlResponse> => {
    const response = await grandlineAxiosClient.get<GetUploadUrlResponse>(
      API_ENDPOINTS.users.uploadProfileUrl
    );
    return response.data;
  },

  /**
   * Change user password
   * POST /api/v1/user/change-password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await grandlineAxiosClient.post<{ message: string }>(
      API_ENDPOINTS.users.changePassword,
      { currentPassword, newPassword }
    );
    return response.data;
  },

  /**
   * Get admin users list (with optional pagination, search, filters, and sorting)
   * GET /api/v1/admin/users?page=1&limit=20&status=active&status=inactive&isVerified=true&search=john&sortBy=email&sortOrder=asc
   */
  getAdminUsers: async (params?: AdminUserListParams): Promise<AdminUserListResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Handle array values (status filter)
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((v) => queryParams.append(key, String(v)));
          } else if (typeof value === 'boolean') {
            queryParams.append(key, String(value));
          } else if (typeof value === 'string' || typeof value === 'number') {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.admin.users}?${queryString}` : API_ENDPOINTS.admin.users;
    
    const response = await grandlineAxiosClient.get<AdminUserListResponse>(url);
    return response.data;
  },

  /**
   * Get admin user details
   * GET /api/v1/admin/users/:userId
   */
  getAdminUserDetails: async (userId: string): Promise<AdminUserDetailsResponse> => {
    const response = await grandlineAxiosClient.get<AdminUserDetailsResponse>(
      API_ENDPOINTS.admin.userDetails(userId)
    );
    return response.data;
  },
};

