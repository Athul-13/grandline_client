import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  ReservationResponse,
  ReservationListResponse,
} from '../../types/reservations/reservation';

/**
 * Reservation Service
 * Handles reservation-related API calls
 */
export const reservationService = {
  /**
   * Get all reservations (with optional pagination)
   * GET /api/v1/reservations?page=1&limit=20
   */
  getReservations: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ReservationListResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.reservations.list}?${queryString}` : API_ENDPOINTS.reservations.list;
    
    const response = await grandlineAxiosClient.get<ReservationListResponse>(url);
    return response.data;
  },

  /**
   * Get reservation by ID
   * GET /api/v1/reservations/:id
   */
  getReservationById: async (id: string): Promise<ReservationResponse> => {
    const response = await grandlineAxiosClient.get<ReservationResponse>(
      API_ENDPOINTS.reservations.getById(id)
    );
    return response.data;
  },
};

