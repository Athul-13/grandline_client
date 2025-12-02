/**
 * Admin User Types
 * Types for admin user list and details view
 */

import type { PaginationMeta } from '../quotes/quote';

/**
 * User Status Constants
 */
export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
} as const;

/**
 * User Status Type
 */
export type UserStatusType = typeof UserStatus[keyof typeof UserStatus];

/**
 * Admin User List Item
 * GET /api/v1/admin/users
 */
export interface AdminUserListItem {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  status: UserStatusType;
  isVerified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Admin User List Response
 * GET /api/v1/admin/users
 */
export interface AdminUserListResponse {
  success: boolean;
  users: AdminUserListItem[];
  pagination: PaginationMeta;
}

/**
 * Admin User List Request Parameters
 */
export interface AdminUserListParams {
  page?: number;
  limit?: number;
  status?: string[]; // Array of status values for filtering (active, inactive, blocked)
  isVerified?: boolean;
  search?: string; // Search in email, fullName, phoneNumber
  sortBy?: 'email' | 'fullName' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Admin User Details Response
 * GET /api/v1/admin/users/:userId
 */
export interface AdminUserDetailsResponse {
  success: boolean;
  user: {
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    profilePicture: string;
    role: 'user' | 'admin';
    status: UserStatusType;
    isVerified: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    hasPassword: boolean;
    hasGoogleAuth: boolean;
  };
}

/**
 * Admin User Details (alias for AdminUserDetailsResponse['user'])
 * Used in components for cleaner type names
 */
export type AdminUserDetails = AdminUserDetailsResponse['user'];

/**
 * Change User Status Request
 * PATCH /api/v1/admin/users/:userId/status
 */
export interface ChangeUserStatusRequest {
  status: UserStatusType;
}

/**
 * Change User Status Response
 * PATCH /api/v1/admin/users/:userId/status
 * Backend response structure: { success: true, message: string, user: {...} }
 */
export interface ChangeUserStatusResponse {
  success: boolean;
  message: string;
  user: {
    userId: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    profilePicture: string;
    role: 'user' | 'admin';
    status: UserStatusType;
    isVerified: boolean;
    updatedAt: Date | string;
  };
}

/**
 * User Statistics Request Parameters
 * GET /api/v1/admin/users/statistics
 */
export interface UserStatisticsRequest {
  timeRange?: 'all_time' | '7_days' | '30_days' | 'custom';
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

/**
 * User Statistics Response
 * GET /api/v1/admin/users/statistics
 */
export interface UserStatisticsResponse {
  success: boolean;
  statistics: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    blockedUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    newUsers: number;
    usersByStatus: Record<string, number>;
    timeRange: {
      type: 'all_time' | '7_days' | '30_days' | 'custom';
      startDate?: Date | string;
      endDate?: Date | string;
    };
  };
}

