/**
 * Vehicle Types
 */

/**
 * Vehicle Status Enum
 * Matches the shared constants from backend
 */
export enum VehicleStatus {
  AVAILABLE = 'available', // Ready for rental
  IN_SERVICE = 'in_service', // Currently on a trip/rented
  MAINTENANCE = 'maintenance', // Under repair/maintenance
  RETIRED = 'retired', // No longer in service
}

