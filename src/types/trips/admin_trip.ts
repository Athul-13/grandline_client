/**
 * Admin Trip Types
 * Types for admin trip management
 */

/**
 * Trip state enumeration
 */
export type TripState = 'UPCOMING' | 'CURRENT' | 'PAST';

/**
 * Admin Trip List Item
 * GET /api/v1/admin/trips
 */
export interface AdminTripListItem {
  reservationId: string;
  tripName?: string;
  userName: string;
  driverName?: string;
  tripStartAt: string; // ISO string
  tripEndAt: string; // ISO string
  startedAt?: string; // ISO string
  completedAt?: string; // ISO string
  derivedTripState: TripState;
  legacyExpired: boolean;
}

/**
 * Admin Trip List Response
 * GET /api/v1/admin/trips
 */
export interface AdminTripsListResponse {
  success: boolean;
  trips: AdminTripListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Admin Trip List Request Parameters
 */
export interface AdminTripListParams {
  page?: number;
  limit?: number;
  state?: TripState;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

