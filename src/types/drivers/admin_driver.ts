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
  sortBy?: 'email' | 'fullName' | 'licenseNumber' | 'createdAt' | 'salary';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Admin Driver Details Response
 * GET /api/v1/admin/drivers/:driverId
 */
export interface AdminDriverDetailsResponse {
  success: boolean;
  driver: {
    driverId: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    profilePictureUrl: string;
    licenseNumber: string;
    licenseCardPhotoUrl: string;
    status: DriverStatusType;
    salary: number;
    isOnboarded: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
  };
  stats: {
    totalRides: number;
    earnings: number;
    rating: number;
    lastPaymentDate?: Date | string;
  };
}

/**
 * Admin Driver Details (alias for AdminDriverDetailsResponse['driver'])
 * Used in components for cleaner type names
 */
export type AdminDriverDetails = AdminDriverDetailsResponse['driver'];

/**
 * Update Driver Request
 * PATCH /api/v1/admin/drivers/:driverId
 */
export interface UpdateDriverRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  licenseNumber?: string;
  salary?: number;
}

/**
 * Update Driver Response
 * PATCH /api/v1/admin/drivers/:driverId
 */
export interface UpdateDriverResponse {
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
    updatedAt: Date | string;
  };
}

/**
 * Update Driver Status Request
 * PATCH /api/v1/admin/drivers/:driverId/status
 */
export interface UpdateDriverStatusRequest {
  status: DriverStatusType;
}

/**
 * Update Driver Status Response
 * PATCH /api/v1/admin/drivers/:driverId/status
 */
export interface UpdateDriverStatusResponse {
  success: boolean;
  message: string;
  driver: {
    driverId: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    licenseNumber: string;
    status: DriverStatusType;
    isOnboarded: boolean;
    updatedAt: Date | string;
  };
}

/**
 * Driver Statistics Request
 * GET /api/v1/admin/drivers/statistics
 */
export interface DriverStatisticsRequest {
  timeRange?: 'all_time' | '7_days' | '30_days' | 'custom';
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

/**
 * Driver Statistics Response
 * GET /api/v1/admin/drivers/statistics
 */
export interface DriverStatisticsResponse {
  success: boolean;
  statistics: {
    totalDrivers: number;
    availableDrivers: number;
    offlineDrivers: number;
    onTripDrivers: number;
    suspendedDrivers: number;
    blockedDrivers: number;
    onboardedDrivers: number;
    notOnboardedDrivers: number;
    newDrivers: number;
    driversByStatus: Record<string, number>;
    timeRange: {
      type: 'all_time' | '7_days' | '30_days' | 'custom';
      startDate?: Date | string;
      endDate?: Date | string;
    };
  };
}

