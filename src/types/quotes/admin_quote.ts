/**
 * Admin Quote Types
 * Types for admin quote list view
 */

import type { QuoteStatusType, TripTypeType, PaginationMeta, QuoteResponse } from './quote';
import type { ItineraryStopDto } from './itinerary';

/**
 * Admin Quote List Item
 * GET /api/v1/admin/quotes
 */
export interface AdminQuoteListItem {
  quoteId: string;
  quoteNumber?: string;
  tripName: string;
  tripType: TripTypeType;
  status: QuoteStatusType;
  currentStep: number;
  totalPrice: number | null | undefined;
  createdAt: Date | string;
  isDeleted?: boolean;
  user: {
    fullName: string;
    email: string;
  };
}

/**
 * Admin Quote List Response
 * GET /api/v1/admin/quotes
 */
export interface AdminQuoteListResponse {
  success: boolean;
  quotes: AdminQuoteListItem[];
  pagination: PaginationMeta;
}

/**
 * Admin Quote List Request Parameters
 */
export interface AdminQuoteListParams {
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
  search?: string;
  status?: string[]; // Array of status values for filtering
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Admin Quote Details Response
 * GET /api/v1/admin/quotes/:id
 */
export interface AdminQuoteDetailsResponse {
  success: boolean;
  quoteId: string;
  userId: string;
  quoteNumber?: string;
  tripType: TripTypeType;
  tripName: string;
  eventType: string;
  customEventType?: string | null;
  passengerCount: number;
  status: QuoteStatusType;
  currentStep: number;
  selectedVehicles: Array<{
    vehicleId: string;
    quantity: number;
  }>;
  selectedAmenities: string[];
  pricing?: {
    fuelPriceAtTime: number;
    averageDriverRateAtTime: number;
    actualDriverRate?: number;
    taxPercentageAtTime: number;
    baseFare: number;
    distanceFare: number;
    driverCharge: number;
    fuelMaintenance: number;
    nightCharge: number;
    amenitiesTotal: number;
    subtotal: number;
    tax: number;
    total: number;
  };
  assignedDriverId?: string;
  actualDriverRate?: number;
  quotedAt?: Date | string;
  routeData?: {
    outbound: {
      totalDistance: number;
      totalDuration: number;
      routeGeometry: string;
    };
    return?: {
      totalDistance: number;
      totalDuration: number;
      routeGeometry: string;
    };
  };
  itinerary?: {
    outbound: ItineraryStopDto[];
    return?: ItineraryStopDto[];
  };
  passengers?: Array<{
    fullName: string;
    phoneNumber?: string;
    age?: number;
  }>;
  user?: {
    userId: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Update Quote Status Request
 * PUT /api/v1/admin/quotes/:id/status
 */
export interface UpdateQuoteStatusRequest {
  status: 'paid' | 'submitted';
}

/**
 * Update Quote Status Response
 * PUT /api/v1/admin/quotes/:id/status
 */
export interface UpdateQuoteStatusResponse {
  success: boolean;
  quoteId: string;
  userId: string;
  quoteNumber?: string;
  tripType: TripTypeType;
  tripName: string;
  status: QuoteStatusType;
  currentStep: number;
  pricing?: {
    total: number;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Assign Driver to Quote Request
 * POST /api/v1/admin/quotes/:id/assign-driver
 */
export interface AssignDriverToQuoteRequest {
  driverId: string;
}

/**
 * Assign Driver to Quote Response
 * POST /api/v1/admin/quotes/:id/assign-driver
 */
export type AssignDriverToQuoteResponse = QuoteResponse;

/**
 * Recalculate Quote Response
 * POST /api/v1/admin/quotes/:id/recalculate
 */
export interface RecalculateQuoteResponse {
  success: boolean;
  message: string;
  requiresVehicleReselection?: boolean;
  quote?: QuoteResponse;
}

/**
 * Admin Quote Details (alias for AdminQuoteDetailsResponse)
 * Used in components for cleaner type names
 */
export type AdminQuoteDetails = AdminQuoteDetailsResponse;

