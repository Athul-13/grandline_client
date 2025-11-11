import React from 'react';
import { CheckboxFilter } from '../components/common/filters/checkbox_filter';
import { RangeFilter } from '../components/common/filters/range_filter';
import { NumberFilter } from '../components/common/filters/number_filter';
import type { FilterConfig, FilterValues } from '../types/fleet/filter';

// Re-export FilterValues type
export type { FilterValues };

/**
 * Get default value for a filter based on its type
 */
export const getDefaultFilterValue = (filter: FilterConfig): string[] | { min: string; max: string } | string => {
  switch (filter.type) {
    case 'checkbox':
      return [];
    case 'range':
      return { min: '', max: '' };
    case 'number':
    case 'select':
      return '';
    default:
      return '';
  }
};

/**
 * Initialize filter values from filter configuration
 */
export const initializeFilterValues = (filters: FilterConfig[]): FilterValues => {
  const values: FilterValues = {};
  filters.forEach((filter) => {
    values[filter.key] = getDefaultFilterValue(filter);
  });
  return values;
};

/**
 * Render filter component based on filter type
 */
export const renderFilterByType = (
  filter: FilterConfig,
  value: string[] | { min: string; max: string } | string | undefined,
  onChange: (value: string[] | { min: string; max: string } | string) => void,
  disabled?: boolean
): React.ReactNode => {
  switch (filter.type) {
    case 'checkbox':
      return (
        <CheckboxFilter
          filter={filter}
          value={Array.isArray(value) ? value : []}
          onChange={onChange as (value: string[]) => void}
          disabled={disabled}
        />
      );
    case 'range':
      return (
        <RangeFilter
          filter={filter}
          value={typeof value === 'object' && value !== null && 'min' in value && 'max' in value 
            ? value 
            : { min: '', max: '' }}
          onChange={onChange as (value: { min: string; max: string }) => void}
          disabled={disabled}
        />
      );
    case 'number':
      return (
        <NumberFilter
          filter={filter}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange as (value: string) => void}
          disabled={disabled}
        />
      );
    case 'select':
      // TODO: Implement SelectFilter if needed
      return (
        <p className="text-sm text-[var(--color-text-muted)] italic py-2">
          Select filter not yet implemented
        </p>
      );
    default:
      return null;
  }
};

/**
 * Check if a filter has an active value
 */
export const isFilterActive = (filter: FilterConfig, value: string[] | { min: string; max: string } | string | undefined): boolean => {
  if (!value) return false;

  switch (filter.type) {
    case 'checkbox':
      return Array.isArray(value) && value.length > 0;
    case 'range':
      if (typeof value === 'object' && value !== null && 'min' in value && 'max' in value) {
        return value.min !== '' || value.max !== '';
      }
      return false;
    case 'number':
    case 'select':
      return typeof value === 'string' && value !== '' && value !== null && value !== undefined;
    default:
      return false;
  }
};

/**
 * Get filter chip value for display
 */
export const getFilterChipValue = (filter: FilterConfig, value: string[] | { min: string; max: string } | string | undefined): string => {
  if (!value) return '';

  switch (filter.type) {
    case 'checkbox':
      if (Array.isArray(value) && value.length > 0) {
        return value.join(', ');
      }
      return '';
    case 'range':
      if (typeof value === 'object' && value !== null && 'min' in value && 'max' in value) {
        const min = value.min || 'Any';
        const max = value.max || 'Any';
        return `${min} - ${max}`;
      }
      return '';
    case 'number':
      if (typeof value === 'string') {
        const numFilter = filter as Extract<FilterConfig, { type: 'number' }>;
        const prefix = numFilter.prefix || '';
        const suffix = numFilter.suffix || '';
        const operator = numFilter.operator === 'min' ? '≥' : 
                        numFilter.operator === 'max' ? '≤' : '=';
        return `${operator} ${prefix}${value}${suffix}`;
      }
      return '';
    case 'select':
      return typeof value === 'string' ? value : String(value);
    default:
      return String(value);
  }
};

/**
 * Clear a specific filter value
 */
export const clearFilterValue = (filter: FilterConfig): string[] | { min: string; max: string } | string => {
  return getDefaultFilterValue(filter);
};

