import { useContext } from 'react';
import { LanguageContext } from '../contexts/language_provider';
import type { LanguageContextType } from '../contexts/language_provider';

/**
 * Custom hook for language management
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

