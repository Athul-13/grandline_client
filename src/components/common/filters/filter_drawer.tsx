import React, { useEffect, useCallback, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { FilterChips } from './filter_chips';

export interface FilterChip {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  selectedFilters?: FilterChip[];
  onClearAll?: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

/**
 * Filter Drawer Component
 * Reusable filter drawer with slide-in/out animations, overlay, and selected filters display
 */
export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  title = 'Filters',
  selectedFilters = [],
  onClearAll,
  children,
  isLoading = false,
  className,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [drawerHeight, setDrawerHeight] = useState<string>('100%');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Handle Escape key
  const handleEscapeKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    },
    [isOpen, onClose, isLoading]
  );

  // Hide scrollbar during filter section transitions
  useEffect(() => {
    if (isOpen) {
      setIsTransitioning(true);
      // FilterSection animation is 200ms, add small buffer
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 250);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isOpen, children, selectedFilters]);

  // Calculate dynamic height based on content
  useEffect(() => {
    if (contentRef.current && isOpen) {
      // Use ResizeObserver to dynamically adjust height
      const resizeObserver = new ResizeObserver(() => {
        if (contentRef.current) {
          const contentHeight = contentRef.current.scrollHeight;
          const viewportHeight = window.innerHeight;
          const navbarHeight = 64; // h-16 = 64px
          const maxAvailableHeight = viewportHeight - navbarHeight;
          
          // Use content height if it's less than available, otherwise use available height
          const calculatedHeight = Math.min(contentHeight + 32, maxAvailableHeight); // +32 for padding
          setDrawerHeight(`${calculatedHeight}px`);
        }
      });

      resizeObserver.observe(contentRef.current);

      // Initial calculation
      const contentHeight = contentRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;
      const navbarHeight = 64;
      const maxAvailableHeight = viewportHeight - navbarHeight;
      const calculatedHeight = Math.min(contentHeight + 32, maxAvailableHeight);
      setDrawerHeight(`${calculatedHeight}px`);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [isOpen, children, selectedFilters]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscapeKey]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && !isLoading) {
        onClose();
      }
    },
    [onClose, isLoading]
  );

  return (
    <>
      {/* Overlay with fade animation - covers entire viewport including navbar */}
      {isOpen && (
        <div
          className={cn(
            'fixed inset-0 bg-black/50 z-[60]',
            'transition-opacity duration-300 ease-out',
            'opacity-100'
          )}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Drawer with slide animation - dynamic height */}
      <div
        ref={drawerRef}
        className={cn(
          'absolute left-0 top-0 w-80 bg-[var(--color-bg-card)] border-r border-[var(--color-border)] z-[70] shadow-xl rounded-r-lg',
          'transition-all duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          !isOpen && 'pointer-events-none',
          // Hide scrollbar during transitions to prevent flicker
          isTransitioning ? 'overflow-hidden [&::-webkit-scrollbar]:hidden' : 'overflow-y-auto',
          className
        )}
        style={{
          height: isOpen ? drawerHeight : '100%',
          maxHeight: 'calc(100vh - 64px)', // Viewport height minus navbar
          // Hide scrollbar visually during transitions (cross-browser)
          scrollbarWidth: isTransitioning ? 'none' : 'auto', // Firefox
          msOverflowStyle: isTransitioning ? 'none' : 'auto', // IE/Edge
        }}
      >
        <div ref={contentRef} className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{title}</h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selected Filters */}
          {selectedFilters.length > 0 && (
            <div className="mb-4 pb-4 border-b border-[var(--color-border)]">
              <FilterChips 
                filters={selectedFilters} 
                onClearAll={onClearAll} 
              />
            </div>
          )}

          {/* Filter Sections */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-[var(--color-text-secondary)]">Loading filters...</p>
            </div>
          ) : (
            <>
              {children || (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-[var(--color-text-secondary)]">No filters available</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

