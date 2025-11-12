import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  EventTypeResponse,
  CreateCustomEventTypeRequest,
  CreateCustomEventTypeResponse,
} from '../../types/quotes/event_type';

/**
 * Event Type Service
 * Handles event type-related API calls
 */
export const eventTypeService = {
  /**
   * Get all event types
   * GET /api/v1/event-types
   */
  getEventTypes: async (): Promise<EventTypeResponse[]> => {
    const response = await grandlineAxiosClient.get<EventTypeResponse[]>(
      API_ENDPOINTS.eventTypes.list
    );
    return response.data;
  },

  /**
   * Create custom event type
   * POST /api/v1/event-types
   */
  createCustomEventType: async (
    data: CreateCustomEventTypeRequest
  ): Promise<CreateCustomEventTypeResponse> => {
    const response = await grandlineAxiosClient.post<CreateCustomEventTypeResponse>(
      API_ENDPOINTS.eventTypes.create,
      data
    );
    return response.data;
  },
};

