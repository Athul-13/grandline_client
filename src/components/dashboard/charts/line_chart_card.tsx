import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { motion } from 'framer-motion';
import { chartColors } from '../../../utils/chart_colors';

interface LineChartData {
  date: string;
  value: number;
}

interface LineChartCardProps {
  title: string;
  data: LineChartData[];
  color?: string;
  delay?: number;
  showArea?: boolean;
  emptyMessage?: string;
  height?: number;
}

/**
 * Line Chart Card Component
 * Displays a line or area chart with empty state support and smooth animations
 */
export const LineChartCard: React.FC<LineChartCardProps> = ({
  title,
  data,
  color = chartColors.primary,
  delay = 0,
  showArea = false,
  emptyMessage = 'No data available',
  height = 300,
}) => {
  // Check if we have valid data with at least some non-zero values
  const hasData = data && data.length > 0 && data.some(item => item.value > 0);
  const gradientId = `gradient-${title.replace(/\s+/g, '-').toLowerCase()}`;

  const ChartComponent = showArea ? AreaChart : LineChart;
  const DataComponent = showArea ? Area : Line;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] p-4"
    >
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
        {title}
      </h3>
      {hasData ? (
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            {showArea && (
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
            )}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              stroke="var(--color-text-secondary)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="var(--color-text-secondary)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-text-primary)',
              }}
              labelStyle={{ color: 'var(--color-text-primary)' }}
            />
            <DataComponent
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={showArea ? `url(#${gradientId})` : 'none'}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
              animationBegin={delay * 1000}
              animationDuration={1000}
            />
          </ChartComponent>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: `${height}px` }} className="flex items-center justify-center">
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Empty chart structure - axes visible */}
            <div className="relative w-full h-full">
              {/* Y-axis */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--color-border)] opacity-30" />
              {/* X-axis */}
              <div className="absolute left-0 right-0 bottom-0 h-px bg-[var(--color-border)] opacity-30" />
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-full h-px bg-[var(--color-border)] opacity-10"
                  />
                ))}
              </div>
              {/* Empty message */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {emptyMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

