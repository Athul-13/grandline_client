import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, DollarSign, TrendingUp, Users, Car } from 'lucide-react';
import { MetricCard } from './metric_card';
import { PieChartCard } from './charts/pie_chart_card';
import { LineChartCard } from './charts/line_chart_card';
import { useAdminDashboardAnalytics } from '../../hooks/dashboard/use_admin_dashboard_analytics';
import { chartColors, getColorByIndex } from '../../utils/chart_colors';

interface QuotesAnalyticsContentProps {
  timeRange?: 'all_time' | '7_days' | '30_days' | 'custom';
  startDate?: string;
  endDate?: string;
}

/**
 * Quotes Analytics Content Component
 * Displays comprehensive analytics for quotes
 */
export const QuotesAnalyticsContent: React.FC<QuotesAnalyticsContentProps> = ({
  timeRange = 'all_time',
  startDate,
  endDate,
}) => {
  const { data, isLoading, error } = useAdminDashboardAnalytics({
    timeRange,
    startDate,
    endDate,
  });

  const quotesAnalytics = data?.quotesAnalytics;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  // Prepare status distribution data
  const statusDistributionData = useMemo(
    () =>
      quotesAnalytics?.countsByStatus
        ? Object.entries(quotesAnalytics.countsByStatus)
            .filter(([, count]) => count > 0)
            .map(([status, count], index) => ({
              name: status.charAt(0).toUpperCase() + status.slice(1),
              value: count,
              color: getColorByIndex(index),
            }))
        : [],
    [quotesAnalytics?.countsByStatus]
  );

  // Prepare time-based trends data
  const timeTrendData = useMemo(
    () =>
      quotesAnalytics?.timeBasedTrends
        ? quotesAnalytics.timeBasedTrends.map((trend) => ({
            date: trend.date,
            value: trend.count,
          }))
        : [],
    [quotesAnalytics?.timeBasedTrends]
  );

  // Prepare revenue trend data
  const revenueTrendData = useMemo(
    () =>
      quotesAnalytics?.timeBasedTrends
        ? quotesAnalytics.timeBasedTrends.map((trend) => ({
            date: trend.date,
            value: trend.revenue,
          }))
        : [],
    [quotesAnalytics?.timeBasedTrends]
  );

  // Prepare vehicle analytics data (top 5)
  const topVehiclesData = useMemo(
    () =>
      quotesAnalytics?.vehicleAnalytics
        ? quotesAnalytics.vehicleAnalytics.slice(0, 5).map((vehicle, index) => ({
            name: vehicle.vehicleName || vehicle.vehicleId,
            value: vehicle.count,
            revenue: vehicle.revenue,
            color: getColorByIndex(index),
          }))
        : [],
    [quotesAnalytics?.vehicleAnalytics]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--color-text-secondary)]">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-600 dark:text-red-400">
        Error loading quotes analytics: {error}
      </div>
    );
  }

  if (!quotesAnalytics) {
    return (
      <div className="text-center text-[var(--color-text-secondary)] p-8">
        No analytics data available
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <MetricCard
          title="Total Quotes"
          value={quotesAnalytics.totalCount}
          icon={<FileText className="w-4 h-4" />}
          delay={0}
          compact
        />
        <MetricCard
          title="Total Revenue"
          value={quotesAnalytics.revenueMetrics.totalRevenue}
          icon={<DollarSign className="w-4 h-4" />}
          delay={0.05}
          compact
        />
        <MetricCard
          title="Average Value"
          value={quotesAnalytics.revenueMetrics.averageValue}
          icon={<TrendingUp className="w-4 h-4" />}
          delay={0.1}
          compact
        />
        <MetricCard
          title="Repeat Customers"
          value={quotesAnalytics.userAnalytics.repeatCustomers}
          icon={<Users className="w-4 h-4" />}
          delay={0.15}
          compact
        />
      </div>

      {/* Main Content Grid - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status Distribution */}
        <PieChartCard
          title="Quote Status Distribution"
          data={statusDistributionData}
          delay={0.2}
          height={300}
        />

        {/* Time-based Trends */}
        <LineChartCard
          title="Quotes Over Time"
          data={timeTrendData}
          showArea
          delay={0.3}
          height={300}
        />
      </div>

      {/* Revenue Trends */}
      <LineChartCard
        title="Revenue Trends"
        data={revenueTrendData}
        showArea
        delay={0.4}
        height={300}
        color={chartColors.success}
      />

      {/* Conversion Rates Card */}
      <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] p-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          Conversion Rates
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-[var(--color-text-secondary)] mb-1">
              Draft → Submitted
            </span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {quotesAnalytics.conversionRates.draftToSubmitted.toFixed(1)}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[var(--color-text-secondary)] mb-1">
              Submitted → Quoted
            </span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {quotesAnalytics.conversionRates.submittedToQuoted.toFixed(1)}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[var(--color-text-secondary)] mb-1">
              Quoted → Paid
            </span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {quotesAnalytics.conversionRates.quotedToPaid.toFixed(1)}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[var(--color-text-secondary)] mb-1">
              Overall Conversion
            </span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {quotesAnalytics.conversionRates.overallConversion.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Top Vehicles and Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Vehicles */}
        <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
            <Car className="w-4 h-4" />
            Top Vehicles
          </h3>
          {topVehiclesData.length > 0 ? (
            <div className="space-y-2">
              {topVehiclesData.map((vehicle, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-[var(--color-bg-primary)]"
                >
                  <span className="text-sm text-[var(--color-text-primary)]">{vehicle.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {vehicle.value} quotes
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                      ₹{vehicle.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-[var(--color-text-secondary)] text-center py-4">
              No vehicle data available
            </div>
          )}
        </div>

        {/* Top Customers */}
        <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Top Customers
          </h3>
          {quotesAnalytics.userAnalytics.topCustomers.length > 0 ? (
            <div className="space-y-2">
              {quotesAnalytics.userAnalytics.topCustomers.slice(0, 5).map((customer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-[var(--color-bg-primary)]"
                >
                  <span className="text-sm text-[var(--color-text-primary)]">
                    {customer.userName || customer.userId}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {customer.quoteCount || 0} quotes
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                      ₹{customer.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-[var(--color-text-secondary)] text-center py-4">
              No customer data available
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

