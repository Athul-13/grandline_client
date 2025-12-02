import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { chartColors, getColorByIndex } from '../../../utils/chart_colors';

interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

interface PieChartCardProps {
  title: string;
  data: PieChartData[];
  delay?: number;
  emptyMessage?: string;
  height?: number;
}

/**
 * Pie Chart Card Component
 * Displays a pie chart with empty state support and smooth animations
 */
export const PieChartCard: React.FC<PieChartCardProps> = ({
  title,
  data,
  delay = 0,
  emptyMessage = 'No data available',
  height = 300,
}) => {
  const hasData = data && data.length > 0 && data.some(item => item.value > 0);
  
  // Prepare chart data with colors
  const chartData = hasData
    ? data.map((item, index) => ({
        ...item,
        color: item.color || getColorByIndex(index),
      }))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] p-4"
    >
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
        {title}
      </h3>
      {hasData ? (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={100}
              fill={chartColors.primary}
              dataKey="value"
              animationBegin={delay * 1000}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-text-primary)',
              }}
              labelStyle={{ color: 'var(--color-text-primary)' }}
            />
            <Legend
              wrapperStyle={{ color: 'var(--color-text-primary)' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: `${height}px` }} className="flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-[var(--color-border)] flex items-center justify-center">
              <span className="text-sm text-[var(--color-text-secondary)]">
                {emptyMessage}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">{emptyMessage}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

