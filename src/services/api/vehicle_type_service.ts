import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  VehicleType,
  CreateVehicleTypeRequest,
  CreateVehicleTypeResponse,
  UpdateVehicleTypeRequest,
  DeleteVehicleTypeResponse,
  PaginationParams,
  PaginatedVehicleTypesResponse,
} from '../../types/fleet/vehicle_type';

/**
 * Vehicle Type Service
 */
export const vehicleTypeService = {
  /**
   * Get all vehicle types (with optional pagination)
   * GET /api/v1/vehicle-types?page=1&limit=20
   */
  getVehicleTypes: async (params?: PaginationParams): Promise<PaginatedVehicleTypesResponse> => {
    const queryParams = params
      ? `?page=${params.page}&limit=${params.limit}`
      : '';
    
    const response = await grandlineAxiosClient.get<PaginatedVehicleTypesResponse>(
      `${API_ENDPOINTS.fleet.vehicleTypes}${queryParams}`
    );
    return response.data;
  },

  /**
   * Get vehicle type by ID
   * GET /api/v1/vehicle-types/:id
   */
  getVehicleTypeById: async (id: string): Promise<VehicleType> => {
    const response = await grandlineAxiosClient.get<VehicleType>(
      API_ENDPOINTS.fleet.vehicleTypesById(id)
    );
    return response.data;
  },

  /**
   * Create a new vehicle type
   * POST /api/v1/vehicle-types
   */
  createVehicleType: async (
    data: CreateVehicleTypeRequest
  ): Promise<CreateVehicleTypeResponse> => {
    const response = await grandlineAxiosClient.post<CreateVehicleTypeResponse>(
      API_ENDPOINTS.fleet.vehicleTypes,
      data
    );
    return response.data;
  },

  /**
   * Update an existing vehicle type
   * PUT /api/v1/vehicle-types/:id
   */
  updateVehicleType: async (
    id: string,
    data: UpdateVehicleTypeRequest
  ): Promise<VehicleType> => {
    const response = await grandlineAxiosClient.put<VehicleType>(
      API_ENDPOINTS.fleet.vehicleTypesById(id),
      data
    );
    return response.data;
  },

  /**
   * Delete a vehicle type
   * DELETE /api/v1/vehicle-types/:id
   */
  deleteVehicleType: async (id: string): Promise<DeleteVehicleTypeResponse> => {
    const response = await grandlineAxiosClient.delete<DeleteVehicleTypeResponse>(
      API_ENDPOINTS.fleet.vehicleTypesById(id)
    );
    return response.data;
  },
};

