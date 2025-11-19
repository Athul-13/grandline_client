/**
 * Quote Types
 * Types for quotes, drafts, and quote-related entities
 */

/**
 * Quote Status Constants
 */
export const QuoteStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  NEGOTIATING: 'negotiating',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  PAID: 'paid',
} as const;

/**
 * Quote Status Type
 */
export type QuoteStatusType = typeof QuoteStatus[keyof typeof QuoteStatus];

/**
 * Trip Type Constants
 */
export const TripType = {
  ONE_WAY: 'one_way',
  TWO_WAY: 'two_way',
} as const;

/**
 * Trip Type
 */
export type TripTypeType = typeof TripType[keyof typeof TripType];

/**
 * Quote entity (full quote with all details)
 */
export interface Quote {
  quoteId: string;
  userId: string;
  tripType: TripTypeType;
  tripName: string;
  eventType: string;
  customEventType?: string | null;
  passengerCount: number;
  status: QuoteStatusType;
  currentStep: number; // 1-5
  selectedVehicles: SelectedVehicle[];
  selectedAmenities: string[]; // Array of amenity IDs
  pricing?: PricingBreakdown;
  routeData?: RouteData;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Selected Vehicle
 */
export interface SelectedVehicle {
  vehicleId: string;
  quantity: number;
}

/**
 * Route Data
 */
export interface RouteData {
  outbound: RouteInfo;
  return?: RouteInfo;
}

/**
 * Route Information
 */
export interface RouteInfo {
  totalDistance: number; // km
  totalDuration: number; // hours
  routeGeometry: string; // GeoJSON string
  segments?: RouteSegment[];
}

/**
 * Route Segment
 */
export interface RouteSegment {
  from: {
    latitude: number;
    longitude: number;
  };
  to: {
    latitude: number;
    longitude: number;
  };
  distance: number; // km
  duration: number; // hours
  hasNightTravel: boolean;
}

/**
 * Pricing Breakdown
 */
export interface PricingBreakdown {
  fuelPriceAtTime: number;
  averageDriverRateAtTime: number;
  taxPercentageAtTime: number;
  baseFare: number;
  distanceFare: number;
  driverCharge: number;
  fuelMaintenance: number;
  nightCharge: number;
  stayingCharge: number;
  amenitiesTotal: number;
  subtotal: number;
  tax: number;
  total: number;
}

/**
 * Create Quote Draft Request
 * POST /api/v1/quotes
 */
export interface CreateQuoteDraftRequest {
  tripType: TripTypeType;
}

/**
 * Create Quote Draft Response
 * POST /api/v1/quotes
 */
export interface CreateQuoteDraftResponse {
  quoteId: string;
  status: QuoteStatusType;
  currentStep: number;
}

/**
 * Update Quote Draft Request
 * PUT /api/v1/quotes/:id
 */
export interface UpdateQuoteDraftRequest {
  tripType?: TripTypeType;
  currentStep?: number;
  itinerary?: {
    outbound: unknown[]; // ItineraryStopDto[] - defined in itinerary.ts
    return?: unknown[]; // ItineraryStopDto[] - defined in itinerary.ts
  };
  tripName?: string;
  eventType?: string;
  customEventType?: string | null;
  passengers?: unknown[]; // PassengerDto[] - defined in passenger.ts
  selectedVehicles?: SelectedVehicle[];
  selectedAmenities?: string[];
}

/**
 * Quote Response
 * GET /api/v1/quotes/:id
 */
export interface QuoteResponse {
  quoteId: string;
  userId: string;
  tripType: TripTypeType;
  tripName: string;
  eventType: string;
  customEventType?: string | null;
  passengerCount: number;
  passengers?: unknown[]; // PassengerDto[] - defined in passenger.ts
  status: QuoteStatusType;
  currentStep: number;
  selectedVehicles: SelectedVehicle[];
  selectedAmenities: string[];
  pricing?: PricingBreakdown;
  routeData?: RouteData;
  itinerary?: {
    outbound: unknown[]; // ItineraryStopDto[] - defined in itinerary.ts
    return?: unknown[]; // ItineraryStopDto[] - defined in itinerary.ts
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Quote List Item (for quotes list page)
 */
export interface QuoteListItem {
  quoteId: string;
  tripName: string;
  tripType: TripTypeType;
  status: QuoteStatusType;
  currentStep: number;
  totalPrice?: number;
  startLocation?: string; // Location name of pickup
  endLocation?: string; // Location name of dropoff
  createdAt: Date | string;
}

/**
 * Quote List Response
 * GET /api/v1/quotes
 */
export interface QuoteListResponse {
  quotes: QuoteListItem[];
  pagination: PaginationMeta;
}

/**
 * Pagination Metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Submit Quote Response
 * POST /api/v1/quotes/:id/submit
 */
export interface SubmitQuoteResponse {
  quoteId: string;
  status: QuoteStatusType;
  pricing: PricingBreakdown;
}

