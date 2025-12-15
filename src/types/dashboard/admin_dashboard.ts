/**
 * Admin Dashboard Analytics Types
 */

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface RevenueMetrics {
  totalRevenue: number;
  averageValue: number;
  minValue: number;
  maxValue: number;
}

export interface QuoteConversionRates {
  draftToSubmitted: number;
  submittedToQuoted: number;
  quotedToPaid: number;
  overallConversion: number;
}

export interface ReservationConversionRates {
  quoteToReservation: number;
  confirmedToCompleted: number;
  cancellationRate: number;
}

export interface TimeTrend {
  date: string;
  count: number;
  revenue: number;
}

export interface GeographicData {
  location: string;
  count: number;
  revenue?: number;
}

export interface VehicleAnalytics {
  vehicleId: string;
  vehicleName?: string;
  count: number;
  revenue: number;
  utilization?: number;
}

export interface UserAnalytics {
  userId: string;
  userName?: string;
  quoteCount?: number;
  reservationCount?: number;
  totalRevenue: number;
}

export interface RefundAnalytics {
  totalRefunded: number;
  refundRate: number;
  refundsByStatus: { [status: string]: number };
  averageRefundAmount: number;
}

export interface QuoteAnalytics {
  countsByStatus: { [status: string]: number };
  totalCount: number;
  revenueMetrics: RevenueMetrics;
  conversionRates: QuoteConversionRates;
  timeBasedTrends: TimeTrend[];
  geographicData: GeographicData[];
  vehicleAnalytics: VehicleAnalytics[];
  userAnalytics: {
    topCustomers: UserAnalytics[];
    repeatCustomers: number;
    newCustomers: number;
  };
}

export interface ReservationAnalytics {
  countsByStatus: { [status: string]: number };
  totalCount: number;
  revenueMetrics: RevenueMetrics;
  conversionRates: ReservationConversionRates;
  timeBasedTrends: TimeTrend[];
  geographicData: GeographicData[];
  vehicleAnalytics: VehicleAnalytics[];
  userAnalytics: {
    topCustomers: UserAnalytics[];
    repeatCustomers: number;
  };
  refundAnalytics: RefundAnalytics;
}

export interface OverallMetrics {
  totalQuotes: number;
  totalReservations: number;
  totalRevenue: number;
  quoteToReservationConversionRate: number;
  averageQuoteValue: number;
  averageReservationValue: number;
}

export interface AdminDashboardAnalyticsRequest {
  timeRange?: 'all_time' | '7_days' | '30_days' | 'custom';
  startDate?: string;
  endDate?: string;
}

export interface AdminDashboardAnalyticsResponse {
  success: boolean;
  quotesAnalytics: QuoteAnalytics;
  reservationsAnalytics: ReservationAnalytics;
  overallMetrics: OverallMetrics;
}

