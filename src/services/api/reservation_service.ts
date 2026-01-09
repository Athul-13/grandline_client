import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type { ReservationResponse, ReservationListResponse } from '../../types/reservations/reservation';

/**
 * Get all reservations - Function overloads for type safety
 * When forDropdown is true, returns simplified array format
 * Otherwise, returns full ReservationListResponse with pagination
 */
async function getReservations(params: { forDropdown: true }): Promise<Array<{ reservationId: string; tripName: string; status: string }>>;
async function getReservations(params?: {
  page?: number;
  limit?: number;
  forDropdown?: false;
}): Promise<ReservationListResponse>;
async function getReservations(params?: {
  page?: number;
  limit?: number;
  forDropdown?: boolean;
}): Promise<ReservationListResponse | Array<{ reservationId: string; tripName: string; status: string }>> {
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
  
  const response = await grandlineAxiosClient.get<ReservationListResponse | Array<{ reservationId: string; tripName: string; status: string }>>(url);
  return response.data;
}

/**
 * Reservation Service
 * Handles reservation-related API calls
 */
export const reservationService = {
  /**
   * Get all reservations for the authenticated user
   * GET /api/v1/reservations
   * 
   * @overload
   * When forDropdown is true, returns simplified array format
   * 
   * @overload
   * When forDropdown is false or undefined, returns ReservationListResponse with pagination
   */
  getReservations,

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
