import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/common/button';
import { Grid, List, Plus, LayoutGrid, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useVehicleTypes } from '../../hooks/fleet/use_vehicle_types';
import { useVehicleTypeMutations } from '../../hooks/fleet/use_vehicle_type_mutations';
import { VehicleTypeFormModal } from '../../components/fleet/vehicle_type_form_modal';
import { VehicleTypeCard } from '../../components/fleet/vehicle_type_card';
import { VehicleTypeListCard } from '../../components/fleet/vehicle_type_list_card';
import { ConfirmationModal } from '../../components/common/confirmation_modal';
import { Pagination } from '../../components/common/pagination';
import type { VehicleType } from '../../types/fleet/vehicle_type';

// Dummy vehicle data
const dummyVehicles = [
  {
    vehicleId: 'VH001',
    vehicleTypeId: 'SUV',
    capacity: 7,
    maintenance: 500,
    vehicleModel: 'Toyota Highlander',
    year: 2023,
    fuelConsumption: 8.5,
    status: 'Available',
  },
  {
    vehicleId: 'VH002',
    vehicleTypeId: 'Sedan',
    capacity: 5,
    maintenance: 300,
    vehicleModel: 'Honda Accord',
    year: 2022,
    fuelConsumption: 7.2,
    status: 'In Use',
  },
  {
    vehicleId: 'VH003',
    vehicleTypeId: 'Van',
    capacity: 12,
    maintenance: 800,
    vehicleModel: 'Ford Transit',
    year: 2024,
    fuelConsumption: 10.5,
    status: 'Available',
  },
  {
    vehicleId: 'VH004',
    vehicleTypeId: 'SUV',
    capacity: 8,
    maintenance: 600,
    vehicleModel: 'Chevrolet Tahoe',
    year: 2021,
    fuelConsumption: 9.8,
    status: 'Maintenance',
  },
];

