import React, { useEffect } from 'react';
import { useVehicleTypes } from '../../hooks/fleet/use_vehicle_types';
import { useVehicleTypeMutations } from '../../hooks/fleet/use_vehicle_type_mutations';
import { useVehicles } from '../../hooks/fleet/use_vehicles';
import { useAmenities } from '../../hooks/fleet/use_amenities';
import { useAmenityMutations } from '../../hooks/fleet/use_amenity_mutations';
import { useFleetPagination } from '../../hooks/fleet/use_fleet_pagination';
import { useFleetFilters } from '../../hooks/fleet/use_fleet_filters';
import { useFleetViews } from '../../hooks/fleet/use_fleet_views';
import { useFleetManagementState } from '../../hooks/fleet/use_fleet_management_state';
import { FleetControlsBar } from '../../components/fleet/management/fleet_controls_bar';
import { FleetViewContent } from '../../components/fleet/management/fleet_view_content';
import { FleetPagination } from '../../components/fleet/management/fleet_pagination';
import { FleetModals } from '../../components/fleet/management/fleet_modals';
import { FilterDrawer } from '../../components/common/filters/filter_drawer';
import { FilterSection } from '../../components/common/filters/filter_section';

export const AdminFleetManagementPage: React.FC = () => {
  // Custom hooks for state management
  const pagination = useFleetPagination();
  const views = useFleetViews({
    onViewChange: () => pagination.resetAllPagination(),
  });
  const state = useFleetManagementState();

  // Filters hook
  const filters = useFleetFilters({
    sortField: state.sortField,
    sortDirection: state.sortDirection,
    isCategoriesView: views.isCategoriesView,
    onPageReset: () => pagination.setCurrentPageVehicles(1),
  });

  // Reset pagination when search query changes
  useEffect(() => {
    pagination.setCurrentPageVehicles(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.filterQueryParams.search]);

  // Vehicle Types with pagination
  const {
    data: vehicleTypesData,
    isLoading: isLoadingVehicleTypes,
  } = useVehicleTypes({
    page: pagination.currentPageCategories,
    limit: pagination.itemsPerPage,
  });

  const vehicleTypes = vehicleTypesData?.data || [];
  const vehicleTypesPagination = vehicleTypesData?.pagination;
  const totalPagesCategories = vehicleTypesPagination?.totalPages || 1;

  const { deleteVehicleType } = useVehicleTypeMutations();

  // Amenities with pagination
  const {
    data: amenitiesData,
    isLoading: isLoadingAmenities,
  } = useAmenities({
    page: pagination.currentPageAmenities,
    limit: pagination.itemsPerPage,
  });

  const amenities = amenitiesData?.data || [];
  const amenitiesPagination = amenitiesData?.pagination;
  const totalPagesAmenities = amenitiesPagination?.totalPages || 1;

  const { deleteAmenity } = useAmenityMutations();

  // Vehicles with pagination and filters
  const {
    data: vehiclesData,
    isLoading: isLoadingVehicles,
  } = useVehicles({
    page: pagination.currentPageVehicles,
    limit: pagination.itemsPerPage,
    ...filters.filterQueryParams,
  });

  const vehicles = vehiclesData?.data || [];
  const vehiclesPagination = vehiclesData?.pagination;
  const totalPagesVehicles = vehiclesPagination?.totalPages || 1;

  // Determine current view
  const currentView = views.isCategoriesView
    ? 'categories'
    : views.isAmenitiesView
      ? 'amenities'
      : 'vehicles';

  // Handlers
  const handleAddCategory = () => {
    state.openVehicleTypeModal();
  };

  const handleAddAmenity = () => {
    state.openAmenityModal();
  };

  const handleAddVehicle = () => {
    state.openVehicleModal();
  };

  const handleEditVehicle = (vehicle: typeof vehicles[0]) => {
    state.openVehicleModal(vehicle);
  };

  const handleDeleteVehicle = (vehicle: typeof vehicles[0]) => {
    // TODO: Implement delete functionality
    console.log('Delete vehicle:', vehicle);
  };

  const handleVehicleSuccess = () => {
    pagination.setCurrentPageVehicles(1);
  };

  const handleEditCategory = (vehicleType: typeof vehicleTypes[0]) => {
    state.openVehicleTypeModal(vehicleType);
  };

  const handleDeleteCategory = (vehicleType: typeof vehicleTypes[0]) => {
    state.openDeleteVehicleTypeModal(vehicleType);
  };

  const handleEditAmenity = (amenity: typeof amenities[0]) => {
    state.openAmenityModal(amenity);
  };

  const handleDeleteAmenity = (amenity: typeof amenities[0]) => {
    state.openDeleteAmenityModal(amenity);
  };

  const handleConfirmDelete = async () => {
    if (state.deletingVehicleType) {
      try {
        await deleteVehicleType.mutateAsync(state.deletingVehicleType.vehicleTypeId);
        state.closeDeleteVehicleTypeModal();
      } catch {
        // Error handled by mutation hook
      }
    }
  };

  const handleConfirmDeleteAmenity = async () => {
    if (state.deletingAmenity) {
      try {
        await deleteAmenity.mutateAsync(state.deletingAmenity.amenityId);
        state.closeDeleteAmenityModal();
      } catch {
        // Error handled by mutation hook
      }
    }
  };

  const handleSortFieldChange = (field: typeof state.sortField) => {
    state.handleSortFieldChange(field);
    pagination.setCurrentPageVehicles(1);
  };

  const handleSortDirectionToggle = () => {
    state.toggleSortDirection();
    pagination.setCurrentPageVehicles(1);
  };

  return (
    <div className="h-full overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] relative">
      {/* Main Content */}
      <div className="h-full flex flex-col">
        <div className="h-full flex flex-col px-4 py-3">
          {/* Controls Bar */}
          <FleetControlsBar
            viewMode={views.viewMode}
            setViewMode={views.setViewMode}
            isCategoriesView={views.isCategoriesView}
            isAmenitiesView={views.isAmenitiesView}
            sortField={state.sortField}
            sortDirection={state.sortDirection}
            onSortFieldChange={handleSortFieldChange}
            onSortDirectionToggle={handleSortDirectionToggle}
            activeFiltersCount={filters.activeFiltersCount}
            onFilterToggle={() => state.setShowFilterSidebar(!state.showFilterSidebar)}
            onToggleCategoriesView={views.handleToggleCategoriesView}
            onToggleAmenitiesView={views.handleToggleAmenitiesView}
            onAddVehicle={handleAddVehicle}
            onAddCategory={handleAddCategory}
            onAddAmenity={handleAddAmenity}
          />

          {/* Vehicles/Categories/Amenities Display */}
          <FleetViewContent
            view={currentView}
            viewMode={views.viewMode}
            vehicles={vehicles}
            isLoadingVehicles={isLoadingVehicles}
            onEditVehicle={handleEditVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            vehicleTypes={vehicleTypes}
            isLoadingVehicleTypes={isLoadingVehicleTypes}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            amenities={amenities}
            isLoadingAmenities={isLoadingAmenities}
            onEditAmenity={handleEditAmenity}
            onDeleteAmenity={handleDeleteAmenity}
          />

          {/* Pagination */}
          {currentView === 'categories' ? (
            <FleetPagination
              view="categories"
              currentPage={pagination.currentPageCategories}
              totalPages={totalPagesCategories}
              onPageChange={pagination.handlePageChangeCategories}
              itemsPerPage={pagination.itemsPerPage}
            />
          ) : currentView === 'amenities' ? (
            <FleetPagination
              view="amenities"
              currentPage={pagination.currentPageAmenities}
              totalPages={totalPagesAmenities}
              onPageChange={pagination.handlePageChangeAmenities}
              itemsPerPage={pagination.itemsPerPage}
            />
          ) : (
            <FleetPagination
              view="vehicles"
              currentPage={pagination.currentPageVehicles}
              totalPages={totalPagesVehicles}
              onPageChange={pagination.handlePageChangeVehicles}
              itemsPerPage={pagination.itemsPerPage}
              filterParams={filters.filterQueryParams}
            />
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={state.showFilterSidebar}
        onClose={() => state.setShowFilterSidebar(false)}
        title="Filters"
        selectedFilters={filters.activeFilters}
        onClearAll={filters.clearAllFilters}
        isLoading={filters.isLoadingFilterOptions}
      >
        {filters.filters.length > 0 ? (
          filters.filters.map((filter, index) => (
            <FilterSection
              key={filter.key}
              title={filter.label}
              isExpanded={filters.expandedSections[filter.key] ?? true}
              onToggle={() => filters.toggleSection(filter.key)}
              showBorder={index < filters.filters.length - 1}
            >
              {filters.renderFilterByType(
                filter,
                filters.filterValues[filter.key],
                (value) => filters.handleFilterChange(filter.key, value),
                views.isCategoriesView
              )}
            </FilterSection>
          ))
        ) : (
          !filters.isLoadingFilterOptions && (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-[var(--color-text-secondary)]">No filters available</p>
            </div>
          )
        )}
      </FilterDrawer>

      {/* Modals */}
      <FleetModals
        showVehicleTypeModal={state.showVehicleTypeModal}
        editingVehicleType={state.editingVehicleType}
        onCloseVehicleTypeModal={state.closeVehicleTypeModal}
        showAmenityModal={state.showAmenityModal}
        editingAmenity={state.editingAmenity}
        onCloseAmenityModal={state.closeAmenityModal}
        showVehicleModal={state.showVehicleModal}
        editingVehicle={state.editingVehicle}
        onCloseVehicleModal={state.closeVehicleModal}
        onVehicleSuccess={handleVehicleSuccess}
        showDeleteModal={state.showDeleteModal}
        deletingVehicleType={state.deletingVehicleType}
        onCloseDeleteModal={state.closeDeleteVehicleTypeModal}
        onConfirmDelete={handleConfirmDelete}
        isDeletingVehicleType={deleteVehicleType.isPending}
        showDeleteAmenityModal={state.showDeleteAmenityModal}
        deletingAmenity={state.deletingAmenity}
        onCloseDeleteAmenityModal={state.closeDeleteAmenityModal}
        onConfirmDeleteAmenity={handleConfirmDeleteAmenity}
        isDeletingAmenity={deleteAmenity.isPending}
      />
    </div>
  );
};
