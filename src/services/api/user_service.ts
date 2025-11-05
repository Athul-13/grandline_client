import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  GetProfileResponse,
  GetUploadUrlResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '../../types/profile/user_profile';

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
};

