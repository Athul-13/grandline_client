import { Skeleton } from 'antd';
import { BentoCardSkeleton } from './bento_card_skeleton';
import { AccordionSectionSkeleton } from './accordion_section_skeleton';

interface QuoteDetailsSkeletonProps {
  variant: 'admin' | 'user'; // Different layouts for admin vs user
}

/**
 * Quote Details Skeleton
 * Composed from smaller building blocks
 */
export const QuoteDetailsSkeleton: React.FC<QuoteDetailsSkeletonProps> = ({ variant }) => {
  if (variant === 'admin') {
    // Admin: Accordion sections (vertical list)
    return (
      <div className="flex flex-col h-full min-h-0 bg-(--color-bg-card) rounded-lg shadow-sm border border-(--color-border)">
        {/* Header skeleton */}
        <div className="shrink-0 border-b border-(--color-border) bg-(--color-bg-secondary) px-4 py-3">
          <div className="flex items-center justify-between">
            <Skeleton.Input active size="default" style={{ width: '200px', height: 24 }} />
            <div className="flex gap-2">
              <Skeleton.Button active size="small" style={{ width: 80, height: 32 }} />
              <Skeleton.Button active size="small" style={{ width: 80, height: 32 }} />
            </div>
          </div>
        </div>
        {/* Content: Accordion sections */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
          <AccordionSectionSkeleton rows={3} />
          <AccordionSectionSkeleton rows={4} />
          <AccordionSectionSkeleton rows={2} />
          <AccordionSectionSkeleton rows={5} />
          <AccordionSectionSkeleton rows={3} />
          <AccordionSectionSkeleton rows={2} />
        </div>
      </div>
    );
  }

  // User: Bento grid (2 columns)
  return (
    <div className="flex flex-col h-full min-h-0 bg-(--color-bg-card) rounded-lg shadow-sm border border-(--color-border)">
      {/* Header skeleton */}
      <div className="shrink-0 border-b border-(--color-border) bg-(--color-bg-secondary) px-4 py-3">
        <div className="flex items-center justify-between">
          <Skeleton.Input active size="default" style={{ width: '200px', height: 24 }} />
          <div className="flex gap-2">
            <Skeleton.Button active size="small" style={{ width: 60, height: 32 }} />
            <Skeleton.Button active size="small" style={{ width: 60, height: 32 }} />
            <Skeleton.Button active size="small" style={{ width: 60, height: 32 }} />
          </div>
        </div>
      </div>
      {/* Content: Bento grid */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <BentoCardSkeleton rows={4} />
            <BentoCardSkeleton rows={6} height="250px" />
            <BentoCardSkeleton rows={3} height="150px" />
            <BentoCardSkeleton rows={5} />
          </div>
          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <BentoCardSkeleton rows={8} height="400px" />
            <BentoCardSkeleton rows={4} height="150px" />
            <BentoCardSkeleton rows={3} height="200px" />
          </div>
        </div>
      </div>
    </div>
  );
};

