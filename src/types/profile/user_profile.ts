/**
 * User Profile Types
 * Types for profile-related data separate from authentication
 */

export interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface GetProfileResponse {
  success: boolean;
  user: UserProfile;
}

export interface UpdateProfileRequest {
  fullName?: string; // Optional, min 3 chars
  phoneNumber?: string; // Optional, exactly 10 digits
  profilePicture?: string; // Optional, URL string
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

/**
 * Cloudinary Upload URL Response Types
 */
export interface CloudinaryUploadParams {
  timestamp: number;
  signature: string;
  api_key: string;
  folder: string;
}

export interface GetUploadUrlResponse {
  success: true;
  uploadUrl: string;
  params: CloudinaryUploadParams;
  expiresIn: number;
}

export interface GetUploadUrlErrorResponse {
  success: false;
  message: string;
}

