/**
 * Event Type Types
 * Types for event types (predefined and custom)
 */

/**
 * Event Type Response
 * GET /api/v1/event-types
 */
export interface EventTypeResponse {
  eventTypeId: string;
  name: string;
  isCustom: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Create Custom Event Type Request
 * POST /api/v1/event-types
 */
export interface CreateCustomEventTypeRequest {
  name: string;
}

/**
 * Create Custom Event Type Response
 * POST /api/v1/event-types
 */
export interface CreateCustomEventTypeResponse extends EventTypeResponse {
  isCustom: true;
}

