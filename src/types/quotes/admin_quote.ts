/**
 * Admin Quote Types
 * Types for admin quote list view
 */

import type { QuoteStatusType, TripTypeType, PaginationMeta } from './quote';
import type { ItineraryStopDto } from './itinerary';

/**
 * Admin Quote List Item
 * GET /api/v1/admin/quotes
 */
export interface AdminQuoteListItem {
  quoteId: string;
  tripName: string;
  tripType: TripTypeType;
  status: QuoteStatusType;
  currentStep: number;
  totalPrice: number | null | undefined;
  createdAt: Date | string;
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
}

/**
 * Admin Quote Details Response
 * GET /api/v1/admin/quotes/:id
 */
export interface AdminQuoteDetailsResponse {
  success: boolean;
  quoteId: string;
  userId: string;
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

