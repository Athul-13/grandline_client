/**
 * Admin Quote Types
 * Types for admin quote list view
 */

import type { QuoteStatusType, TripTypeType, PaginationMeta } from './quote';

/**
 * Admin Quote List Item
 * GET /api/v1/admin/quotes
 */
export interface AdminQuoteListItem {
  quoteId: string;
  tripName: string;
  tripType: TripTypeType;
  status: QuoteStatusType;
  currentStep: number;
  totalPrice: number | null | undefined;
  createdAt: Date | string;
  user: {
    fullName: string;
    email: string;
  };
}

/**
 * Admin Quote List Response
 * GET /api/v1/admin/quotes
 */
export interface AdminQuoteListResponse {
  success: boolean;
  quotes: AdminQuoteListItem[];
  pagination: PaginationMeta;
}

/**
 * Admin Quote List Request Parameters
 */
export interface AdminQuoteListParams {
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
  search?: string;
}

