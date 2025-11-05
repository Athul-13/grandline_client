import { useState, useEffect } from 'react';
import { Button } from '../../../components/common/button';
import { useLanguage } from '../../../hooks/use_language';
import { useTheme } from '../../../hooks/use_theme';
import { getSettings, saveSettings } from '../../../utils/settings';
import type { Language } from '../../../constants/languages';
import toast from 'react-hot-toast';

/**
 * Account Settings Component
 * Handles language, theme, and other account preferences
 */
export const AccountSettings: React.FC = () => {
  const { language: contextLanguage, setLanguage: setContextLanguage } = useLanguage();
  const { theme: contextTheme, setTheme: setContextTheme } = useTheme();
  
  const getValidTheme = (themeValue: string | undefined): 'light' | 'dark' | 'system' => {
    if (themeValue && ['light', 'dark', 'system'].includes(themeValue)) {
      return themeValue as 'light' | 'dark' | 'system';
    }
    return 'system';
  };
  
  const [language, setLanguage] = useState<Language>(contextLanguage);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(getValidTheme(contextTheme));
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const settings = getSettings();
    if (settings) {
      const validLanguage = ['en', 'es', 'fr', 'de', 'hi', 'ar'].includes(settings.language)
        ? (settings.language as Language)
        : contextLanguage;
      const validTheme = getValidTheme(settings.theme);
      
      setLanguage(validLanguage);
      setTheme(validTheme);
    } else {
      setLanguage(contextLanguage);
      setTheme(getValidTheme(contextTheme));
    }
  }, [contextLanguage, contextTheme]);

  const handleSave = () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      saveSettings({ language, theme });
      
      // Update context providers
      setContextLanguage(language);
      setContextTheme(theme);
      
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Language Selection */}
      <div className="border-b border-gray-200 pb-4 sm:pb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Language</h2>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Language
          </label>
          <select
            value={language}
            onChange={(e) => {
              const value = e.target.value;
              if (['en', 'es', 'fr', 'de', 'hi', 'ar'].includes(value)) {
                setLanguage(value as Language);
              }
            }}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            disabled={isSaving}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
            <option value="ar">Arabic</option>
          </select>
        </div>
      </div>

      {/* Theme Selection */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Theme</h2>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Theme
          </label>
          <div className="space-y-2 sm:space-y-3">
            <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={(e) => {
                  if (['light', 'dark', 'system'].includes(e.target.value)) {
                    setTheme(e.target.value as 'light' | 'dark' | 'system');
                  }
                }}
                className="text-(--color-primary) focus:ring-(--color-primary)"
                disabled={isSaving}
              />
              <span className="text-sm text-gray-700">Light</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={(e) => {
                  if (['light', 'dark', 'system'].includes(e.target.value)) {
                    setTheme(e.target.value as 'light' | 'dark' | 'system');
                  }
                }}
                className="text-(--color-primary) focus:ring-(--color-primary)"
                disabled={isSaving}
              />
              <span className="text-sm text-gray-700">Dark</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="theme"
                value="system"
                checked={theme === 'system'}
                onChange={(e) => {
                  if (['light', 'dark', 'system'].includes(e.target.value)) {
                    setTheme(e.target.value as 'light' | 'dark' | 'system');
                  }
                }}
                className="text-(--color-primary) focus:ring-(--color-primary)"
                disabled={isSaving}
              />
              <span className="text-sm text-gray-700">System Default</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="w-full sm:w-auto"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};

