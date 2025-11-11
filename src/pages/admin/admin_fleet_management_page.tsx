import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '../../components/common/button';
import { Grid, List, Plus, LayoutGrid, Filter } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useVehicleTypes } from '../../hooks/fleet/use_vehicle_types';
import { useVehicleTypeMutations } from '../../hooks/fleet/use_vehicle_type_mutations';
import { useFilterOptions } from '../../hooks/fleet/use_filter_options';
import { useVehicles } from '../../hooks/fleet/use_vehicles';
import { useAmenities } from '../../hooks/fleet/use_amenities';
import { useAmenityMutations } from '../../hooks/fleet/use_amenity_mutations';
import { useSearchContext } from '../../hooks/use_search_context';
import { VehicleTypeFormModal } from '../../components/fleet/vehicle_type_form_modal';
import { AmenityFormModal } from '../../components/fleet/amenity_form_modal';
import { VehicleFormModal } from '../../components/fleet/vehicle_form_modal';
import { VehicleTypeCard } from '../../components/fleet/vehicle_type_card';
import { VehicleTypeListCard } from '../../components/fleet/vehicle_type_list_card';
import { AmenityCard } from '../../components/fleet/amenity_card';
import { VehicleCard } from '../../components/fleet/vehicle_card';
import { VehicleListCard } from '../../components/fleet/vehicle_list_card';
import { ConfirmationModal } from '../../components/common/confirmation_modal';
import { Pagination } from '../../components/common/pagination';
import { FilterDrawer, type FilterChip } from '../../components/common/filter_drawer';
import { FilterSection } from '../../components/common/filter_section';
import { renderFilterByType, initializeFilterValues, isFilterActive, getFilterChipValue, clearFilterValue, type FilterValues } from '../../utils/filter_utils';
import type { VehicleType } from '../../types/fleet/vehicle_type';
import type { Vehicle } from '../../types/fleet/vehicle';
import type { Amenity } from '../../types/fleet/amenity';

