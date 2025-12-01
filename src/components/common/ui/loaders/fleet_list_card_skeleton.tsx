import { Skeleton } from 'antd';

/**
 * Fleet List Card Skeleton
 * Matches the structure of fleet cards in list view
 */
export const FleetListCardSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-(--color-bg-card) rounded-lg shadow-sm p-4 border border-(--color-border)">
      <div className="flex items-start gap-4">
        {/* Image placeholder */}
        <Skeleton.Image active style={{ width: 120, height: 120, flexShrink: 0 }} />
        
        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <Skeleton.Input active size="default" style={{ width: '40%', height: 20 }} />
            <div className="flex gap-2">
              <Skeleton.Button active size="small" style={{ width: 32, height: 32 }} />
              <Skeleton.Button active size="small" style={{ width: 32, height: 32 }} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Skeleton.Input active size="small" style={{ width: '100%', height: 16 }} />
            <Skeleton.Input active size="small" style={{ width: '80%', height: 16 }} />
            <Skeleton.Input active size="small" style={{ width: '60%', height: 16 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

