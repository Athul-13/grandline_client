import { Skeleton } from 'antd';

interface AccordionSectionSkeletonProps {
  rows?: number;
}

/**
 * Skeleton for accordion section (used in admin quote details)
 */
export const AccordionSectionSkeleton: React.FC<AccordionSectionSkeletonProps> = ({
  rows = 4,
}) => {
  return (
    <div className="mb-4 border border-(--color-border) rounded-lg p-4">
      {/* Accordion header */}
      <div className="flex items-center justify-between mb-3">
        <Skeleton.Input active size="small" style={{ width: '30%', height: 20 }} />
        <Skeleton.Button active size="small" style={{ width: 20, height: 20 }} />
      </div>
      {/* Content */}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton.Input
            key={i}
            active
            size="small"
            style={{ width: i === rows - 1 ? '70%' : '100%', height: 16 }}
          />
        ))}
      </div>
    </div>
  );
};

