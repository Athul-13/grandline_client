import { useState, useEffect } from 'react';
import type { UseFormWatch, FieldValues } from 'react-hook-form';

interface UseUnsavedChangesOptions<T extends FieldValues> {
  watch: UseFormWatch<T>;
  isOpen: boolean;
  mode: 'add' | 'edit';
  originalData?: Partial<T>;
  getCurrentData: () => Partial<T>;
  hasChanges?: (current: Partial<T>, original: Partial<T>) => boolean;
}

/**
 * Custom hook for tracking unsaved changes in forms
 * Works with react-hook-form and supports both add and edit modes
 * 
 * @example
 * const { hasUnsavedChanges, showCloseWarning, setShowCloseWarning } = useUnsavedChanges({
 *   watch,
 *   isOpen,
 *   mode: 'edit',
 *   originalData: vehicle,
 *   getCurrentData: () => watchedValues,
 * });
 */
export const useUnsavedChanges = <T extends FieldValues>({
  watch,
  isOpen,
  mode,
  originalData,
  getCurrentData,
  hasChanges,
}: UseUnsavedChangesOptions<T>) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

  // Watch all form values
  const watchedValues = watch();

  // Track unsaved changes
  useEffect(() => {
    if (!isOpen) {
      setHasUnsavedChanges(false);
      return;
    }

    const currentData = getCurrentData();

    if (mode === 'edit' && originalData) {
      // Edit mode: compare with original data
      if (hasChanges) {
        const changed = hasChanges(currentData, originalData);
        setHasUnsavedChanges(changed);
      } else {
        // Default comparison: check if any field has changed
        const changed = Object.keys(currentData).some((key) => {
          const current = currentData[key];
          const original = originalData[key];
          
          // Handle arrays
          if (Array.isArray(current) && Array.isArray(original)) {
            return JSON.stringify([...current].sort()) !== JSON.stringify([...original].sort());
          }
          
          // Handle objects
          if (typeof current === 'object' && typeof original === 'object' && current !== null && original !== null) {
            return JSON.stringify(current) !== JSON.stringify(original);
          }
          
          return String(current || '') !== String(original || '');
        });
        setHasUnsavedChanges(changed);
      }
    } else {
      // Add mode: check if any field has a value
      const hasAnyValue = Object.values(currentData).some((value) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        if (typeof value === 'string') {
          return value.trim() !== '';
        }
        return value !== null && value !== undefined && value !== '';
      });
      setHasUnsavedChanges(hasAnyValue);
    }
  }, [isOpen, mode, originalData, watchedValues, getCurrentData, hasChanges]);

  return {
    hasUnsavedChanges,
    showCloseWarning,
    setShowCloseWarning,
  };
};

