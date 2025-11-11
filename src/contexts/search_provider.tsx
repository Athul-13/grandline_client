import { createContext, useState, type ReactNode } from 'react';

export interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

/**
 * Search Context Provider
 * Manages global search state for admin pages
 */
export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

