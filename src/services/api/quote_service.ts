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
};

