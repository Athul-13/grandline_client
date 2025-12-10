/**
 * Reservation Types
 * Types for reservations and reservation-related entities
 */

/**
 * Reservation Status Constants
 */
export const ReservationStatus = {
  CONFIRMED: 'confirmed',
  MODIFIED: 'modified',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  REFUNDED: 'refunded',
} as const;

/**
 * Reservation Status Type
 */
export type ReservationStatusType = typeof ReservationStatus[keyof typeof ReservationStatus];

/**
 * Trip Type Constants (reused from quotes)
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
}

/**
 * Original Pricing Snapshot
 */
export interface OriginalPricing {
  total?: number;
  currency?: string;
  paidAt?: Date | string;
}

/**
 * Reservation entity (full reservation with all details)
 */
export interface Reservation {
  reservationId: string;
  userId: string;
  quoteId: string;
  paymentId: string;
  tripType: TripTypeType;
  tripName: string;
  eventType: string;
  customEventType?: string | null;
  passengerCount: number;
  status: ReservationStatusType;
  selectedVehicles: SelectedVehicle[];
  selectedAmenities: string[]; // Array of amenity IDs
  routeData?: RouteData;
  assignedDriverId?: string;
  originalDriverId?: string;
  originalPricing?: OriginalPricing;
  reservationDate: Date | string;
  confirmedAt?: Date | string;
  driverChangedAt?: Date | string;
  refundStatus?: 'none' | 'partial' | 'full';
  refundedAmount?: number;
  refundedAt?: Date | string;
  cancellationReason?: string;
  cancelledAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Reservation Response
 * GET /api/v1/reservations/:id
 */
export interface ReservationResponse {
  reservationId: string;
  userId: string;
  quoteId: string;
  paymentId: string;
  tripType: TripTypeType;
  tripName?: string;
  eventType?: string;
  customEventType?: string | null;
  passengerCount?: number;
  status: ReservationStatusType;
  selectedVehicles?: SelectedVehicle[];
  selectedAmenities?: string[];
  routeData?: RouteData;
  assignedDriverId?: string;
  originalDriverId?: string;
  originalPricing?: OriginalPricing;
  reservationDate: Date | string;
  confirmedAt?: Date | string;
  driverChangedAt?: Date | string;
  refundStatus?: 'none' | 'partial' | 'full';
  refundedAmount?: number;
  refundedAt?: Date | string;
  cancellationReason?: string;
  cancelledAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  driver?: {
    driverId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    licenseNumber: string;
    profilePictureUrl: string;
  };
  itinerary?: Array<{
    itineraryId: string;
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
  passengers?: Array<{
    passengerId: string;
    fullName: string;
    phoneNumber: string;
    age: number;
  }>;
}

/**
 * Reservation List Item (for reservations list page)
 */
export interface ReservationListItem {
  reservationId: string;
  tripName?: string;
  tripType: TripTypeType;
  status: ReservationStatusType;
  reservationDate: Date | string;
  tripDate?: Date | string; // Date of the trip (from first pickup stop's arrival time)
  startLocation?: string; // Location name of pickup
  endLocation?: string; // Location name of dropoff
  originalPrice?: number;
  assignedDriverId?: string;
  createdAt: Date | string;
}

/**
 * Reservation List Response
 * GET /api/v1/reservations
 */
export interface ReservationListResponse {
  reservations: ReservationListItem[];
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

