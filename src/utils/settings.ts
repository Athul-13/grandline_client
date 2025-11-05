/**
 * Settings Utility
 * Handles localStorage operations for user settings (language, theme)
 * Uses the same keys as LanguageProvider and ThemeProvider for consistency
 */

const LANGUAGE_KEY = 'grandline-language';
const THEME_KEY = 'theme'; // next-themes uses 'theme' key

export interface UserSettings {
  language: string;
  theme: string;
}

/**
 * Get user settings from localStorage
 * Reads from the same keys used by LanguageProvider and ThemeProvider
 */
export const getSettings = (): UserSettings | null => {
  try {
    const language = localStorage.getItem(LANGUAGE_KEY);
    const theme = localStorage.getItem(THEME_KEY);
    
    if (!language && !theme) {
      return null;
    }
    
    return {
      language: language || 'en',
      theme: theme || 'system',
    };
  } catch (error) {
    console.error('Error retrieving settings:', error);
    return null;
  }
};

/**
 * Save user settings to localStorage
 * Saves to the same keys used by LanguageProvider and ThemeProvider
 */
export const saveSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(LANGUAGE_KEY, settings.language);
    localStorage.setItem(THEME_KEY, settings.theme);
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

/**
 * Get specific setting value
 */
export const getSetting = (key: keyof UserSettings): string | null => {
  try {
    if (key === 'language') {
      return localStorage.getItem(LANGUAGE_KEY);
    }
    if (key === 'theme') {
      return localStorage.getItem(THEME_KEY);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving setting:', error);
    return null;
  }
};

/**
 * Update specific setting
 */
export const updateSetting = (key: keyof UserSettings, value: string): void => {
  try {
    if (key === 'language') {
      localStorage.setItem(LANGUAGE_KEY, value);
    } else if (key === 'theme') {
      localStorage.setItem(THEME_KEY, value);
    }
  } catch (error) {
    console.error('Error updating setting:', error);
  }
};

