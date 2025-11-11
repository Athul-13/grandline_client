/**
 * Amenity Types
 */

/**
 * Amenity entity
 */
export interface Amenity {
  amenityId: string;
  name: string;
  price: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
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
 * Paginated Amenities Response
 * GET /api/v1/amenities?page=1&limit=20
 */
export interface PaginatedAmenitiesResponse {
  success: boolean;
  data: Amenity[];
  pagination: PaginationMeta;
}

/**
 * Create Amenity Request
 * POST /api/v1/amenities
 */
export interface CreateAmenityRequest {
  name: string;
  price?: number | null;
}

/**
 * Create Amenity Response
 * POST /api/v1/amenities
 */
export interface CreateAmenityResponse {
  success: boolean;
  message: string;
  amenity: Amenity;
}

/**
 * Update Amenity Request
 * PUT /api/v1/amenities/:id
 */
export interface UpdateAmenityRequest {
  name?: string;
  price?: number | null;
}

/**
 * Update Amenity Response
 * PUT /api/v1/amenities/:id
 */
export interface UpdateAmenityResponse {
  success: boolean;
  message: string;
  amenity: Amenity;
}

/**
 * Get Amenity by ID Response
 * GET /api/v1/amenities/:id
 */
export interface GetAmenityResponse {
  success: boolean;
  amenity: Amenity;
}

/**
 * Delete Amenity Response
 * DELETE /api/v1/amenities/:id
 */
export interface DeleteAmenityResponse {
  success: boolean;
  message: string;
}

