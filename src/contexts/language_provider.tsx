import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '../constants/languages';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

const STORAGE_KEY = 'grandline-language';

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage = 'en',
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get from localStorage first, then use default
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as Language;
      if (stored && ['en', 'es', 'fr', 'de', 'hi', 'ar'].includes(stored)) {
        return stored;
      }
    }
    return defaultLanguage;
  });

  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Load translations when language changes
  useEffect(() => {
    import(`../locales/${language}.json`)
      .then((module) => {
        setTranslations(module.default);
      })
      .catch((error) => {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fallback to English if translation file doesn't exist
        if (language !== 'en') {
          import('../locales/en.json')
            .then((module) => setTranslations(module.default))
            .catch(() => setTranslations({}));
        }
      });
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[key] || key;

    // Replace parameters in translation (e.g., "Hello {{name}}" -> "Hello John")
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(
          new RegExp(`{{${paramKey}}}`, 'g'),
          String(value)
        );
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};


