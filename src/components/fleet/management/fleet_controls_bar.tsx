import React from 'react';
import { Button } from '../../common/ui/button';
import { Grid, List, Plus, LayoutGrid, Filter } from 'lucide-react';
import { cn } from '../../../utils/cn';

type SortField = 'status' | 'vehicleTypeId' | 'year' | 'capacity' | 'vehicleModel' | 'maintenance' | 'fuelConsumption';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

interface FleetControlsBarProps {
  // View state
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isCategoriesView: boolean;
  isAmenitiesView: boolean;
  // Sort state
  sortField: SortField;
  sortDirection: SortDirection;
  onSortFieldChange: (field: SortField) => void;
  onSortDirectionToggle: () => void;
  // Filter state
  activeFiltersCount: number;
  onFilterToggle: () => void;
  // View toggles
  onToggleCategoriesView: () => void;
  onToggleAmenitiesView: () => void;
  // Add handlers
  onAddVehicle: () => void;
  onAddCategory: () => void;
  onAddAmenity: () => void;
}

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'status', label: 'Status' },
  { value: 'vehicleTypeId', label: 'Vehicle Type' },
  { value: 'year', label: 'Year' },
  { value: 'capacity', label: 'Capacity' },
  { value: 'vehicleModel', label: 'Vehicle Model' },
  { value: 'maintenance', label: 'Maintenance Cost' },
  { value: 'fuelConsumption', label: 'Fuel Consumption' },
];

/**
 * Fleet Controls Bar Component
 * Top controls section with filters, sort, view mode, and action buttons
 */
export const FleetControlsBar: React.FC<FleetControlsBarProps> = ({
  viewMode,
  setViewMode,
  isCategoriesView,
  isAmenitiesView,
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionToggle,
  activeFiltersCount,
  onFilterToggle,
  onToggleCategoriesView,
  onToggleAmenitiesView,
  onAddVehicle,
  onAddCategory,
  onAddAmenity,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
      <div className="flex items-center gap-2">
        {/* Filter Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onFilterToggle}
          disabled={isCategoriesView || isAmenitiesView}
          className="flex items-center gap-2"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            {!isCategoriesView && !isAmenitiesView && activeFiltersCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-xs">
                {activeFiltersCount}
              </span>
            )}
          </span>
        </Button>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            disabled={isCategoriesView || isAmenitiesView}
            className={cn(
              'px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
              (isCategoriesView || isAmenitiesView) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={onSortDirectionToggle}
            disabled={isCategoriesView || isAmenitiesView}
            className={cn(
              'px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors',
              (isCategoriesView || isAmenitiesView) && 'opacity-50 cursor-not-allowed'
            )}
            title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 border border-[var(--color-border)] rounded-lg p-1 bg-[var(--color-bg-secondary)]">
          <button
            onClick={() => setViewMode('grid')}
            disabled={isAmenitiesView}
            className={cn(
              'p-2 rounded transition-colors',
              (viewMode === 'grid' || isAmenitiesView)
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]',
              isAmenitiesView && 'cursor-default'
            )}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            disabled={isAmenitiesView}
            className={cn(
              'p-2 rounded transition-colors',
              viewMode === 'list' && !isAmenitiesView
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]',
              isAmenitiesView && 'opacity-50 cursor-not-allowed'
            )}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Add Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={isCategoriesView ? onAddCategory : isAmenitiesView ? onAddAmenity : onAddVehicle}
          className="flex items-center h-10 px-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>
            {isCategoriesView ? 'Add Category' : isAmenitiesView ? 'Add Amenity' : 'Add Vehicle'}
          </span>
        </Button>

        {/* Categories Button */}
        <Button
          variant={isCategoriesView ? 'primary' : 'outline'}
          size="sm"
          onClick={onToggleCategoriesView}
          className="flex items-center h-10 px-4"
        >
          <LayoutGrid className="w-4 h-4 mr-2" />
          <span>Categories</span>
        </Button>

        {/* Amenities Button */}
        <Button
          variant={isAmenitiesView ? 'primary' : 'outline'}
          size="sm"
          onClick={onToggleAmenitiesView}
          className="flex items-center h-10 px-4"
        >
          <LayoutGrid className="w-4 h-4 mr-2" />
          <span>Amenities</span>
        </Button>
      </div>
    </div>
  );
};

