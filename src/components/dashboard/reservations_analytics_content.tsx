import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, TrendingUp, Users, Car, RefreshCw } from 'lucide-react';
import { MetricCard } from './metric_card';
import { PieChartCard } from './charts/pie_chart_card';
import { LineChartCard } from './charts/line_chart_card';
import { useAdminDashboardAnalytics } from '../../hooks/dashboard/use_admin_dashboard_analytics';
import { chartColors, getColorByIndex } from '../../utils/chart_colors';

interface ReservationsAnalyticsContentProps {
  timeRange?: 'all_time' | '7_days' | '30_days' | 'custom';
  startDate?: string;
  endDate?: string;
}

/**
 * Reservations Analytics Content Component
 * Displays comprehensive analytics for reservations
 */
export const ReservationsAnalyticsContent: React.FC<ReservationsAnalyticsContentProps> = ({
  timeRange = 'all_time',
  startDate,
  endDate,
}) => {
  const { data, isLoading, error } = useAdminDashboardAnalytics({
    timeRange,
    startDate,
    endDate,
  });

  const reservationsAnalytics = data?.reservationsAnalytics;

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
      reservationsAnalytics?.countsByStatus
        ? Object.entries(reservationsAnalytics.countsByStatus)
            .filter(([, count]) => count > 0)
            .map(([status, count], index) => ({
              name: status.charAt(0).toUpperCase() + status.slice(1),
              value: count,
              color: getColorByIndex(index),
            }))
        : [],
    [reservationsAnalytics?.countsByStatus]
  );

  // Prepare time-based trends data
  const timeTrendData = useMemo(
    () =>
      reservationsAnalytics?.timeBasedTrends
        ? reservationsAnalytics.timeBasedTrends.map((trend) => ({
            date: trend.date,
            value: trend.count,
          }))
        : [],
    [reservationsAnalytics?.timeBasedTrends]
  );

  // Prepare revenue trend data
  const revenueTrendData = useMemo(
    () =>
      reservationsAnalytics?.timeBasedTrends
        ? reservationsAnalytics.timeBasedTrends.map((trend) => ({
            date: trend.date,
            value: trend.revenue,
          }))
        : [],
    [reservationsAnalytics?.timeBasedTrends]
  );

  // Prepare vehicle analytics data (top 5)
  const topVehiclesData = useMemo(
    () =>
      reservationsAnalytics?.vehicleAnalytics
        ? reservationsAnalytics.vehicleAnalytics.slice(0, 5).map((vehicle, index) => ({
            name: vehicle.vehicleName || vehicle.vehicleId,
            value: vehicle.count,
            revenue: vehicle.revenue,
            utilization: vehicle.utilization || 0,
            color: getColorByIndex(index),
          }))
        : [],
    [reservationsAnalytics?.vehicleAnalytics]
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
        Error loading reservations analytics: {error}
      </div>
    );
  }

  if (!reservationsAnalytics) {
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
          title="Total Reservations"
          value={reservationsAnalytics.totalCount}
          icon={<Calendar className="w-4 h-4" />}
          delay={0}
          compact
        />
        <MetricCard
          title="Total Revenue"
          value={reservationsAnalytics.revenueMetrics.totalRevenue}
          icon={<DollarSign className="w-4 h-4" />}
          delay={0.05}
          compact
        />
        <MetricCard
          title="Average Value"
          value={reservationsAnalytics.revenueMetrics.averageValue}
          icon={<TrendingUp className="w-4 h-4" />}
          delay={0.1}
          compact
        />
        <MetricCard
          title="Repeat Customers"
          value={reservationsAnalytics.userAnalytics.repeatCustomers}
          icon={<Users className="w-4 h-4" />}
          delay={0.15}
          compact
        />
      </div>

      {/* Main Content Grid - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status Distribution */}
        <PieChartCard
          title="Reservation Status Distribution"
          data={statusDistributionData}
          delay={0.2}
          height={300}
        />

        {/* Time-based Trends */}
        <LineChartCard
          title="Reservations Over Time"
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

      {/* Conversion Rates and Refund Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Conversion Rates Card */}
        <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Conversion Rates
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-[var(--color-text-secondary)] mb-1">
                Quote → Reservation
              </span>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {reservationsAnalytics.conversionRates.quoteToReservation.toFixed(1)}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[var(--color-text-secondary)] mb-1">
                Confirmed → Completed
              </span>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {reservationsAnalytics.conversionRates.confirmedToCompleted.toFixed(1)}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[var(--color-text-secondary)] mb-1">
                Cancellation Rate
              </span>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {reservationsAnalytics.conversionRates.cancellationRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Refund Analytics Card */}
        <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] p-4">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refund Analytics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-[var(--color-text-secondary)] mb-1">
                Total Refunded
              </span>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                ₹{reservationsAnalytics.refundAnalytics.totalRefunded.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[var(--color-text-secondary)] mb-1">
                Refund Rate
              </span>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {reservationsAnalytics.refundAnalytics.refundRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[var(--color-text-secondary)] mb-1">
                Avg Refund Amount
              </span>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                ₹{reservationsAnalytics.refundAnalytics.averageRefundAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[var(--color-text-secondary)] mb-1">
                Partial Refunds
              </span>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {reservationsAnalytics.refundAnalytics.refundsByStatus.partial || 0}
              </span>
            </div>
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
                      {vehicle.value} reservations
                    </span>
                    {vehicle.utilization !== undefined && (
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        {vehicle.utilization.toFixed(1)}% util.
                      </span>
                    )}
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
          {reservationsAnalytics.userAnalytics.topCustomers.length > 0 ? (
            <div className="space-y-2">
              {reservationsAnalytics.userAnalytics.topCustomers.slice(0, 5).map((customer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-[var(--color-bg-primary)]"
                >
                  <span className="text-sm text-[var(--color-text-primary)]">
                    {customer.userName || customer.userId}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {customer.reservationCount || 0} reservations
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

