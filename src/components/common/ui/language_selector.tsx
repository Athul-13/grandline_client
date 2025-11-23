import { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { useLanguage } from '../../../hooks/use_language';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../../../constants/languages';
import { cn } from '../../../utils/cn';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = getLanguageByCode(language);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode: typeof language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 text-sm font-medium',
          'hover:text-(--color-primary) transition-colors',
          'text-(--color-text-primary)',
          'px-3 py-2 rounded-lg',
          'hover:bg-(--color-bg-secondary)',
          'border border-transparent hover:border-(--color-primary)',
          'transition-all duration-150'
        )}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {currentLanguage && (
          <ReactCountryFlag
            countryCode={currentLanguage.countryCode}
            svg
            style={{
              width: '1.25rem',
              height: '1.25rem',
            }}
            title={currentLanguage.name}
          />
        )}
        <span className="font-semibold">{currentLanguage?.code.toUpperCase()}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute right-0 mt-2 w-56 rounded-lg shadow-lg',
            'bg-(--color-bg-primary) border border-(--color-border)',
            'py-2 z-50',
            'animate-in fade-in-0 zoom-in-95 duration-200'
          )}
          role="menu"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-2.5',
                'hover:bg-(--color-bg-secondary)',
                'transition-colors text-left',
                'text-(--color-text-primary)',
                language === lang.code && 'bg-(--color-bg-secondary)'
              )}
              role="menuitem"
            >
              <div className="flex items-center gap-3">
                <ReactCountryFlag
                  countryCode={lang.countryCode}
                  svg
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                  }}
                  title={lang.name}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-xs text-(--color-text-secondary)">
                    {lang.name}
                  </span>
                </div>
              </div>
              {language === lang.code && (
                <Check className="w-4 h-4 text-(--color-primary)" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

