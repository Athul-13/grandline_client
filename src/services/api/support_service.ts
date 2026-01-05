import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type {
  CreateTicketRequest,
  CreateTicketResponse,
  GetTicketsByActorResponse,
  GetTicketByIdResponse,
  AddMessageRequest,
  AddMessageResponse,
  GetMessagesByTicketRequest,
  GetMessagesByTicketResponse,
  ActorTypeType,
  AdminTicketsListResponse,
  UpdateTicketStatusRequest,
  AssignTicketToAdminRequest,
  GetTicketByIdResponse as AdminTicketDetailsResponse,
} from '../../types/support/ticket';

/**
 * Support Service
 * Handles support ticket-related API calls
 */
export const supportService = {
  /**
   * Create a new support ticket
   * POST /api/v1/support/tickets
   */
  createTicket: async (request: CreateTicketRequest): Promise<CreateTicketResponse> => {
    const response = await grandlineAxiosClient.post<CreateTicketResponse>(
      API_ENDPOINTS.support.tickets,
      request
    );
    return response.data;
  },

  /**
   * Get tickets by actor (user/driver)
   * GET /api/v1/support/tickets?actorType=user
   */
  getTicketsByActor: async (actorType: ActorTypeType): Promise<GetTicketsByActorResponse> => {
    const response = await grandlineAxiosClient.get<GetTicketsByActorResponse>(
      API_ENDPOINTS.support.tickets,
      {
        params: { actorType },
      }
    );
    return response.data;
  },

  /**
   * Get ticket by ID
   * GET /api/v1/support/tickets/:id
   */
  getTicketById: async (id: string): Promise<GetTicketByIdResponse> => {
    const response = await grandlineAxiosClient.get<GetTicketByIdResponse>(
      API_ENDPOINTS.support.ticketById(id)
    );
    return response.data;
  },

  /**
   * Add a message to a ticket
   * POST /api/v1/support/tickets/:id/messages
   */
  addMessage: async (ticketId: string, content: string): Promise<AddMessageResponse> => {
    const response = await grandlineAxiosClient.post<AddMessageResponse>(
      API_ENDPOINTS.support.addMessage(ticketId),
      { content }
    );
    return response.data;
  },

  /**
   * Get messages for a ticket (paginated)
   * GET /api/v1/support/tickets/:id/messages?page=1&limit=50
   */
  getMessagesByTicket: async (
    ticketId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<GetMessagesByTicketResponse> => {
    const response = await grandlineAxiosClient.get<GetMessagesByTicketResponse>(
      API_ENDPOINTS.support.ticketMessages(ticketId),
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  /**
   * Get all tickets (admin only)
   * GET /api/v1/support/tickets?page=1&limit=20&status=open&actorType=user
   */
  getAllTickets: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    actorType?: string;
    assignedAdminId?: string;
    search?: string;
    sortBy?: 'lastMessageAt' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<AdminTicketsListResponse> => {
    const response = await grandlineAxiosClient.get<AdminTicketsListResponse>(
      API_ENDPOINTS.support.tickets,
      {
        params,
      }
    );
    return response.data;
  },

  /**
   * Update ticket status (admin only)
   * PATCH /api/v1/support/tickets/:id/status
   */
  updateTicketStatus: async (
    ticketId: string,
    request: UpdateTicketStatusRequest
  ): Promise<AdminTicketDetailsResponse> => {
    const response = await grandlineAxiosClient.patch<AdminTicketDetailsResponse>(
      API_ENDPOINTS.support.updateStatus(ticketId),
      request
    );
    return response.data;
  },

  /**
   * Assign ticket to admin (admin only)
   * PATCH /api/v1/support/tickets/:id/assign
   */
  assignTicketToAdmin: async (
    ticketId: string,
    request: AssignTicketToAdminRequest
  ): Promise<AdminTicketDetailsResponse> => {
    const response = await grandlineAxiosClient.patch<AdminTicketDetailsResponse>(
      API_ENDPOINTS.support.assignToAdmin(ticketId),
      request
    );
    return response.data;
  },
};

