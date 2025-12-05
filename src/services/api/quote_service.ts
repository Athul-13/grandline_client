import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  CreateQuoteDraftRequest,
  CreateQuoteDraftResponse,
  UpdateQuoteDraftRequest,
  QuoteResponse,
  QuoteListResponse,
  SubmitQuoteResponse,
} from '../../types/quotes/quote';
import type {
  AdminQuoteListResponse,
  AdminQuoteListParams,
  AdminQuoteDetailsResponse,
  UpdateQuoteStatusRequest,
  UpdateQuoteStatusResponse,
} from '../../types/quotes/admin_quote';
import type {
  CalculateRoutesRequest,
  RouteCalculationResponse,
} from '../../types/quotes/itinerary';
import type { GetRecommendationsRequest, GetRecommendationsResponse } from '../../types/quotes/vehicle_recommendation';
import type { CalculatePricingResponse } from '../../types/quotes/pricing';

/**
 * Quote Service
 * Handles quote-related API calls
 */
export const quoteService = {
  /**
   * Get all quotes (with optional pagination and filters)
   * GET /api/v1/quotes?page=1&limit=20&status=draft,submitted&sortBy=createdAt&sortOrder=desc
   */
  getQuotes: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<QuoteListResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.quotes.list}?${queryString}` : API_ENDPOINTS.quotes.list;
    
    const response = await grandlineAxiosClient.get<QuoteListResponse>(url);
    return response.data;
  },

  /**
   * Get quote by ID
   * GET /api/v1/quotes/:id
   */
  getQuoteById: async (id: string): Promise<QuoteResponse> => {
    const response = await grandlineAxiosClient.get<QuoteResponse>(
      API_ENDPOINTS.quotes.getById(id)
    );
    return response.data;
  },

  /**
   * Create quote draft
   * POST /api/v1/quotes
   */
  createQuoteDraft: async (data: CreateQuoteDraftRequest): Promise<CreateQuoteDraftResponse> => {
    const response = await grandlineAxiosClient.post<CreateQuoteDraftResponse>(
      API_ENDPOINTS.quotes.create,
      data
    );
    return response.data;
  },

  /**
   * Update quote draft
   * PUT /api/v1/quotes/:id
   */
  updateQuoteDraft: async (
    id: string,
    data: UpdateQuoteDraftRequest
  ): Promise<QuoteResponse> => {
    const response = await grandlineAxiosClient.put<QuoteResponse>(
      API_ENDPOINTS.quotes.update(id),
      data
    );
    return response.data;
  },

  /**
   * Delete quote draft
   * DELETE /api/v1/quotes/:id
   */
  deleteQuote: async (id: string): Promise<void> => {
    await grandlineAxiosClient.delete(API_ENDPOINTS.quotes.delete(id));
  },

  /**
   * Calculate routes for itinerary
   * POST /api/v1/quotes/:id/calculate-routes
   */
  calculateRoutes: async (
    id: string,
    data: CalculateRoutesRequest
  ): Promise<RouteCalculationResponse> => {
    const response = await grandlineAxiosClient.post<RouteCalculationResponse>(
      API_ENDPOINTS.quotes.calculateRoutes(id),
      data
    );
    return response.data;
  },

  /**
   * Calculate pricing
   * POST /api/v1/quotes/:id/calculate-pricing
   */
  calculatePricing: async (id: string): Promise<CalculatePricingResponse> => {
    const response = await grandlineAxiosClient.post<CalculatePricingResponse>(
      API_ENDPOINTS.quotes.calculatePricing(id)
    );
    return response.data;
  },

  /**
   * Submit quote (final submission)
   * POST /api/v1/quotes/:id/submit
   */
  submitQuote: async (id: string): Promise<SubmitQuoteResponse> => {
    const response = await grandlineAxiosClient.post<SubmitQuoteResponse>(
      API_ENDPOINTS.quotes.submit(id)
    );
    return response.data;
  },

  /**
   * Get vehicle recommendations
   * POST /api/v1/quotes/recommendations
   */
  getRecommendations: async (
    data: GetRecommendationsRequest
  ): Promise<GetRecommendationsResponse> => {
    const response = await grandlineAxiosClient.post<GetRecommendationsResponse>(
      API_ENDPOINTS.quotes.recommendations,
      data
    );
    return response.data;
  },

  /**
   * Get admin quotes list (with optional pagination, search, filters, and sorting)
   * GET /api/v1/admin/quotes?page=1&limit=20&includeDeleted=false&search=...&status=draft&status=submitted&sortBy=createdAt&sortOrder=desc
   */
  getAdminQuotes: async (params?: AdminQuoteListParams): Promise<AdminQuoteListResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Handle array values (status filter)
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((v) => queryParams.append(key, String(v)));
          } else if (typeof value === 'boolean') {
            queryParams.append(key, String(value));
          } else if (typeof value === 'string' || typeof value === 'number') {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `${API_ENDPOINTS.admin.quotes}?${queryString}` : API_ENDPOINTS.admin.quotes;
    
    const response = await grandlineAxiosClient.get<AdminQuoteListResponse>(url);
    return response.data;
  },

  /**
   * Get admin quote details
   * GET /api/v1/admin/quotes/:id
   */
  getAdminQuoteDetails: async (id: string): Promise<AdminQuoteDetailsResponse> => {
    const response = await grandlineAxiosClient.get<AdminQuoteDetailsResponse>(
      API_ENDPOINTS.admin.quoteDetails(id)
    );
    return response.data;
  },

  /**
   * Update quote status (admin only)
   * PUT /api/v1/admin/quotes/:id/status
   */
  updateQuoteStatus: async (
    id: string,
    data: UpdateQuoteStatusRequest
  ): Promise<UpdateQuoteStatusResponse> => {
    const response = await grandlineAxiosClient.put<UpdateQuoteStatusResponse>(
      API_ENDPOINTS.admin.updateQuoteStatus(id),
      data
    );
    return response.data;
  },

  /**
   * Get payment page data
   * GET /api/v1/quotes/:id/payment
   */
  getPaymentPage: async (id: string): Promise<{
    quoteId: string;
    totalPrice: number;
    paymentWindowExpiresAt: string | null;
    message: string;
  }> => {
    const response = await grandlineAxiosClient.get<{
      quoteId: string;
      totalPrice: number;
      paymentWindowExpiresAt: string | null;
      message: string;
    }>(API_ENDPOINTS.quotes.payment(id));
    return response.data;
  },
};

