import React, { useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  showBorder?: boolean;
}

/**
 * Filter Section Component
 * Reusable collapsible filter section with smooth expand/collapse animations
 */
export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  isExpanded,
  onToggle,
  children,
  className,
  showBorder = true,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState<number>(0);

  // Calculate content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        // Set height to actual content height
        setContentHeight(contentRef.current.scrollHeight);
      } else {
        // Set height to 0 for collapse
        setContentHeight(0);
      }
    }
  }, [isExpanded, children]);

  return (
    <div
      className={cn(
        'mb-4',
        showBorder && 'border-b border-[var(--color-border)] pb-4',
        className
      )}
    >
      {/* Header Button */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors"
        aria-expanded={isExpanded}
        aria-controls={`filter-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <span>{title}</span>
        <div className="transition-transform duration-200 ease-out">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Content with smooth height animation */}
      <div
        id={`filter-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className={cn(
          'overflow-hidden transition-all duration-200 ease-out',
          isExpanded ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : '0px',
        }}
      >
        <div ref={contentRef}>
          {children || (
            <p className="text-sm text-[var(--color-text-muted)] italic py-2">
              No options available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

