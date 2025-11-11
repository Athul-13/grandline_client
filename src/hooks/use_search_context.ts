import { useContext } from 'react';
import { SearchContext, type SearchContextType } from '../contexts/search_provider';

/**
 * Custom hook for search context
 * Must be used within SearchProvider
 */
export const useSearchContext = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};

