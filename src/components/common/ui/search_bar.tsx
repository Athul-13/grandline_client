import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useSearchContext } from '../../../hooks/use_search_context';
import { useLanguage } from '../../../hooks/use_language';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

/**
 * Reusable Search Bar Component
 * Provides real-time search with debouncing
 * Uses SearchContext to share search state with pages
 */
export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder, 
  className = 'w-96' 
}) => {
  const { searchQuery, setSearchQuery } = useSearchContext();
  const { t } = useLanguage();
  const [localQuery, setLocalQuery] = useState<string>(searchQuery);

  // Debounce search query updates (300ms delay)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [localQuery, setSearchQuery]);

  // Sync local query with context when context changes externally
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by debouncing, but prevent form submission
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={localQuery}
            onChange={handleChange}
            placeholder={placeholder || t('admin.navbar.searchPlaceholder') || 'Search...'}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all duration-200"
          />
        </div>
      </form>
    </div>
  );
};

