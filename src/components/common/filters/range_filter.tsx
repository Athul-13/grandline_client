import React from 'react';
import { cn } from '../../../utils/cn';
import type { RangeFilterConfig } from '../../../types/fleet/filter';

interface RangeFilterProps {
  filter: RangeFilterConfig;
  value: { min: string; max: string };
  onChange: (value: { min: string; max: string }) => void;
  disabled?: boolean;
}

/**
 * Range Filter Component
 * Renders min/max number inputs for range filtering
 * 
 * @example
 * <RangeFilter
 *   filter={rangeFilterConfig}
 *   value={{ min: '2020', max: '2024' }}
 *   onChange={setRangeValue}
 * />
 */
export const RangeFilter: React.FC<RangeFilterProps> = ({
  filter,
  value = { min: '', max: '' },
  onChange,
  disabled = false,
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange({
      ...value,
      min: e.target.value,
    });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange({
      ...value,
      max: e.target.value,
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="number"
          value={value.min}
          onChange={handleMinChange}
          disabled={disabled}
          min={filter.min}
          max={filter.max}
          step={filter.step || 1}
          placeholder={filter.placeholder?.min || `Min (${filter.min})`}
          className={cn(
            'flex-1 px-2 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        <input
          type="number"
          value={value.max}
          onChange={handleMaxChange}
          disabled={disabled}
          min={filter.min}
          max={filter.max}
          step={filter.step || 1}
          placeholder={filter.placeholder?.max || `Max (${filter.max})`}
          className={cn(
            'flex-1 px-2 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">
        Range: {filter.min} - {filter.max}
      </p>
    </div>
  );
};

