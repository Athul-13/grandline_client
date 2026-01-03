import { Skeleton } from 'antd';

/**
 * Trip Card Skeleton
 * Matches the structure of AdminTripCard
 */
export const TripCardSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)] flex flex-col">
      {/* Header with Status Badge */}
      <div className="p-4 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-start justify-between mb-2">
          <Skeleton.Input active size="default" style={{ width: '60%', height: 20 }} />
          <Skeleton.Button active size="small" style={{ width: 70, height: 24 }} />
        </div>
        <Skeleton.Input active size="small" style={{ width: '40%', height: 14, marginTop: 4 }} />
      </div>

      {/* Trip Details */}
      <div className="p-4 space-y-3 flex-1">
        {/* Date Range */}
        <div className="flex items-start gap-2">
          <Skeleton.Button active size="small" style={{ width: 16, height: 16, marginTop: 2 }} />
          <div className="flex-1 min-w-0">
            <Skeleton.Input active size="small" style={{ width: '40%', height: 14, marginBottom: 4 }} />
            <Skeleton.Input active size="small" style={{ width: '80%', height: 16 }} />
          </div>
        </div>

        {/* User */}
        <div className="flex items-start gap-2">
          <Skeleton.Button active size="small" style={{ width: 16, height: 16, marginTop: 2 }} />
          <div className="flex-1 min-w-0">
            <Skeleton.Input active size="small" style={{ width: '30%', height: 14, marginBottom: 4 }} />
            <Skeleton.Input active size="small" style={{ width: '70%', height: 16 }} />
          </div>
        </div>

        {/* Driver */}
        <div className="flex items-start gap-2">
          <Skeleton.Button active size="small" style={{ width: 16, height: 16, marginTop: 2 }} />
          <div className="flex-1 min-w-0">
            <Skeleton.Input active size="small" style={{ width: '35%', height: 14, marginBottom: 4 }} />
            <Skeleton.Input active size="small" style={{ width: '65%', height: 16 }} />
          </div>
        </div>
      </div>

      {/* Footer with CTA */}
      <div className="p-4 pt-3 border-t border-[var(--color-border)]">
        <Skeleton.Button active size="default" style={{ width: '100%', height: 36 }} />
      </div>
    </div>
  );
};

