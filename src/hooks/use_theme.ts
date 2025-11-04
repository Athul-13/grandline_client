import { useTheme as useNextTheme } from 'next-themes';

/**
 * Custom hook for theme management
 * Provides theme, setTheme, and systemTheme from next-themes
 */
export const useTheme = () => {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();

  // Resolved theme: actual theme being used (system theme if theme is 'system')
  const currentTheme = resolvedTheme || theme;

  return {
    theme,
    setTheme,
    systemTheme,
    resolvedTheme: currentTheme,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light',
  };
};

