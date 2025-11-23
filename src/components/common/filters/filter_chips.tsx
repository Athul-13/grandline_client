import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import type { FilterChip } from './filter_drawer';

interface FilterChipsProps {
  filters: FilterChip[];
  onRemove?: (key: string) => void;
  onClearAll?: () => void;
  className?: string;
}

/**
 * Filter Chips Component
 * Displays active filter chips with remove functionality
 */
export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onRemove,
  onClearAll,
  className,
}) => {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">
          Active filters:
        </span>
        {onClearAll && (
          <button
            onClick={onClearAll}
            className="text-xs text-[var(--color-primary)] hover:underline font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <div
            key={filter.key}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-text-primary)] text-xs transition-all hover:bg-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40"
          >
            <span className="font-medium">{filter.label}:</span>
            <span>{filter.value}</span>
            <button
              onClick={onRemove ? () => onRemove(filter.key) : filter.onRemove}
              className="ml-0.5 hover:bg-[var(--color-primary)]/20 rounded-full p-0.5 transition-all hover:scale-110 active:scale-95"
              title="Remove filter"
              aria-label={`Remove ${filter.label} filter`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

