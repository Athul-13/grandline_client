import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  TrendingUp,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { MetricCard } from './metric_card';
import { PieChartCard } from './charts/pie_chart_card';
import { LineChartCard } from './charts/line_chart_card';
import { useDriverStatistics } from '../../hooks/drivers/use_driver_statistics';
import { chartColors } from '../../utils/chart_colors';

interface DriverDashboardContentProps {
  timeRange?: 'all_time' | '7_days' | '30_days' | 'custom';
  startDate?: string;
  endDate?: string;
}

/**
 * Professional Driver Dashboard Content Component
 * Space-efficient, information-dense layout for driver statistics
 */
export const DriverDashboardContent: React.FC<DriverDashboardContentProps> = ({
  timeRange = 'all_time',
  startDate,
  endDate,
}) => {
  const { data: driverStats, error, isLoading } = useDriverStatistics({
    timeRange,
    startDate,
    endDate,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  // Calculate availability rate for trend indicator
  const availabilityRate = useMemo(
    () =>
      driverStats && driverStats.totalDrivers > 0
        ? (driverStats.availableDrivers / driverStats.totalDrivers) * 100
        : 0,
    [driverStats]
  );

  // Calculate onboarding completion rate
  const onboardingRate = useMemo(
    () =>
      driverStats && driverStats.totalDrivers > 0
        ? (driverStats.onboardedDrivers / driverStats.totalDrivers) * 100
        : 0,
    [driverStats]
  );

  // Prepare status distribution chart data
  const statusDistributionData = useMemo(
    () =>
      driverStats
        ? [
            {
              name: 'Available',
              value: driverStats.availableDrivers,
              color: chartColors.success, // Green
            },
            {
              name: 'On Trip',
              value: driverStats.onTripDrivers,
              color: chartColors.info, // Blue
            },
            {
              name: 'Offline',
              value: driverStats.offlineDrivers,
              color: chartColors.inactive, // Gray/Orange
            },
            {
              name: 'Suspended',
              value: driverStats.suspendedDrivers,
              color: chartColors.warning, // Yellow/Orange
            },
            {
              name: 'Blocked',
              value: driverStats.blockedDrivers,
              color: chartColors.danger, // Red
            },
          ].filter((item) => item.value > 0)
        : [],
    [driverStats]
  );


  // Prepare growth trend data (simulated based on new drivers)
  const growthTrendData = useMemo(
    () =>
      driverStats && driverStats.newDrivers > 0
        ? [
            { date: 'D1', value: Math.max(0, Math.floor(driverStats.newDrivers * 0.1)) },
            { date: 'D2', value: Math.max(0, Math.floor(driverStats.newDrivers * 0.25)) },
            { date: 'D3', value: Math.max(0, Math.floor(driverStats.newDrivers * 0.4)) },
            { date: 'D4', value: Math.max(0, Math.floor(driverStats.newDrivers * 0.55)) },
            { date: 'D5', value: Math.max(0, Math.floor(driverStats.newDrivers * 0.7)) },
            { date: 'D6', value: Math.max(0, Math.floor(driverStats.newDrivers * 0.85)) },
            { date: 'D7', value: driverStats.newDrivers },
          ].filter((item) => item.value >= 0)
        : [],
    [driverStats]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[var(--color-text-secondary)]">Loading driver statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-600 dark:text-red-400">
        Error loading statistics: {error}
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
      {/* Top Metrics Row - Total Drivers, Available Drivers, and Onboarded Drivers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MetricCard
          title="Total Drivers"
          value={driverStats?.totalDrivers || 0}
          icon={<Car className="w-4 h-4" />}
          delay={0}
          compact
        />
        <MetricCard
          title="Available Drivers"
          value={driverStats?.availableDrivers || 0}
          icon={<Activity className="w-4 h-4" />}
          trend={{ value: availabilityRate, isPositive: true }}
          delay={0.05}
          compact
        />
        <MetricCard
          title="Onboarded Drivers"
          value={driverStats?.onboardedDrivers || 0}
          icon={<CheckCircle2 className="w-4 h-4" />}
          trend={{ value: onboardingRate, isPositive: true }}
          delay={0.1}
          compact
        />
      </div>

      {/* Main Content Grid - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Growth Trend */}
        <LineChartCard
          title="Driver Growth Trend"
          data={growthTrendData}
          showArea
          delay={0.3}
          height={300}
        />

        {/* Right Column - Status Distribution (Pie Chart) */}
        <PieChartCard
          title="Driver Status Distribution"
          data={statusDistributionData}
          delay={0.4}
          height={300}
        />
      </div>

      {/* Quick Stats Card - Full Width */}
      <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] p-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          Quick Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-[var(--color-text-secondary)] mb-1">New Drivers</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                {driverStats?.newDrivers || 0}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[var(--color-text-secondary)] mb-1">Available</span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {driverStats?.availableDrivers || 0}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[var(--color-text-secondary)] mb-1">Onboarded</span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {driverStats?.onboardedDrivers || 0}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[var(--color-text-secondary)] mb-1">Blocked</span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {driverStats?.blockedDrivers || 0}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

