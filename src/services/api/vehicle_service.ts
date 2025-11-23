import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type { FilterOptionsResponse } from '../../types/fleet/filter';
import type {
  Vehicle,
  PaginationParams,
  PaginatedVehiclesResponse,
  CreateVehicleRequest,
  CreateVehicleResponse,
  UpdateVehicleRequest,
  UpdateVehicleResponse,
  VehicleUploadSignatureResponse,
  DeleteVehicleImagesRequest,
  DeleteVehicleImagesResponse,
  GetVehicleResponse,
} from '../../types/fleet/vehicle';

/**
 * Vehicle Service
 * Handles vehicle-related API calls
 */
export const vehicleService = {
  /**
   * Get all vehicles (with optional pagination and filters)
   * GET /api/v1/vehicles?page=1&limit=20&status=available&...
   */
  getVehicles: async (params?: PaginationParams & Record<string, unknown>): Promise<PaginatedVehiclesResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, String(v)));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.fleet.vehicles}?${queryString}` : API_ENDPOINTS.fleet.vehicles;
    
    const response = await grandlineAxiosClient.get<PaginatedVehiclesResponse>(url);
    return response.data;
  },

  /**
   * Get vehicle by ID
   * GET /api/v1/vehicles/:id
   */
  getVehicleById: async (id: string): Promise<Vehicle> => {
    const response = await grandlineAxiosClient.get<GetVehicleResponse | Vehicle>(
      API_ENDPOINTS.fleet.vehiclesById(id)
    );
    // Handle both wrapped response { success, vehicle } and direct Vehicle response
    if ('vehicle' in response.data) {
      return (response.data as GetVehicleResponse).vehicle;
    }
    return response.data as Vehicle;
  },

  /**
   * Get filter options for vehicles
   * GET /api/v1/vehicles/filter-options
   */
  getFilterOptions: async (): Promise<FilterOptionsResponse> => {
    const response = await grandlineAxiosClient.get<FilterOptionsResponse>(
      API_ENDPOINTS.fleet.filterOptions
    );
    return response.data;
  },

  /**
   * Create a new vehicle
   * POST /api/v1/vehicles
   */
  createVehicle: async (data: CreateVehicleRequest): Promise<CreateVehicleResponse> => {
    const response = await grandlineAxiosClient.post<CreateVehicleResponse>(
      API_ENDPOINTS.fleet.vehicles,
      data
    );
    return response.data;
  },

  /**
   * Update an existing vehicle
   * PUT /api/v1/vehicles/:id
   */
  updateVehicle: async (
    id: string,
    data: UpdateVehicleRequest
  ): Promise<UpdateVehicleResponse> => {
    const response = await grandlineAxiosClient.put<UpdateVehicleResponse>(
      API_ENDPOINTS.fleet.vehiclesById(id),
      data
    );
    return response.data;
  },

  /**
   * Get Cloudinary upload signature for vehicle images
   * POST /api/v1/vehicles/upload-signature
   */
  getUploadSignature: async (): Promise<VehicleUploadSignatureResponse> => {
    const response = await grandlineAxiosClient.post<VehicleUploadSignatureResponse>(
      API_ENDPOINTS.fleet.uploadSignature
    );
    return response.data;
  },

  /**
   * Delete vehicle images from Cloudinary
   * DELETE /api/v1/vehicles/images
   */
  deleteImages: async (data: DeleteVehicleImagesRequest): Promise<DeleteVehicleImagesResponse> => {
    const response = await grandlineAxiosClient.delete<DeleteVehicleImagesResponse>(
      API_ENDPOINTS.fleet.deleteImages,
      { data }
    );
    return response.data;
  },
};

