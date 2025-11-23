import { useState, useCallback } from 'react';

type ViewMode = 'grid' | 'list';

interface UseFleetViewsProps {
  onViewChange?: () => void;
}

/**
 * Custom hook for managing fleet view states
 * Handles view mode (grid/list) and view type (vehicles/categories/amenities) switching
 */
export const useFleetViews = (props?: UseFleetViewsProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isCategoriesView, setIsCategoriesView] = useState(false);
  const [isAmenitiesView, setIsAmenitiesView] = useState(false);

  const handleToggleCategoriesView = useCallback(() => {
    if (isCategoriesView) {
      // If already selected, deselect it (show vehicles)
      setIsCategoriesView(false);
    } else {
      // If not selected, select it and deselect amenities
      setIsCategoriesView(true);
      setIsAmenitiesView(false);
    }
    // Notify parent of view change (for pagination reset)
    props?.onViewChange?.();
  }, [isCategoriesView, props]);

  const handleToggleAmenitiesView = useCallback(() => {
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
    // Notify parent of view change (for pagination reset)
    props?.onViewChange?.();
  }, [isAmenitiesView, props]);

  const resetViews = useCallback(() => {
    setIsCategoriesView(false);
    setIsAmenitiesView(false);
    setViewMode('grid');
  }, []);

  return {
    // State
    viewMode,
    isCategoriesView,
    isAmenitiesView,
    // Setters
    setViewMode,
    setIsCategoriesView,
    setIsAmenitiesView,
    // Handlers
    handleToggleCategoriesView,
    handleToggleAmenitiesView,
    resetViews,
  };
};

