import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AnnouncementBannerProps {
  message?: string;
  className?: string;
}

/**
 * Announcement Banner Component
 * Displays a marquee-style scrolling announcement banner with seamless infinite scroll
 */
export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  message = 'Server is currently under maintenance. Some features may be temporarily unavailable.',
  className,
}) => {
  // Create content block that will be duplicated for seamless loop
  const contentBlock = (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
      <span className="inline-block w-16" aria-hidden="true" />
    </span>
  );

  return (
    <div
      className={cn(
        'w-full bg-(--color-primary) text-white py-2 px-4 overflow-hidden relative z-50',
        'flex items-center',
        className
      )}
      role="banner"
      aria-live="polite"
    >
      {/* Viewport container - hides overflow */}
      <div className="w-full overflow-hidden">
        {/* Animated container - moves continuously */}
        <div className="animate-marquee-seamless inline-flex">
          {/* First content block */}
          {contentBlock}
          {/* Duplicate content block for seamless loop */}
          {contentBlock}
          {contentBlock}
          {contentBlock}
        </div>
      </div>
    </div>
  );
};
