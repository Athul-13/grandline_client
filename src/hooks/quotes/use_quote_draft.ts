import { useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { quoteService } from '../../services/api/quote_service';
import type { UpdateQuoteDraftRequest, QuoteResponse } from '../../types/quotes/quote';

/**
 * Debounce utility function
 */
const debounce = <T extends (data: UpdateQuoteDraftRequest) => Promise<void>>(
  func: T,
  wait: number
): ((data: UpdateQuoteDraftRequest) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (data: UpdateQuoteDraftRequest) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(data).catch((error) => {
        console.error('Debounced function error:', error);
      });
    }, wait);
  };
};

/**
 * Quote Draft Hook
 * Handles draft auto-save with debouncing and draft loading
 */
export const useQuoteDraft = (quoteId: string | null) => {
  const [searchParams] = useSearchParams();
  const debouncedSaveRef = useRef<((data: UpdateQuoteDraftRequest) => void) | null>(null);
  const isSavingRef = useRef(false);

  /**
   * Save draft (immediate, no debounce)
   */
  const saveDraft = useCallback(async (data: UpdateQuoteDraftRequest): Promise<void> => {
    if (!quoteId) return;

    try {
      isSavingRef.current = true;
      await quoteService.updateQuoteDraft(quoteId, data);
    } catch (error) {
      console.error('Failed to save draft:', error);
      throw error;
    } finally {
      isSavingRef.current = false;
    }
  }, [quoteId]);

  /**
   * Auto-save draft with debouncing (500ms)
   */
  const autoSaveDraft = useCallback(async (data: UpdateQuoteDraftRequest): Promise<void> => {
    if (!quoteId) return;

    // Create debounced save function if it doesn't exist
    if (!debouncedSaveRef.current) {
      debouncedSaveRef.current = debounce(async (saveData: UpdateQuoteDraftRequest) => {
        try {
          await quoteService.updateQuoteDraft(quoteId, saveData);
        } catch (error) {
          console.error('Failed to auto-save draft:', error);
        }
      }, 500);
    }

    // Call debounced save
    if (debouncedSaveRef.current) {
      debouncedSaveRef.current(data);
    }
  }, [quoteId]);

  /**
   * Load draft from URL parameter
   */
  const loadDraft = useCallback(async (): Promise<QuoteResponse | null> => {
    const draftId = searchParams.get('quoteId');
    if (!draftId) return null;

    try {
      const draft = await quoteService.getQuoteById(draftId);
      return draft;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  }, [searchParams]);

  /**
   * Get quoteId from URL
   */
  const getQuoteIdFromUrl = useCallback((): string | null => {
    return searchParams.get('quoteId');
  }, [searchParams]);

  /**
   * Save draft on unmount (flush any pending debounced saves)
   */
  useEffect(() => {
    return () => {
      // Flush any pending debounced saves on unmount
      if (debouncedSaveRef.current) {
        // Small delay to ensure debounced function executes
        setTimeout(() => {
          debouncedSaveRef.current = null;
        }, 600);
      }
    };
  }, []);

  return {
    saveDraft,
    autoSaveDraft,
    loadDraft,
    getQuoteIdFromUrl,
    isSaving: isSavingRef.current,
  };
};