type SortField = 'status' | 'vehicleTypeId' | 'year' | 'capacity' | 'vehicleModel' | 'maintenance' | 'fuelConsumption';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export const AdminFleetManagementPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [isCategoriesView, setIsCategoriesView] = useState(false);
  
  // Pagination
  const [currentPageCategories, setCurrentPageCategories] = useState(1);
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
  
  // Modals
  const [showVehicleTypeModal, setShowVehicleTypeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingVehicleType, setEditingVehicleType] = useState<VehicleType | undefined>(undefined);
  const [deletingVehicleType, setDeletingVehicleType] = useState<VehicleType | undefined>(undefined);
  
  // Filter states - multiple selections
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [yearMin, setYearMin] = useState<string>('');
  const [yearMax, setYearMax] = useState<string>('');
  const [capacityMin, setCapacityMin] = useState<string>('');
  const [maintenanceMax, setMaintenanceMax] = useState<string>('');
  const [fuelConsumptionMax, setFuelConsumptionMax] = useState<string>('');

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    status: true,
    type: true,
    year: true,
    capacity: true,
    maintenance: true,
    fuel: true,
  });

  const statusOptions = ['Available', 'In Use', 'Maintenance'];
  const typeOptions = ['SUV', 'Sedan', 'Van'];

  // Vehicle Type Handlers
  const handleToggleCategoriesView = () => {
    setIsCategoriesView(!isCategoriesView);
    // Reset pagination when switching views
    setCurrentPageCategories(1);
  };
  
  const handlePageChangeCategories = (page: number) => {
    setCurrentPageCategories(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCategory = () => {
    setEditingVehicleType(undefined);
    setShowVehicleTypeModal(true);
  };

  const handleEditCategory = (vehicleType: VehicleType) => {
    setEditingVehicleType(vehicleType);
    setShowVehicleTypeModal(true);
  };

  const handleDeleteCategory = (vehicleType: VehicleType) => {
    setDeletingVehicleType(vehicleType);
    setShowDeleteModal(true);
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

  // Toggle checkbox selection
  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleTypeFilter = (type: string) => {
    setTypeFilters(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (statusFilters.length > 0) count++;
    if (typeFilters.length > 0) count++;
    if (yearMin || yearMax) count++;
    if (capacityMin) count++;
    if (maintenanceMax) count++;
    if (fuelConsumptionMax) count++;
    return count;
  };

  // Get all active filters for display
  const getAllActiveFilters = () => {
    const filters: Array<{ key: string; label: string; value: string; onRemove: () => void }> = [];
    
    statusFilters.forEach((status) => {
      filters.push({
        key: `status-${status}`,
        label: 'Status',
        value: status,
        onRemove: () => toggleStatusFilter(status),
      });
    });

    typeFilters.forEach((type) => {
      filters.push({
        key: `type-${type}`,
        label: 'Type',
        value: type,
        onRemove: () => toggleTypeFilter(type),
      });
    });

    if (yearMin || yearMax) {
      filters.push({
        key: 'year',
        label: 'Year',
        value: `${yearMin || 'Any'} - ${yearMax || 'Any'}`,
        onRemove: () => { setYearMin(''); setYearMax(''); },
      });
    }

    if (capacityMin) {
      filters.push({
        key: 'capacity',
        label: 'Capacity',
        value: `≥ ${capacityMin}`,
        onRemove: () => setCapacityMin(''),
      });
    }

    if (maintenanceMax) {
      filters.push({
        key: 'maintenance',
        label: 'Maintenance',
        value: `≤ $${maintenanceMax}`,
        onRemove: () => setMaintenanceMax(''),
      });
    }

    if (fuelConsumptionMax) {
      filters.push({
        key: 'fuel',
        label: 'Fuel',
        value: `≤ ${fuelConsumptionMax} L/100km`,
        onRemove: () => setFuelConsumptionMax(''),
      });
    }

    return filters;
  };

  const clearAllFilters = () => {
    setStatusFilters([]);
    setTypeFilters([]);
    setYearMin('');
    setYearMax('');
    setCapacityMin('');
    setMaintenanceMax('');
    setFuelConsumptionMax('');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
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
                disabled={isCategoriesView}
                className="flex items-center gap-2"
              >
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                  {!isCategoriesView && getActiveFiltersCount() > 0 && (
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
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  disabled={isCategoriesView}
                  className={cn(
                    "px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]",
                    isCategoriesView && "opacity-50 cursor-not-allowed"
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
                  disabled={isCategoriesView}
                  className={cn(
                    "px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors",
                    isCategoriesView && "opacity-50 cursor-not-allowed"
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
                  className={cn(
                    'p-2 rounded transition-colors',
                    viewMode === 'grid'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                  )}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded transition-colors',
                    viewMode === 'list'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                  )}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Add Vehicle/Category Button */}
              <Button
                variant="primary"
                size="sm"
                onClick={isCategoriesView ? handleAddCategory : undefined}
                className="flex items-center h-10 px-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span>{isCategoriesView ? 'Add Category' : 'Add Vehicle'}</span>
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
            </div>
        </div>
        
          {/* Vehicles/Categories Display */}
          <div className={cn(
            'flex-1 overflow-y-auto',
            viewMode === 'grid' 
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
            ) : (
              // Vehicles View
              dummyVehicles.map((vehicle) => (
                <div
                  key={vehicle.vehicleId}
                  className={cn(
                    'bg-[var(--color-bg-card)] rounded-lg shadow-sm p-3 border border-[var(--color-border)]',
                    viewMode === 'list' && 'flex items-center justify-between'
                  )}
                >
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-base">{vehicle.vehicleModel}</h3>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-xs font-medium',
                          vehicle.status === 'Available' && 'bg-green-100 text-green-800',
                          vehicle.status === 'In Use' && 'bg-blue-100 text-blue-800',
                          vehicle.status === 'Maintenance' && 'bg-yellow-100 text-yellow-800'
                        )}
                      >
                        {vehicle.status}
                      </span>
                    </div>
                    <div className="space-y-0.5 text-sm text-[var(--color-text-secondary)]">
                      <p>ID: {vehicle.vehicleId}</p>
                      <p>Type: {vehicle.vehicleTypeId}</p>
                      <p>Year: {vehicle.year}</p>
                      <p>Capacity: {vehicle.capacity} seats</p>
                      <p>Maintenance: ${vehicle.maintenance}</p>
                      <p>Fuel: {vehicle.fuelConsumption} L/100km</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pagination */}
          {isCategoriesView && (
            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <Pagination
                currentPage={currentPageCategories}
                totalPages={totalPagesCategories}
                onPageChange={handlePageChangeCategories}
              />
            </div>
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      {showFilterSidebar && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowFilterSidebar(false)}
          />
          
          {/* Drawer - positioned relative to sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 bg-[var(--color-bg-card)] border-r border-[var(--color-border)] overflow-y-auto z-50 shadow-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Filters</h2>
                <button
                  onClick={() => setShowFilterSidebar(false)}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selected Filters inside Drawer */}
              {getAllActiveFilters().length > 0 && (
                <div className="mb-4 pb-4 border-b border-[var(--color-border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">Active filters:</span>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-[var(--color-primary)] hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getAllActiveFilters().map((filter) => (
                      <div
                        key={filter.key}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-text-primary)] text-xs"
                      >
                        <span className="font-medium">{filter.label}:</span>
                        <span>{filter.value}</span>
                        <button
                          onClick={filter.onRemove}
                          className="ml-0.5 hover:bg-[var(--color-primary)]/20 rounded-full p-0.5 transition-colors"
                          title="Remove filter"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Filter */}
              <div className="mb-4 border-b border-[var(--color-border)] pb-4">
                <button
                  onClick={() => toggleSection('status')}
                  className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-[var(--color-text-primary)]"
                >
                  <span>Status</span>
                  {expandedSections.status ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.status && (
                  <div className="space-y-2">
                    {statusOptions.map((status) => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={statusFilters.includes(status)}
                          onChange={() => toggleStatusFilter(status)}
                          className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <span className="text-sm text-[var(--color-text-secondary)]">{status}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Vehicle Type Filter */}
              <div className="mb-4 border-b border-[var(--color-border)] pb-4">
                <button
                  onClick={() => toggleSection('type')}
                  className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-[var(--color-text-primary)]"
                >
                  <span>Vehicle Type</span>
                  {expandedSections.type ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.type && (
                  <div className="space-y-2">
                    {typeOptions.map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={typeFilters.includes(type)}
                          onChange={() => toggleTypeFilter(type)}
                          className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <span className="text-sm text-[var(--color-text-secondary)]">{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Range Filter */}
              <div className="mb-4 border-b border-[var(--color-border)] pb-4">
                <button
                  onClick={() => toggleSection('year')}
                  className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-[var(--color-text-primary)]"
                >
                  <span>Year</span>
                  {expandedSections.year ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.year && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={yearMin}
                        onChange={(e) => setYearMin(e.target.value)}
                        placeholder="Min"
                        className="flex-1 px-2 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                      <input
                        type="number"
                        value={yearMax}
                        onChange={(e) => setYearMax(e.target.value)}
                        placeholder="Max"
                        className="flex-1 px-2 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Capacity Filter */}
              <div className="mb-4 border-b border-[var(--color-border)] pb-4">
                <button
                  onClick={() => toggleSection('capacity')}
                  className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-[var(--color-text-primary)]"
                >
                  <span>Capacity</span>
                  {expandedSections.capacity ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.capacity && (
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={capacityMin}
                      onChange={(e) => setCapacityMin(e.target.value)}
                      placeholder="Minimum capacity"
                      className="w-full px-2 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                )}
              </div>

              {/* Maintenance Filter */}
              <div className="mb-4 border-b border-[var(--color-border)] pb-4">
                <button
                  onClick={() => toggleSection('maintenance')}
                  className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-[var(--color-text-primary)]"
                >
                  <span>Maintenance Cost</span>
                  {expandedSections.maintenance ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.maintenance && (
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={maintenanceMax}
                      onChange={(e) => setMaintenanceMax(e.target.value)}
                      placeholder="Maximum cost"
                      className="w-full px-2 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                )}
              </div>

              {/* Fuel Consumption Filter */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('fuel')}
                  className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-[var(--color-text-primary)]"
                >
                  <span>Fuel Consumption</span>
                  {expandedSections.fuel ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedSections.fuel && (
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={fuelConsumptionMax}
                      onChange={(e) => setFuelConsumptionMax(e.target.value)}
                      placeholder="Maximum L/100km"
                      step="0.1"
                      className="w-full px-2 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

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

      {/* Delete Confirmation Modal */}
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
    </div>
  );
};

