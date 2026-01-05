/**
 * Support Ticket Types
 */

export const TicketStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
} as const;

export type TicketStatusType = typeof TicketStatus[keyof typeof TicketStatus];

export const LinkedEntityType = {
  QUOTE: 'quote',
  RESERVATION: 'reservation',
} as const;

export type LinkedEntityTypeType = typeof LinkedEntityType[keyof typeof LinkedEntityType];

export const TicketPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type TicketPriorityType = typeof TicketPriority[keyof typeof TicketPriority];

export const ActorType = {
  ADMIN: 'admin',
  USER: 'user',
  DRIVER: 'driver',
} as const;

export type ActorTypeType = typeof ActorType[keyof typeof ActorType];

/**
 * Request to create a support ticket
 */
export interface CreateTicketRequest {
  actorType: ActorTypeType;
  actorId: string;
  subject: string;
  content: string;
  linkedEntityType?: LinkedEntityTypeType | null;
  linkedEntityId?: string | null;
  priority?: TicketPriorityType;
}

/**
 * Response after creating a ticket
 */
export interface CreateTicketResponse {
  ticketId: string;
  messageId: string;
}

/**
 * Ticket list item (for ticket list view)
 */
export interface TicketListItem {
  ticketId: string;
  subject: string;
  status: TicketStatusType;
  priority: string;
  linkedEntityType: LinkedEntityTypeType | null;
  linkedEntityNumber: string | null;
  linkedEntityId: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
}

/**
 * Response for getting tickets by actor
 */
export interface GetTicketsByActorResponse {
  tickets: TicketListItem[];
}

/**
 * Ticket detail response
 */
export interface GetTicketByIdResponse {
  ticketId: string;
  actorType: ActorTypeType;
  actorId: string;
  subject: string;
  status: TicketStatusType;
  priority: string;
  linkedEntityType: LinkedEntityTypeType | null;
  linkedEntityNumber: string | null;
  linkedEntityId: string | null;
  assignedAdminId: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Request to add a message to a ticket
 */
export interface AddMessageRequest {
  ticketId: string;
  content: string;
}

/**
 * Response after adding a message
 */
export interface AddMessageResponse {
  messageId: string;
  ticketId: string;
  senderType: ActorTypeType;
  senderId: string;
  content: string;
  createdAt: Date;
}

/**
 * Message in a ticket thread
 */
export interface TicketMessage {
  messageId: string;
  ticketId: string;
  senderType: ActorTypeType;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Request to get messages by ticket
 */
export interface GetMessagesByTicketRequest {
  ticketId: string;
  page?: number;
  limit?: number;
}

/**
 * Response for getting messages by ticket
 */
export interface GetMessagesByTicketResponse {
  messages: TicketMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Admin ticket list item
 */
export interface AdminTicketListItem {
  ticketId: string;
  actorType: ActorTypeType;
  actorId: string;
  actorName: string;
  subject: string;
  status: TicketStatusType;
  priority: TicketPriorityType;
  linkedEntityType: LinkedEntityTypeType | null;
  linkedEntityNumber: string | null;
  linkedEntityId: string | null;
  assignedAdminId: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Admin tickets list response
 */
export interface AdminTicketsListResponse {
  tickets: AdminTicketListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Update ticket status request
 */
export interface UpdateTicketStatusRequest {
  status: TicketStatusType;
}

/**
 * Assign ticket to admin request
 */
export interface AssignTicketToAdminRequest {
  adminId: string;
}

