/**
 * Admin Driver Types
 * Types for admin driver management
 */

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

