import { Skeleton } from 'antd';

interface FleetCardSkeletonProps {
  variant?: 'vehicle' | 'vehicleType' | 'amenity';
}

/**
 * Fleet Card Skeleton
 * Matches the structure of fleet cards in grid view
 */
export const FleetCardSkeleton: React.FC<FleetCardSkeletonProps> = ({ 
  variant = 'vehicle' 
}) => {
  return (
    <div className="w-full self-start flex flex-col bg-(--color-bg-card) rounded-lg shadow-sm p-4 border border-(--color-border)">
      {/* Header with title and actions */}
      <div className="flex items-start justify-between mb-3">
        <Skeleton.Input active size="default" style={{ width: '60%', height: 20 }} />
        <div className="flex gap-2">
          <Skeleton.Button active size="small" style={{ width: 32, height: 32 }} />
          <Skeleton.Button active size="small" style={{ width: 32, height: 32 }} />
        </div>
      </div>

      {/* Image placeholder (for vehicles) */}
      {variant === 'vehicle' && (
        <div className="mb-3">
          <Skeleton.Image active style={{ width: '100%', height: 150 }} />
        </div>
      )}

      {/* Content rows */}
      <div className="space-y-2">
        {variant === 'vehicle' && (
          <>
            <Skeleton.Input active size="small" style={{ width: '80%', height: 16 }} />
            <Skeleton.Input active size="small" style={{ width: '60%', height: 16 }} />
            <Skeleton.Input active size="small" style={{ width: '70%', height: 16 }} />
          </>
        )}
        {variant === 'vehicleType' && (
          <>
            <Skeleton.Input active size="small" style={{ width: '100%', height: 16 }} />
            <Skeleton.Input active size="small" style={{ width: '90%', height: 16 }} />
            <Skeleton.Input active size="small" style={{ width: '75%', height: 16 }} />
          </>
        )}
        {variant === 'amenity' && (
          <>
            <Skeleton.Input active size="small" style={{ width: '100%', height: 16 }} />
            <Skeleton.Input active size="small" style={{ width: '50%', height: 16 }} />
          </>
        )}
      </div>

      {/* Footer (for vehicles and amenities with price) */}
      {(variant === 'vehicle' || variant === 'amenity') && (
        <div className="mt-3 pt-3 border-t border-(--color-border)">
          <Skeleton.Input active size="small" style={{ width: '40%', height: 16 }} />
        </div>
      )}
    </div>
  );
};

