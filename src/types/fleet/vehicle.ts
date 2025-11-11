/**
 * Vehicle Types
 */

import type { VehicleType } from './vehicle_type';

/**
 * Vehicle Status Constants
 * Matches the shared constants from backend
 */
export const VehicleStatus = {
  AVAILABLE: 'available', // Ready for rental
  IN_SERVICE: 'in_service', // Currently on a trip/rented
  MAINTENANCE: 'maintenance', // Under repair/maintenance
  RETIRED: 'retired', // No longer in service
} as const;

/**
 * Vehicle Status Type
 */
export type VehicleStatusType = typeof VehicleStatus[keyof typeof VehicleStatus];

/**
 * Vehicle entity
 */
export interface Vehicle {
  vehicleId: string;
  vehicleTypeId: string; // Keep for backward compatibility
  vehicleType?: VehicleType; // Full vehicle type object from server
  vehicleModel: string;
  year: number;
  capacity: number;
  baseFare: number;
  maintenance: number;
  plateNumber: string;
  fuelConsumption: number;
  status: VehicleStatusType | string;
  imageUrls?: string[]; // Array of image URLs (matches server response)
  amenityIds?: string[]; // Array of amenity IDs (matches server response)
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Pagination Query Parameters
 */
export interface PaginationParams {
  page: number; // Page number (1-indexed)
  limit: number; // Items per page
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
 * Paginated Vehicles Response
 * GET /api/v1/vehicles?page=1&limit=20
 */
export interface PaginatedVehiclesResponse {
  success: boolean;
  data: Vehicle[];
  pagination: PaginationMeta;
}

/**
 * Create Vehicle Request
 * POST /api/v1/vehicles
 */
export interface CreateVehicleRequest {
  vehicleTypeId: string;
  capacity: number;
  baseFare: number;
  maintenance: number;
  plateNumber: string; // Without spaces (e.g., "KL07CE6987")
  vehicleModel: string;
  year: number;
  fuelConsumption: number;
  imageUrls: string[];
  status: VehicleStatusType | string;
  amenities?: string[]; // Array of amenity IDs
}

/**
 * Create Vehicle Response
 * POST /api/v1/vehicles
 */
export interface CreateVehicleResponse {
  message: string; // "Vehicle created successfully"
  vehicle: Vehicle;
}

/**
 * Update Vehicle Request
 * PUT /api/v1/vehicles/:id
 */
export interface UpdateVehicleRequest {
  vehicleTypeId?: string;
  capacity?: number;
  baseFare?: number;
  maintenance?: number;
  plateNumber?: string; // Without spaces
  vehicleModel?: string;
  year?: number;
  fuelConsumption?: number;
  imageUrls?: string[];
  status?: VehicleStatusType | string;
  amenities?: string[]; // Array of amenity IDs
}

/**
 * Update Vehicle Response
 * PUT /api/v1/vehicles/:id
 */
export interface UpdateVehicleResponse {
  message: string; // "Vehicle updated successfully"
  vehicle: Vehicle;
}

/**
 * Cloudinary Upload Parameters (for vehicle images)
 */
export interface VehicleCloudinaryUploadParams {
  timestamp: number;
  signature: string;
  api_key: string;
  folder: string;
}

/**
 * Vehicle Upload Signature Response
 * POST /api/v1/vehicles/upload-signature
 */
export interface VehicleUploadSignatureResponse {
  success: boolean;
  uploadUrl: string;
  params: VehicleCloudinaryUploadParams;
  expiresIn: number; // seconds
}

/**
 * Delete Vehicle Images Request
 * DELETE /api/v1/vehicles/images
 */
export interface DeleteVehicleImagesRequest {
  urls: string[];
}

/**
 * Delete Vehicle Images Response
 * DELETE /api/v1/vehicles/images
 */
export interface DeleteVehicleImagesResponse {
  success: boolean;
  message: string; // "Vehicle images deleted successfully"
}

