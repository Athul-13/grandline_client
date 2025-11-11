/**
 * Filter Configuration Types
 */

/**
 * Filter Type Enum
 */
export type FilterType = 'checkbox' | 'range' | 'number' | 'select';

/**
 * Base Filter Configuration
 */
export interface BaseFilterConfig {
  key: string;
  label: string;
  type: FilterType;
}

/**
 * Checkbox Filter Configuration
 * Multiple selection from options
 */
export interface CheckboxFilterConfig extends BaseFilterConfig {
  type: 'checkbox';
  options: string[] | Array<{ value: string; label: string }>;
}

/**
 * Range Filter Configuration
 * Min/Max number inputs
 */
export interface RangeFilterConfig extends BaseFilterConfig {
  type: 'range';
  min: number;
  max: number;
  step?: number;
  placeholder?: {
    min?: string;
    max?: string;
  };
}

/**
 * Number Filter Configuration
 * Single number input with operator
 */
export interface NumberFilterConfig extends BaseFilterConfig {
  type: 'number';
  min: number;
  max: number;
  operator: 'min' | 'max' | 'exact';
  prefix?: string; // e.g., "$"
  suffix?: string; // e.g., " L/100km"
  step?: number;
  placeholder?: string;
}

/**
 * Select Filter Configuration (optional)
 * Single selection dropdown
 */
export interface SelectFilterConfig extends BaseFilterConfig {
  type: 'select';
  options: string[] | Array<{ value: string; label: string }>;
  placeholder?: string;
}

/**
 * Union type for all filter configurations
 */
export type FilterConfig =
  | CheckboxFilterConfig
  | RangeFilterConfig
  | NumberFilterConfig
  | SelectFilterConfig;

/**
 * Filter Options Response
 * API response structure
 */
export interface FilterOptionsResponse {
  success: boolean;
  filters: FilterConfig[];
}

/**
 * Filter Values
 * Dynamic state structure based on filter config
 */
export interface FilterValues {
  [key: string]:
    | string[] // checkbox: array of selected values
    | { min: string; max: string } // range: min/max object
    | string // number/select: single value
    | undefined;
}

