import { useState, useEffect, useMemo } from 'react';
import { useFilterOptions } from './use_filter_options';
import { useSearchContext } from '../use_search_context';
import {
  renderFilterByType,
  initializeFilterValues,
  isFilterActive,
  getFilterChipValue,
  clearFilterValue,
  type FilterValues,
} from '../../utils/filter_utils';
import type { FilterChip } from '../../components/common/filters/filter_drawer';

type SortField = 'status' | 'vehicleTypeId' | 'year' | 'capacity' | 'vehicleModel' | 'maintenance' | 'fuelConsumption';
type SortDirection = 'asc' | 'desc';

interface UseFleetFiltersProps {
  sortField: SortField;
  sortDirection: SortDirection;
  isCategoriesView: boolean;
  onPageReset: () => void;
}

/**
 * Custom hook for managing fleet filters
 * Handles filter state, query params building, and filter operations
 */
export const useFleetFilters = ({
  sortField,
  sortDirection,
  isCategoriesView,
  onPageReset,
}: UseFleetFiltersProps) => {
  // Filter Options from API
  const { data: filterConfig, isLoading: isLoadingFilterOptions } = useFilterOptions();
  const filters = useMemo(() => filterConfig?.filters || [], [filterConfig?.filters]);

  // Search context
  const { searchQuery } = useSearchContext();

  // Dynamic filter values state
  const [filterValues, setFilterValues] = useState<FilterValues>({});

  // Collapsible sections - initialize from filter config
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Build filter query params from filterValues, including search
  const filterQueryParams = useMemo(() => {
    const params: Record<string, unknown> = {};

    // Add search parameter if search query exists
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    if (filters.length > 0) {
      filters.forEach((filter) => {
        const value = filterValues[filter.key];
        if (isFilterActive(filter, value)) {
          if (filter.type === 'checkbox' && Array.isArray(value)) {
            params[filter.key] = value;
          } else if (filter.type === 'range' && typeof value === 'object' && value !== null) {
            const rangeValue = value as { min: string; max: string };
            if (rangeValue.min) params[`${filter.key}_min`] = rangeValue.min;
            if (rangeValue.max) params[`${filter.key}_max`] = rangeValue.max;
          } else if (filter.type === 'number' && typeof value === 'string' && value) {
            params[filter.key] = value;
          } else if (filter.type === 'select' && typeof value === 'string' && value) {
            params[filter.key] = value;
          }
        }
      });
    }

    // Add sort parameters
    if (sortField) {
      params.sortBy = sortField;
      params.sortOrder = sortDirection;
    }

    return params;
  }, [filters, filterValues, sortField, sortDirection, searchQuery]);

  // Initialize filter values when config is loaded
  useEffect(() => {
    if (filters.length > 0 && Object.keys(filterValues).length === 0) {
      const initialValues = initializeFilterValues(filters);
      setFilterValues(initialValues);
    }
  }, [filters, filterValues]);

  // Initialize expanded sections when filters are loaded
  useEffect(() => {
    if (filters.length > 0 && Object.keys(expandedSections).length === 0) {
      const initialExpanded: Record<string, boolean> = {};
      filters.forEach((filter) => {
        initialExpanded[filter.key] = false; // All collapsed by default
      });
      setExpandedSections(initialExpanded);
    }
  }, [filters, expandedSections]);

  // Handle filter value changes
  const handleFilterChange = (filterKey: string, value: string[] | { min: string; max: string } | string) => {
    setFilterValues((prev: FilterValues) => ({
      ...prev,
      [filterKey]: value,
    }));
    // Reset to page 1 when filters change
    onPageReset();
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    if (!filters.length) return 0;
    return filters.filter((filter) => isFilterActive(filter, filterValues[filter.key])).length;
  };

  // Get all active filters for display
  const getAllActiveFilters = (): FilterChip[] => {
    if (!filters.length) return [];

    const activeFilters: FilterChip[] = [];

    filters.forEach((filter) => {
      const value = filterValues[filter.key];
      if (isFilterActive(filter, value)) {
        // For checkbox filters, create a chip for each selected option
        if (filter.type === 'checkbox' && Array.isArray(value) && value.length > 0) {
          value.forEach((optionValue: string) => {
            const option = filter.options.find((opt: string | { value: string; label: string }) => {
              const optValue = typeof opt === 'string' ? opt : opt.value;
              return optValue === optionValue;
            });
            const optionLabel =
              typeof option === 'string' ? option : (option as { value: string; label: string })?.label || optionValue;

            activeFilters.push({
              key: `${filter.key}-${optionValue}`,
              label: filter.label,
              value: optionLabel,
              onRemove: () => {
                const newValue = (value as string[]).filter((v) => v !== optionValue);
                handleFilterChange(filter.key, newValue);
              },
            });
          });
        } else {
          // For other filter types, create a single chip
          activeFilters.push({
            key: filter.key,
            label: filter.label,
            value: getFilterChipValue(filter, value),
            onRemove: () => {
              handleFilterChange(filter.key, clearFilterValue(filter));
            },
          });
        }
      }
    });

    return activeFilters;
  };

  const clearAllFilters = () => {
    if (!filters.length) return;
    const clearedValues: FilterValues = {};
    filters.forEach((filter) => {
      clearedValues[filter.key] = clearFilterValue(filter);
    });
    setFilterValues(clearedValues);
    // Reset to page 1 when filters are cleared
    onPageReset();
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return {
    // Filter config
    filters,
    isLoadingFilterOptions,
    // Filter state
    filterValues,
    expandedSections,
    // Computed values
    filterQueryParams,
    activeFiltersCount: getActiveFiltersCount(),
    activeFilters: getAllActiveFilters(),
    // Handlers
    handleFilterChange,
    clearAllFilters,
    toggleSection,
    renderFilterByType,
  };
};

