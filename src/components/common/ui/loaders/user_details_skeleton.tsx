import { BentoCardSkeleton } from './bento_card_skeleton';

/**
 * User Details Skeleton
 * Uses bento grid layout (similar to user quote details)
 */
export const UserDetailsSkeleton: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <BentoCardSkeleton rows={6} />
        </div>
        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <BentoCardSkeleton rows={5} />
          <BentoCardSkeleton rows={4} />
        </div>
      </div>
    </div>
  );
};

