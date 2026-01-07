import { TrendingUp } from 'lucide-react';
import { formatDate } from '../../../utils/quote_formatters';
import type { AdminDriverDetailsResponse } from '../../../types/drivers/admin_driver';

interface DriverStatsSectionProps {
  stats: AdminDriverDetailsResponse['stats'];
}

/**
 * Driver Stats Section Component
 * Displays driver statistics: total rides, earnings, rating, and last payment date
 */
export const DriverStatsSection: React.FC<DriverStatsSectionProps> = ({ stats }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatRating = (rating: number): string => {
    if (rating === 0) return 'N/A';
    return rating.toFixed(1);
  };

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Driver Statistics</h3>
      </div>

      <div className="space-y-4">
        {/* Total Rides */}
        <div>
          <p className="text-xs text-[var(--color-text-secondary)] mb-2">Total Rides</p>
          <p className="text-sm text-[var(--color-text-primary)] font-semibold">{stats.totalRides}</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">Completed trips</p>
        </div>

        <div className="pt-4 border-t border-[var(--color-border)]">
          {/* Earnings */}
          <div className="mb-4">
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Total Earnings</p>
            <p className="text-sm text-[var(--color-text-primary)] font-semibold">{formatCurrency(stats.earnings)}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">Unpaid earnings</p>
          </div>

          {/* Rating */}
          <div className="mb-4">
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Rating</p>
            <p className="text-sm text-[var(--color-text-primary)] font-semibold">{formatRating(stats.rating)}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">Driver rating</p>
          </div>

          {/* Last Payment Date */}
          <div>
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Last Payment</p>
            <p className="text-sm text-[var(--color-text-primary)] font-semibold">
              {stats.lastPaymentDate ? formatDate(new Date(stats.lastPaymentDate)) : 'Never'}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">Last salary payment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

