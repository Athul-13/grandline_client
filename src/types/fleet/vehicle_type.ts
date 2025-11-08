/**
 * Vehicle Type Types
 */

/**
 * Vehicle Type entity
 */
export interface VehicleType {
  vehicleTypeId: string;
  name: string;
  description: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Create Vehicle Type Request
 * POST /api/v1/vehicle-types
 */
export interface CreateVehicleTypeRequest {
  name: string; // Required, min 2 chars, max 100 chars, must contain non-whitespace
  description: string;
}

/**
 * Create Vehicle Type Response
 * POST /api/v1/vehicle-types
 */
export interface CreateVehicleTypeResponse {
  message: string; // "Vehicle type created successfully"
  vehicleType: VehicleType;
}

/**
 * Update Vehicle Type Request
 * PUT /api/v1/vehicle-types/:id
 */
export interface UpdateVehicleTypeRequest {
  name?: string; // Optional, min 2 chars, max 100 chars, must contain non-whitespace
  description?: string; // Optional
}

/**
 * Delete Vehicle Type Response
 * DELETE /api/v1/vehicle-types/:id
 */
export interface DeleteVehicleTypeResponse {
  message: string; // "Vehicle type deleted successfully"
}

