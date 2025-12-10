import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  AdminReservationsListResponse,
  AdminReservationDetailsResponse,
  UpdateReservationStatusRequest,
  AddPassengersToReservationRequest,
  ChangeReservationDriverRequest,
  AdjustReservationVehiclesRequest,
  ProcessReservationRefundRequest,
  CancelReservationRequest,
  AddReservationChargeRequest,
} from '../../types/reservations/admin_reservation';
import type { ReservationStatusType } from '../../types/reservations/reservation';

/**
 * Admin Reservation Service
 * Handles admin reservation-related API calls
 */
export const adminReservationService = {
  /**
   * Get all reservations for admin (with optional pagination and filters)
   * GET /api/v1/admin/reservations?page=1&limit=20&status=confirmed&search=...
   */
  getReservations: async (params?: {
    page?: number;
    limit?: number;
    status?: ReservationStatusType[];
    includeDeleted?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<AdminReservationsListResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'status' && Array.isArray(value)) {
            value.forEach((status) => queryParams.append('status', status));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.admin.reservations}?${queryString}` : API_ENDPOINTS.admin.reservations;
    
    const response = await grandlineAxiosClient.get<AdminReservationsListResponse>(url);
    return response.data;
  },

  /**
   * Get reservation details by ID (admin)
   * GET /api/v1/admin/reservations/:id
   */
  getReservationById: async (id: string): Promise<AdminReservationDetailsResponse> => {
    const response = await grandlineAxiosClient.get<AdminReservationDetailsResponse>(
      API_ENDPOINTS.admin.reservationDetails(id)
    );
    return response.data;
  },

  /**
   * Update reservation status
   * PUT /api/v1/admin/reservations/:id/status
   */
  updateStatus: async (id: string, request: UpdateReservationStatusRequest): Promise<{ reservation: AdminReservationDetailsResponse }> => {
    const response = await grandlineAxiosClient.put<{ reservation: AdminReservationDetailsResponse }>(
      API_ENDPOINTS.admin.updateReservationStatus(id),
      request
    );
    return response.data;
  },

  /**
   * Add passengers to reservation
   * POST /api/v1/admin/reservations/:id/passengers
   */
  addPassengers: async (id: string, request: AddPassengersToReservationRequest): Promise<{ reservation: AdminReservationDetailsResponse }> => {
    const response = await grandlineAxiosClient.post<{ reservation: AdminReservationDetailsResponse }>(
      API_ENDPOINTS.admin.addPassengers(id),
      request
    );
    return response.data;
  },

  /**
   * Change reservation driver
   * POST /api/v1/admin/reservations/:id/change-driver
   */
  changeDriver: async (id: string, request: ChangeReservationDriverRequest): Promise<{ reservation: AdminReservationDetailsResponse }> => {
    const response = await grandlineAxiosClient.post<{ reservation: AdminReservationDetailsResponse }>(
      API_ENDPOINTS.admin.changeDriver(id),
      request
    );
    return response.data;
  },

  /**
   * Adjust reservation vehicles
   * POST /api/v1/admin/reservations/:id/adjust-vehicles
   */
  adjustVehicles: async (id: string, request: AdjustReservationVehiclesRequest): Promise<{ reservation: AdminReservationDetailsResponse }> => {
    const response = await grandlineAxiosClient.post<{ reservation: AdminReservationDetailsResponse }>(
      API_ENDPOINTS.admin.adjustVehicles(id),
      request
    );
    return response.data;
  },

  /**
   * Process reservation refund
   * POST /api/v1/admin/reservations/:id/refund
   */
  processRefund: async (id: string, request: ProcessReservationRefundRequest): Promise<{ reservation: AdminReservationDetailsResponse; refundId: string }> => {
    const response = await grandlineAxiosClient.post<{ reservation: AdminReservationDetailsResponse; refundId: string }>(
      API_ENDPOINTS.admin.processRefund(id),
      request
    );
    return response.data;
  },

  /**
   * Cancel reservation
   * POST /api/v1/admin/reservations/:id/cancel
   */
  cancelReservation: async (id: string, request: CancelReservationRequest): Promise<{ reservation: AdminReservationDetailsResponse }> => {
    const response = await grandlineAxiosClient.post<{ reservation: AdminReservationDetailsResponse }>(
      API_ENDPOINTS.admin.cancelReservation(id),
      request
    );
    return response.data;
  },

  /**
   * Add charge to reservation
   * POST /api/v1/admin/reservations/:id/charges
   */
  addCharge: async (id: string, request: AddReservationChargeRequest): Promise<{ charge: import('../../types/reservations/admin_reservation').ReservationChargeResponse }> => {
    const response = await grandlineAxiosClient.post<{ charge: import('../../types/reservations/admin_reservation').ReservationChargeResponse }>(
      API_ENDPOINTS.admin.addCharge(id),
      request
    );
    return response.data;
  },
};

