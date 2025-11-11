import React from 'react';
import { cn } from '../../../utils/cn';
import type { CheckboxFilterConfig } from '../../../types/fleet/filter';

interface CheckboxFilterProps {
  filter: CheckboxFilterConfig;
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

/**
 * Checkbox Filter Component
 * Renders multiple checkboxes for filter options
 * 
 * @example
 * <CheckboxFilter
 *   filter={checkboxFilterConfig}
 *   value={selectedValues}
 *   onChange={setSelectedValues}
 * />
 */
export const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  filter,
  value = [],
  onChange,
  disabled = false,
}) => {
  const handleToggle = (optionValue: string) => {
    if (disabled) return;
    
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    
    onChange(newValue);
  };

  const getOptionValue = (option: string | { value: string; label: string }): string => {
    return typeof option === 'string' ? option : option.value;
  };

  const getOptionLabel = (option: string | { value: string; label: string }): string => {
    return typeof option === 'string' ? option : option.label;
  };

  if (!filter.options || filter.options.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-muted)] italic py-2">
        No options available
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {filter.options.map((option) => {
        const optionValue = getOptionValue(option);
        const optionLabel = getOptionLabel(option);
        const isChecked = value.includes(optionValue);

        return (
          <label
            key={optionValue}
            className={cn(
              'flex items-center gap-2 cursor-pointer',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => handleToggle(optionValue)}
              disabled={disabled}
              className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-sm text-[var(--color-text-secondary)]">{optionLabel}</span>
          </label>
        );
      })}
    </div>
  );
};

