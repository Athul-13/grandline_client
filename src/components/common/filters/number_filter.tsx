import React from 'react';
import { cn } from '../../../utils/cn';
import type { NumberFilterConfig } from '../../../types/fleet/filter';

interface NumberFilterProps {
  filter: NumberFilterConfig;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Number Filter Component
 * Renders single number input with operator (min/max/exact) and optional prefix/suffix
 * 
 * @example
 * <NumberFilter
 *   filter={numberFilterConfig}
 *   value="500"
 *   onChange={setValue}
 * />
 */
export const NumberFilter: React.FC<NumberFilterProps> = ({
  filter,
  value = '',
  onChange,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange(e.target.value);
  };

  const getPlaceholder = () => {
    if (filter.placeholder) return filter.placeholder;
    
    const operatorText = filter.operator === 'min' ? 'Minimum' : 
                        filter.operator === 'max' ? 'Maximum' : 
                        'Exact';
    return `${operatorText} (${filter.min} - ${filter.max})`;
  };

  const getLabel = () => {
    const operatorText = filter.operator === 'min' ? '≥' : 
                        filter.operator === 'max' ? '≤' : 
                        '=';
    return `${operatorText} ${filter.prefix || ''}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {filter.operator !== 'exact' && (
          <span className="text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
            {getLabel()}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          min={filter.min}
          max={filter.max}
          step={filter.step || 1}
          placeholder={getPlaceholder()}
          className={cn(
            'flex-1 px-2 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        {filter.suffix && (
          <span className="text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
            {filter.suffix}
          </span>
        )}
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">
        Range: {filter.prefix || ''}{filter.min}{filter.suffix || ''} - {filter.prefix || ''}{filter.max}{filter.suffix || ''}
      </p>
    </div>
  );
};