type SortField = 'status' | 'vehicleTypeId' | 'year' | 'capacity' | 'vehicleModel' | 'maintenance' | 'fuelConsumption';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export const AdminFleetManagementPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [isCategoriesView, setIsCategoriesView] = useState(false);
  const [isAmenitiesView, setIsAmenitiesView] = useState(false);
  
  // Pagination
  const [currentPageCategories, setCurrentPageCategories] = useState(1);
  const [currentPageAmenities, setCurrentPageAmenities] = useState(1);
  const [currentPageVehicles, setCurrentPageVehicles] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // Calculate items per page based on screen size and breakpoints
  const calculateItemsPerPage = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Determine columns based on Tailwind breakpoints (matching grid classes)
    let columns = 1;
    if (width >= 1536) columns = 5; // 2xl: grid-cols-5
    else if (width >= 1280) columns = 4; // xl: grid-cols-4
    else if (width >= 1024) columns = 3; // lg: grid-cols-3
    else if (width >= 640) columns = 2; // sm: grid-cols-2
    
    // Estimate card height: ~200px (card) + 12px (gap) = 212px per row
    const cardHeightWithGap = 212;
    
    // Calculate available height: viewport - header - controls - pagination - padding
    // Approximate: header (~60px) + controls (~50px) + pagination (~60px) + padding (~40px) = ~210px
    const reservedHeight = 210;
    const availableHeight = height - reservedHeight;
    
    // Calculate visible rows
    const rows = Math.max(1, Math.floor(availableHeight / cardHeightWithGap));
    
    // Calculate total items per page
    const calculatedItems = columns * rows;
    
    // Ensure minimum of 10 and maximum of 50 items per page
    return Math.max(10, Math.min(50, calculatedItems));
  }, []);
  
  // Initialize items per page on mount
  useEffect(() => {
    const initialItemsPerPage = calculateItemsPerPage();
    setItemsPerPage(initialItemsPerPage);
  }, [calculateItemsPerPage]);
  
  // Handle window resize with debouncing
  useEffect(() => {
    let timeoutId: number;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newItemsPerPage = calculateItemsPerPage();
        
        // Only update if change is significant (more than 2 items difference)
        if (Math.abs(newItemsPerPage - itemsPerPage) > 2) {
          setItemsPerPage(newItemsPerPage);
          // Reset to page 1 when items per page changes significantly
          setCurrentPageCategories(1);
          setCurrentPageAmenities(1);
          setCurrentPageVehicles(1);
        }
      }, 300); // 300ms debounce
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [itemsPerPage, calculateItemsPerPage]);
  
  // Vehicle Types with pagination
  const { 
    data: vehicleTypesData, 
    isLoading: isLoadingVehicleTypes 
  } = useVehicleTypes({
    page: currentPageCategories,
    limit: itemsPerPage,
  });
  
  const vehicleTypes = vehicleTypesData?.data || [];
  const pagination = vehicleTypesData?.pagination;
  const totalPagesCategories = pagination?.totalPages || 1;
  
  const { deleteVehicleType } = useVehicleTypeMutations();
  
  // Amenities with pagination
  const { 
    data: amenitiesData, 
    isLoading: isLoadingAmenities 
  } = useAmenities({
    page: currentPageAmenities,
    limit: itemsPerPage,
  });
  
  const amenities = amenitiesData?.data || [];
  const amenitiesPagination = amenitiesData?.pagination;
  const totalPagesAmenities = amenitiesPagination?.totalPages || 1;
  
  const { deleteAmenity } = useAmenityMutations();
  
  // Modals
  const [showVehicleTypeModal, setShowVehicleTypeModal] = useState(false);
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAmenityModal, setShowDeleteAmenityModal] = useState(false);
  const [editingVehicleType, setEditingVehicleType] = useState<VehicleType | undefined>(undefined);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | undefined>(undefined);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>(undefined);
  const [deletingVehicleType, setDeletingVehicleType] = useState<VehicleType | undefined>(undefined);
  const [deletingAmenity, setDeletingAmenity] = useState<Amenity | undefined>(undefined);
  
  // Search context
  const { searchQuery } = useSearchContext();

  // Filter Options from API
  const { data: filterConfig, isLoading: isLoadingFilterOptions } = useFilterOptions();
  const filters = useMemo(() => filterConfig?.filters || [], [filterConfig?.filters]);

  // Dynamic filter values state
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  
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
  
  // Vehicles with pagination and filters
  const { 
    data: vehiclesData, 
    isLoading: isLoadingVehicles 
  } = useVehicles({
    page: currentPageVehicles,
    limit: itemsPerPage,
    ...filterQueryParams,
  });
  
  const vehicles = vehiclesData?.data || [];
  const vehiclesPagination = vehiclesData?.pagination;
  const totalPagesVehicles = vehiclesPagination?.totalPages || 1;

  // Reset pagination to page 1 when search query changes
  useEffect(() => {
    setCurrentPageVehicles(1);
  }, [searchQuery]);

  // Initialize filter values when config is loaded
  useEffect(() => {
    if (filters.length > 0 && Object.keys(filterValues).length === 0) {
      const initialValues = initializeFilterValues(filters);
      setFilterValues(initialValues);
    }
  }, [filters, filterValues]);

  // Collapsible sections - initialize from filter config
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
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

  // View Toggle Handlers
  const handleToggleCategoriesView = () => {
    if (isCategoriesView) {
      // If already selected, deselect it (show vehicles)
      setIsCategoriesView(false);
    } else {
      // If not selected, select it and deselect amenities
      setIsCategoriesView(true);
      setIsAmenitiesView(false);
    }
    // Reset pagination when switching views
    setCurrentPageCategories(1);
    setCurrentPageAmenities(1);
    setCurrentPageVehicles(1);
  };
  
  const handleToggleAmenitiesView = () => {
    if (isAmenitiesView) {
      // If already selected, deselect it (show vehicles)
      setIsAmenitiesView(false);
    } else {
      // If not selected, select it and deselect categories
      setIsAmenitiesView(true);
      setIsCategoriesView(false);
      // Force grid view for amenities
      setViewMode('grid');
    }
    // Reset pagination when switching views
    setCurrentPageCategories(1);
    setCurrentPageAmenities(1);
    setCurrentPageVehicles(1);
  };
  
  const handlePageChangeCategories = (page: number) => {
    setCurrentPageCategories(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePageChangeAmenities = (page: number) => {
    setCurrentPageAmenities(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePageChangeVehicles = (page: number) => {
    setCurrentPageVehicles(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCategory = () => {
    setEditingVehicleType(undefined);
    setShowVehicleTypeModal(true);
  };
  
  const handleAddAmenity = () => {
    setEditingAmenity(undefined);
    setShowAmenityModal(true);
  };
  
  const handleAddVehicle = () => {
    setEditingVehicle(undefined);
    setShowVehicleModal(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowVehicleModal(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    // TODO: Implement delete functionality
    console.log('Delete vehicle:', vehicle);
  };

  const handleVehicleSuccess = () => {
    // Reset to page 1 and refresh vehicles list
    setCurrentPageVehicles(1);
  };

  const handleEditCategory = (vehicleType: VehicleType) => {
    setEditingVehicleType(vehicleType);
    setShowVehicleTypeModal(true);
  };
  
  const handleDeleteCategory = (vehicleType: VehicleType) => {
    setDeletingVehicleType(vehicleType);
    setShowDeleteModal(true);
  };
  
  const handleEditAmenity = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setShowAmenityModal(true);
  };
  
  const handleDeleteAmenity = (amenity: Amenity) => {
    setDeletingAmenity(amenity);
    setShowDeleteAmenityModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingVehicleType) {
      try {
        await deleteVehicleType.mutateAsync(deletingVehicleType.vehicleTypeId);
        setShowDeleteModal(false);
        setDeletingVehicleType(undefined);
      } catch {
        // Error handled by mutation hook
      }
    }
  };
  
  const handleConfirmDeleteAmenity = async () => {
    if (deletingAmenity) {
      try {
        await deleteAmenity.mutateAsync(deletingAmenity.amenityId);
        setShowDeleteAmenityModal(false);
        setDeletingAmenity(undefined);
      } catch {
        // Error handled by mutation hook
      }
    }
  };

  // Handle filter value changes
  const handleFilterChange = (filterKey: string, value: string[] | { min: string; max: string } | string) => {
    setFilterValues((prev: FilterValues) => ({
      ...prev,
      [filterKey]: value,
    }));
    // Reset to page 1 when filters change
    setCurrentPageVehicles(1);
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    if (!filters.length) return 0;
    return filters.filter(filter => isFilterActive(filter, filterValues[filter.key])).length;
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
            const optionLabel = typeof option === 'string' ? option : (option as { value: string; label: string })?.label || optionValue;
            
            activeFilters.push({
              key: `${filter.key}-${optionValue}`,
              label: filter.label,
              value: optionLabel,
              onRemove: () => {
                const newValue = (value as string[]).filter(v => v !== optionValue);
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
    setCurrentPageVehicles(1);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    // Reset to page 1 when sort direction changes
    setCurrentPageVehicles(1);
  };

  // Handle sort field changes
  const handleSortFieldChange = (field: SortField) => {
    setSortField(field);
    // Reset to page 1 when sort field changes
    setCurrentPageVehicles(1);
  };

  const sortOptions: { value: SortField; label: string }[] = [
    { value: 'status', label: 'Status' },
    { value: 'vehicleTypeId', label: 'Vehicle Type' },
    { value: 'year', label: 'Year' },
    { value: 'capacity', label: 'Capacity' },
    { value: 'vehicleModel', label: 'Vehicle Model' },
    { value: 'maintenance', label: 'Maintenance Cost' },
    { value: 'fuelConsumption', label: 'Fuel Consumption' },
  ];


  return (
    <div className="h-full overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] relative">
      {/* Main Content */}
      <div className="h-full flex flex-col">
        <div className="h-full flex flex-col px-4 py-3">
          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-2">
              {/* Filter Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilterSidebar(!showFilterSidebar)}
                disabled={isCategoriesView || isAmenitiesView}
                className="flex items-center gap-2"
              >
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                  {!isCategoriesView && !isAmenitiesView && getActiveFiltersCount() > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-xs">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </span>
              </Button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={sortField}
                  onChange={(e) => handleSortFieldChange(e.target.value as SortField)}
                  disabled={isCategoriesView || isAmenitiesView}
                  className={cn(
                    "px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]",
                    (isCategoriesView || isAmenitiesView) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={toggleSortDirection}
                  disabled={isCategoriesView || isAmenitiesView}
                  className={cn(
                    "px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors",
                    (isCategoriesView || isAmenitiesView) && "opacity-50 cursor-not-allowed"
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
                onClick={
                  isCategoriesView 
                    ? handleAddCategory 
                    : isAmenitiesView 
                    ? handleAddAmenity 
                    : handleAddVehicle
                }
                className="flex items-center h-10 px-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span>
                  {isCategoriesView 
                    ? 'Add Category' 
                    : isAmenitiesView 
                    ? 'Add Amenity' 
                    : 'Add Vehicle'}
                </span>
              </Button>

              {/* Categories Button */}
              <Button
                variant={isCategoriesView ? "primary" : "outline"}
                size="sm"
                onClick={handleToggleCategoriesView}
                className="flex items-center h-10 px-4"
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                <span>Categories</span>
              </Button>

              {/* Amenities Button */}
              <Button
                variant={isAmenitiesView ? "primary" : "outline"}
                size="sm"
                onClick={handleToggleAmenitiesView}
                className="flex items-center h-10 px-4"
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                <span>Amenities</span>
              </Button>
            </div>
        </div>
        
          {/* Vehicles/Categories/Amenities Display */}
          <div className={cn(
            'flex-1 overflow-y-auto',
            (viewMode === 'grid' || isAmenitiesView) 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 items-start' 
              : 'space-y-2'
          )}>
            {isCategoriesView ? (
              // Categories View
              isLoadingVehicleTypes ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <p className="text-[var(--color-text-secondary)]">Loading categories...</p>
                </div>
              ) : vehicleTypes.length === 0 ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <p className="text-[var(--color-text-secondary)]">No categories yet.</p>
                </div>
              ) : (
                <>
                  {vehicleTypes.map((vehicleType) =>
                    viewMode === 'grid' ? (
                      <VehicleTypeCard
                        key={vehicleType.vehicleTypeId}
                        vehicleType={vehicleType}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                      />
                    ) : (
                      <VehicleTypeListCard
                        key={vehicleType.vehicleTypeId}
                        vehicleType={vehicleType}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                      />
                    )
                  )}
                </>
              )
            ) : isAmenitiesView ? (
              // Amenities View (grid only)
              isLoadingAmenities ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <p className="text-[var(--color-text-secondary)]">Loading amenities...</p>
                </div>
              ) : amenities.length === 0 ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <p className="text-[var(--color-text-secondary)]">No amenities yet.</p>
                </div>
              ) : (
                amenities.map((amenity) => (
                  <AmenityCard
                    key={amenity.amenityId}
                    amenity={amenity}
                    onEdit={handleEditAmenity}
                    onDelete={handleDeleteAmenity}
                  />
                ))
              )
            ) : (
              // Vehicles View
              isLoadingVehicles ? (
                <div className={cn(
                  viewMode === 'grid' ? 'col-span-full' : '',
                  'flex items-center justify-center py-12'
                )}>
                  <p className="text-[var(--color-text-secondary)]">Loading vehicles...</p>
                </div>
              ) : vehicles.length === 0 ? (
                <div className={cn(
                  viewMode === 'grid' ? 'col-span-full' : '',
                  'flex items-center justify-center py-12'
                )}>
                  <p className="text-[var(--color-text-secondary)]">No vehicles found.</p>
                </div>
              ) : (
                vehicles.map((vehicle) =>
                  viewMode === 'grid' ? (
                    <VehicleCard
                      key={vehicle.vehicleId}
                      vehicle={vehicle}
                      onEdit={handleEditVehicle}
                      onDelete={handleDeleteVehicle}
                    />
                  ) : (
                    <VehicleListCard
                      key={vehicle.vehicleId}
                      vehicle={vehicle}
                      onEdit={handleEditVehicle}
                      onDelete={handleDeleteVehicle}
                    />
                  )
                )
              )
            )}
          </div>
          
          {/* Pagination */}
          {isCategoriesView ? (
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <Pagination
                currentPage={currentPageCategories}
                totalPages={totalPagesCategories}
                onPageChange={handlePageChangeCategories}
              />
            </div>
          ) : isAmenitiesView ? (
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <Pagination
                currentPage={currentPageAmenities}
                totalPages={totalPagesAmenities}
                onPageChange={handlePageChangeAmenities}
              />
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <Pagination
                currentPage={currentPageVehicles}
                totalPages={totalPagesVehicles}
                onPageChange={handlePageChangeVehicles}
              />
            </div>
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={showFilterSidebar}
        onClose={() => setShowFilterSidebar(false)}
        title="Filters"
        selectedFilters={getAllActiveFilters()}
        onClearAll={clearAllFilters}
        isLoading={isLoadingFilterOptions}
      >
        {filters.length > 0 ? (
          filters.map((filter, index) => (
            <FilterSection
              key={filter.key}
              title={filter.label}
              isExpanded={expandedSections[filter.key] ?? true}
              onToggle={() => toggleSection(filter.key)}
              showBorder={index < filters.length - 1}
              
            >
              {renderFilterByType(
                filter,
                filterValues[filter.key],
                (value) => handleFilterChange(filter.key, value),
                isCategoriesView
              )}
            </FilterSection>
          ))
        ) : (
          !isLoadingFilterOptions && (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-[var(--color-text-secondary)]">No filters available</p>
            </div>
          )
        )}
      </FilterDrawer>

      {/* Vehicle Type Form Modal */}
      <VehicleTypeFormModal
        isOpen={showVehicleTypeModal}
        onClose={() => {
          setShowVehicleTypeModal(false);
          setEditingVehicleType(undefined);
        }}
        mode={editingVehicleType ? 'edit' : 'add'}
        vehicleType={editingVehicleType}
      />

      {/* Amenity Form Modal */}
      <AmenityFormModal
        isOpen={showAmenityModal}
        onClose={() => {
          setShowAmenityModal(false);
          setEditingAmenity(undefined);
        }}
        mode={editingAmenity ? 'edit' : 'add'}
        amenity={editingAmenity}
      />

      {/* Vehicle Form Modal */}
      <VehicleFormModal
        isOpen={showVehicleModal}
        onClose={() => {
          setShowVehicleModal(false);
          setEditingVehicle(undefined);
        }}
        mode={editingVehicle ? 'edit' : 'add'}
        vehicle={editingVehicle}
        onSuccess={handleVehicleSuccess}
      />

      {/* Delete Category Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingVehicleType(undefined);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingVehicleType?.name}"?`}
        warning={
          deletingVehicleType && deletingVehicleType.vehicleCount > 0
            ? `This category has ${deletingVehicleType.vehicleCount} vehicle(s). Deleting it may affect those vehicles.`
            : undefined
        }
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteVehicleType.isPending}
        variant="danger"
      />

      {/* Delete Amenity Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteAmenityModal}
        onClose={() => {
          setShowDeleteAmenityModal(false);
          setDeletingAmenity(undefined);
        }}
        onConfirm={handleConfirmDeleteAmenity}
        title="Delete Amenity"
        message={`Are you sure you want to delete "${deletingAmenity?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteAmenity.isPending}
        variant="danger"
      />
    </div>
  );
};

