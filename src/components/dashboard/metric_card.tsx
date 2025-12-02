import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MetricCardProps {
  title: string;
  value: number;
  trend?: {
    value: number; // percentage
    isPositive: boolean;
  };
  icon: React.ReactNode;
  sparkline?: number[]; // For mini chart
  onClick?: () => void;
  delay?: number; // For stagger animation
  compact?: boolean; // Compact mode for smaller cards
}

/**
 * Metric Card Component
 * Displays a metric with animated number counting, trend indicator, and optional sparkline
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  icon,
  sparkline,
  onClick,
  delay = 0,
  compact = false,
}) => {
  // Animate number counting up
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0);
      return;
    }

    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
        className={cn(
          'bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)]',
          'p-3 transition-all duration-200',
          onClick && 'cursor-pointer',
          'hover:shadow-sm hover:border-[var(--color-primary)]/30'
        )}
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              {icon}
            </div>
            <h3 className="text-xs font-medium text-[var(--color-text-secondary)]">
              {title}
            </h3>
          </div>
          {trend && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: 'spring' }}
              className={cn(
                'flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded',
                trend.isPositive
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : trend.value === 0
                  ? 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-2.5 h-2.5" />
              ) : trend.value === 0 ? (
                <Minus className="w-2.5 h-2.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5" />
              )}
              <span>{Math.abs(trend.value).toFixed(0)}%</span>
            </motion.div>
          )}
        </div>
        
        <motion.div
          key={value}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-xl font-bold text-[var(--color-text-primary)] mb-1.5"
        >
          {displayValue.toLocaleString()}
        </motion.div>
        
        {sparkline && sparkline.length > 0 && (
          <div className="h-8 opacity-60">
            <svg width="100%" height="100%" className="overflow-visible">
              <polyline
                points={sparkline.map((val, i) => {
                  const maxVal = Math.max(...sparkline, 1);
                  const x = (i / (sparkline.length - 1 || 1)) * 100;
                  const y = 100 - (val / maxVal) * 100;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="1.5"
                className="transition-opacity"
              />
            </svg>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]',
        'p-6 transition-all duration-300',
        onClick && 'cursor-pointer',
        'hover:shadow-md hover:border-[var(--color-primary)]/30'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            {icon}
          </div>
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
            {title}
          </h3>
        </div>
        {trend && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: 'spring' }}
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              trend.isPositive
                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                : trend.value === 0
                ? 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                : 'bg-red-500/10 text-red-600 dark:text-red-400'
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : trend.value === 0 ? (
              <Minus className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </motion.div>
        )}
      </div>
      
      <motion.div
        key={value}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-3xl font-bold text-[var(--color-text-primary)] mb-2"
      >
        {displayValue.toLocaleString()}
      </motion.div>
      
      {sparkline && sparkline.length > 0 && (
        <div className="h-12 mt-4 opacity-50">
          {/* Mini sparkline visualization */}
          <svg width="100%" height="100%" className="overflow-visible">
            <polyline
              points={sparkline.map((val, i) => {
                const x = (i / (sparkline.length - 1)) * 100;
                const y = 100 - (val / Math.max(...sparkline)) * 100;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
};

