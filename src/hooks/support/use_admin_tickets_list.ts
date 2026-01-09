import { useQuery } from '@tanstack/react-query';
import { supportService } from '../../services/api/support_service';
import type { AdminTicketsListResponse } from '../../types/support/ticket';

interface UseAdminTicketsListParams {
  page?: number;
  limit?: number;
  status?: string;
  actorType?: string;
  assignedAdminId?: string;
  search?: string;
  sortBy?: 'lastMessageAt' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const useAdminTicketsList = (params: UseAdminTicketsListParams = {}) => {
  return useQuery<AdminTicketsListResponse, Error>({
    queryKey: ['admin', 'support', 'tickets', params],
    queryFn: () => supportService.getAllTickets(params),
  });
};

