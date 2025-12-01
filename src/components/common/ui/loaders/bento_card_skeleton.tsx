import { Skeleton } from 'antd';

interface BentoCardSkeletonProps {
  title?: boolean; // Show title skeleton
  rows?: number; // Number of content rows
  height?: string; // Custom height (e.g., "250px")
}

/**
 * Skeleton for a single bento card
 */
export const BentoCardSkeleton: React.FC<BentoCardSkeletonProps> = ({
  title = true,
  rows = 3,
  height,
}) => {
  return (
    <div
      className="bg-(--color-bg-card) rounded-lg shadow-sm border border-(--color-border) p-4"
      style={height ? { height } : {}}
    >
      {title && (
        <div className="mb-4">
          <Skeleton.Input active size="small" style={{ width: '40%', height: 20 }} />
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton.Input
            key={i}
            active
            size="small"
            style={{ width: i === rows - 1 ? '60%' : '100%', height: 16 }}
          />
        ))}
      </div>
    </div>
  );
};

