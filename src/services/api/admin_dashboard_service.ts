import grandlineAxiosClient from './axios_client';
import { API_ENDPOINTS } from '../../constants/api';
import type { AdminDashboardAnalyticsRequest, AdminDashboardAnalyticsResponse } from '../../types/dashboard/admin_dashboard';

/**
 * Admin Dashboard Service
 */
export const adminDashboardService = {
  /**
   * Get admin dashboard analytics
   * GET /api/v1/dashboard/admin/analytics
   */
  getAdminDashboardAnalytics: async (
    params?: AdminDashboardAnalyticsRequest
  ): Promise<AdminDashboardAnalyticsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.timeRange) {
      queryParams.append('timeRange', params.timeRange);
    }
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }

    const url = `${API_ENDPOINTS.dashboard.adminAnalytics}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await grandlineAxiosClient.get<AdminDashboardAnalyticsResponse>(url);
    return response.data;
  },
};

