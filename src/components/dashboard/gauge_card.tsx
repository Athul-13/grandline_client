import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { chartColors } from '../../utils/chart_colors';

interface GaugeCardProps {
  title: string;
  value: number; // 0-100
  target?: number;
  color?: string;
  delay?: number;
}

/**
 * Gauge Card Component
 * Displays a circular progress indicator with smooth fill animation
 */
export const GaugeCard: React.FC<GaugeCardProps> = ({
  title,
  value,
  target,
  color = chartColors.primary,
  delay = 0,
}) => {
  const circumference = 2 * Math.PI * 36; // radius = 36 (for compact size)
  const offset = circumference - (value / 100) * circumference;
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] p-4"
    >
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
        {title}
      </h3>
      <div className="relative w-24 h-24 mx-auto">
        <svg className="transform -rotate-90 w-24 h-24">
          {/* Background ring */}
          <circle
            cx="48"
            cy="48"
            r="36"
            stroke="var(--color-bg-secondary)"
            strokeWidth="6"
            fill="none"
          />
          {/* Progress ring */}
          <motion.circle
            cx="48"
            cy="48"
            r="36"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, delay, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.5, type: 'spring' }}
              className="text-lg font-bold text-[var(--color-text-primary)]"
            >
              {clampedValue.toFixed(0)}%
            </motion.div>
            {target !== undefined && (
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                Target: {target}%
              </div>
            )}
          </div>
        </div>
      </div>
      {target !== undefined && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {clampedValue >= target ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                Target achieved
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                {((target - clampedValue) / target * 100).toFixed(0)}% below target
              </span>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

