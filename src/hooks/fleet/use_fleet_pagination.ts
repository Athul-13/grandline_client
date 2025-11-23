import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing pagination across fleet views
 * Handles responsive items per page calculation and pagination state
 */
export const useFleetPagination = () => {
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

  const handlePageChangeCategories = useCallback((page: number) => {
    setCurrentPageCategories(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePageChangeAmenities = useCallback((page: number) => {
    setCurrentPageAmenities(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePageChangeVehicles = useCallback((page: number) => {
    setCurrentPageVehicles(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const resetAllPagination = useCallback(() => {
    setCurrentPageCategories(1);
    setCurrentPageAmenities(1);
    setCurrentPageVehicles(1);
  }, []);

  return {
    // State
    currentPageCategories,
    currentPageAmenities,
    currentPageVehicles,
    itemsPerPage,
    // Setters
    setCurrentPageCategories,
    setCurrentPageAmenities,
    setCurrentPageVehicles,
    // Handlers
    handlePageChangeCategories,
    handlePageChangeAmenities,
    handlePageChangeVehicles,
    resetAllPagination,
  };
};

