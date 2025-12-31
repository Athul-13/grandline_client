import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type { ReservationResponse } from '../../types/reservations/reservation';

/**
 * Reservation Service
 * Handles reservation-related API calls
 */
export const reservationService = {
  /**
   * Get all reservations for the authenticated user
   * GET /api/v1/reservations
   */
  getReservations: async (params?: {
    page?: number;
    limit?: number;
    forDropdown?: boolean;
  }): Promise<{ reservations: ReservationResponse[] } | Array<{ reservationId: string; tripName: string; status: string }>> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.reservations.list}?${queryString}` : API_ENDPOINTS.reservations.list;
    
    const response = await grandlineAxiosClient.get<{ reservations: ReservationResponse[] } | Array<{ reservationId: string; tripName: string; status: string }>>(url);
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

  /**
   * Create payment intent for a reservation charge
   * POST /api/v1/reservations/:reservationId/charges/:chargeId/payment/create-intent
   */
  createChargePaymentIntent: async (
    reservationId: string,
    chargeId: string
  ): Promise<{
    clientSecret: string;
    paymentIntentId: string;
    paymentId: string;
  }> => {
    const response = await grandlineAxiosClient.post<{
      clientSecret: string;
      paymentIntentId: string;
      paymentId: string;
    }>(API_ENDPOINTS.reservations.chargePayment.createIntent(reservationId, chargeId));
    return response.data;
  },
};
