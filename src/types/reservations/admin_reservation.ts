/**
 * Admin Reservation Types
 * Types for admin reservation management
 */

import type { ReservationResponse, ReservationListItem, ReservationStatusType } from './reservation';

/**
 * User information for admin reservation responses
 */
export interface AdminUserInfo {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

/**
 * Admin reservation list item (extends ReservationListItem with user info)
 */
export interface AdminReservationListItem extends ReservationListItem {
  user: AdminUserInfo;
}

/**
 * Admin reservation list response
 */
export interface AdminReservationsListResponse {
  reservations: AdminReservationListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Reservation modification response
 */
export interface ReservationModificationResponse {
  modificationId: string;
  reservationId: string;
  modifiedBy: string;
  modificationType: 'driver_change' | 'passenger_add' | 'vehicle_adjust' | 'status_change' | 'charge_add' | 'other';
  description: string;
  previousValue?: string;
  newValue?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date | string;
}

/**
 * Reservation charge response
 */
export interface ReservationChargeResponse {
  chargeId: string;
  reservationId: string;
  chargeType: 'additional_passenger' | 'vehicle_upgrade' | 'amenity_add' | 'late_fee' | 'other';
  description: string;
  amount: number;
  currency: string;
  addedBy: string;
  isPaid: boolean;
  paidAt?: Date | string;
  createdAt: Date | string;
}

/**
 * Admin reservation details response (extends ReservationResponse with admin-specific data)
 */
export interface AdminReservationDetailsResponse extends ReservationResponse {
  user: AdminUserInfo;
  passengers?: Array<{
    passengerId: string;
    fullName: string;
    phoneNumber: string;
    age: number;
  }>;
  modifications?: ReservationModificationResponse[];
  charges?: ReservationChargeResponse[];
  totalCharges?: number;
  unpaidCharges?: number;
}

/**
 * Request DTOs for admin actions
 */
export interface UpdateReservationStatusRequest {
  status: ReservationStatusType;
  reason?: string;
}

export interface AddPassengersToReservationRequest {
  passengers: Array<{
    fullName: string;
    phoneNumber: string;
    age: number;
  }>;
}

export interface ChangeReservationDriverRequest {
  driverId: string;
  reason?: string;
}

export interface AdjustReservationVehiclesRequest {
  vehicles: Array<{
    vehicleId: string;
    quantity: number;
  }>;
}

export interface UpdateReservationItineraryRequest {
  stops: Array<{
    itineraryId?: string;
    tripType: 'outbound' | 'return';
    stopOrder: number;
    locationName: string;
    latitude: number;
    longitude: number;
    arrivalTime: Date | string;
    departureTime?: Date | string;
    stopType: string;
    isDriverStaying: boolean;
    stayingDuration?: number;
  }>;
}

export interface ProcessReservationRefundRequest {
  amount: number;
  reason?: string;
}

export interface CancelReservationRequest {
  reason: string;
}

export interface AddReservationChargeRequest {
  chargeType: 'additional_passenger' | 'vehicle_upgrade' | 'amenity_add' | 'late_fee' | 'other';
  description: string;
  amount: number;
  currency?: string;
}

