/**
 * Admin Driver Types
 * Types for admin driver management
 */

import type { PaginationMeta } from '../quotes/quote';

/**
 * Driver Status Constants
 */
export const DriverStatus = {
  AVAILABLE: 'available',
  ON_TRIP: 'ontrip',
  OFFLINE: 'offline',
  SUSPENDED: 'suspended',
  BLOCKED: 'blocked',
} as const;

/**
 * Driver Status Type
 */
export type DriverStatusType = typeof DriverStatus[keyof typeof DriverStatus];

/**
 * Create Driver Request
 * POST /api/v1/admin/drivers
 */
export interface CreateDriverRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  licenseNumber: string;
  salary: number;
}

/**
 * Create Driver Response
 * POST /api/v1/admin/drivers
 */
export interface CreateDriverResponse {
  success: boolean;
  message: string;
  driver: {
    driverId: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    licenseNumber: string;
    status: DriverStatusType;
    salary: number;
    isOnboarded: boolean;
    createdAt: Date | string;
  };
  password: string; // Plain password - only returned at creation
}

/**
 * Admin Driver List Item
 * GET /api/v1/admin/drivers
 */
export interface AdminDriverListItem {
  driverId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  licenseNumber: string;
  profilePictureUrl: string;
  licenseCardPhotoUrl: string;
  status: DriverStatusType;
  salary: number;
  isOnboarded: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Admin Driver List Response
 * GET /api/v1/admin/drivers
 */
export interface AdminDriverListResponse {
  success: boolean;
  drivers: AdminDriverListItem[];
  pagination: PaginationMeta;
}

/**
 * Admin Driver List Request Parameters
 */
export interface AdminDriverListParams {
  page?: number;
  limit?: number;
  status?: string[]; // Array of status values for filtering
  isOnboarded?: boolean;
  search?: string; // Search in email, fullName, phoneNumber, licenseNumber
  sortBy?: 'email' | 'fullName' | 'licenseNumber' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

