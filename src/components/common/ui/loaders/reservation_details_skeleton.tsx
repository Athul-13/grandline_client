import { Skeleton } from 'antd';
import { AccordionSectionSkeleton } from './accordion_section_skeleton';

interface ReservationDetailsSkeletonProps {
  variant: 'admin' | 'user'; // Different layouts for admin vs user
}

/**
 * Reservation Details Skeleton
 * Composed from smaller building blocks
 */
export const ReservationDetailsSkeleton: React.FC<ReservationDetailsSkeletonProps> = ({ variant }) => {
  if (variant === 'admin') {
    // Admin: Accordion sections (vertical list)
    return (
      <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
        {/* Header skeleton */}
        <div className="flex-shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton.Button active size="small" style={{ width: 40, height: 40 }} />
              <div>
                <Skeleton.Input active size="default" style={{ width: '200px', height: 20 }} />
                <Skeleton.Input active size="small" style={{ width: '150px', height: 16, marginTop: 4 }} />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton.Button active size="small" style={{ width: 80, height: 32 }} />
              <Skeleton.Button active size="small" style={{ width: 100, height: 32 }} />
            </div>
          </div>
        </div>
        {/* Content: Accordion sections */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
          <AccordionSectionSkeleton rows={3} />
          <AccordionSectionSkeleton rows={3} />
          <AccordionSectionSkeleton rows={4} />
          <AccordionSectionSkeleton rows={2} />
          <AccordionSectionSkeleton rows={5} />
          <AccordionSectionSkeleton rows={3} />
          <AccordionSectionSkeleton rows={2} />
          <AccordionSectionSkeleton rows={3} />
          <AccordionSectionSkeleton rows={2} />
        </div>
      </div>
    );
  }

  // User: Bento grid (2 columns) - similar to quote details
  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--color-bg-card)] rounded-lg shadow-sm border border-[var(--color-border)]">
      {/* Header skeleton */}
      <div className="flex-shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3">
        <div className="flex items-center justify-between">
          <Skeleton.Input active size="default" style={{ width: '200px', height: 24 }} />
          <Skeleton.Button active size="small" style={{ width: 60, height: 32 }} />
        </div>
      </div>
      {/* Content: Bento grid */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <Skeleton.Input active size="default" style={{ width: '100%', height: 120 }} />
            <Skeleton.Input active size="default" style={{ width: '100%', height: 200 }} />
            <Skeleton.Input active size="default" style={{ width: '100%', height: 150 }} />
          </div>
          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <Skeleton.Input active size="default" style={{ width: '100%', height: 150 }} />
            <Skeleton.Input active size="default" style={{ width: '100%', height: 200 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

