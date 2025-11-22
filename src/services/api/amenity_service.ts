import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  CreateAmenityRequest,
  CreateAmenityResponse,
  UpdateAmenityRequest,
  UpdateAmenityResponse,
  DeleteAmenityResponse,
  PaginationParams,
  PaginatedAmenitiesResponse,
  GetAmenityResponse,
} from '../../types/fleet/amenity';

/**
 * Amenity Service
 */
export const amenityService = {
  /**
   * Get all amenities (with optional pagination)
   * GET /api/v1/amenities?page=1&limit=20
   */
  getAmenities: async (params?: PaginationParams): Promise<PaginatedAmenitiesResponse> => {
    const queryParams = params
      ? `?page=${params.page}&limit=${params.limit}`
      : '';
    
    const response = await grandlineAxiosClient.get<PaginatedAmenitiesResponse>(
      `${API_ENDPOINTS.fleet.amenities}${queryParams}`
    );
    return response.data;
  },

  /**
   * Get amenity by ID
   * GET /api/v1/amenities/:id
   */
  getAmenityById: async (id: string): Promise<GetAmenityResponse> => {
    const response = await grandlineAxiosClient.get<GetAmenityResponse>(
      API_ENDPOINTS.fleet.amenitiesById(id)
    );
    return response.data;
  },

  /**
   * Get paid amenities (with optional pagination)
   * GET /api/v1/amenities/paid?page=1&limit=20
   */
  getPaidAmenities: async (params?: PaginationParams): Promise<PaginatedAmenitiesResponse> => {
    const queryParams = params
      ? `?page=${params.page}&limit=${params.limit}`
      : '';
    
    const response = await grandlineAxiosClient.get<PaginatedAmenitiesResponse>(
      `${API_ENDPOINTS.fleet.amenitiesPaid}${queryParams}`
    );
    return response.data;
  },

  /**
   * Create a new amenity
   * POST /api/v1/amenities
   */
  createAmenity: async (
    data: CreateAmenityRequest
  ): Promise<CreateAmenityResponse> => {
    const response = await grandlineAxiosClient.post<CreateAmenityResponse>(
      API_ENDPOINTS.fleet.amenities,
      data
    );
    return response.data;
  },

  /**
   * Update an existing amenity
   * PUT /api/v1/amenities/:id
   */
  updateAmenity: async (
    id: string,
    data: UpdateAmenityRequest
  ): Promise<UpdateAmenityResponse> => {
    const response = await grandlineAxiosClient.put<UpdateAmenityResponse>(
      API_ENDPOINTS.fleet.amenitiesById(id),
      data
    );
    return response.data;
  },

  /**
   * Delete an amenity
   * DELETE /api/v1/amenities/:id
   */
  deleteAmenity: async (id: string): Promise<DeleteAmenityResponse> => {
    const response = await grandlineAxiosClient.delete<DeleteAmenityResponse>(
      API_ENDPOINTS.fleet.amenitiesById(id)
    );
    return response.data;
  },
};

