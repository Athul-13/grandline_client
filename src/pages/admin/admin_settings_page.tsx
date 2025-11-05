import { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/use_language';
import { useTheme } from '../../hooks/use_theme';
import { getSettings, saveSettings } from '../../utils/settings';
import type { Language } from '../../constants/languages';
import toast from 'react-hot-toast';

export const AdminSettingsPage: React.FC = () => {
  const { language: contextLanguage, setLanguage: setContextLanguage, t } = useLanguage();
  const { theme: contextTheme, setTheme: setContextTheme } = useTheme();
  
  const getValidTheme = (themeValue: string | undefined): 'light' | 'dark' | 'system' => {
    if (themeValue && ['light', 'dark', 'system'].includes(themeValue)) {
      return themeValue as 'light' | 'dark' | 'system';
    }
    return 'system';
  };
  
  const [language, setLanguage] = useState<Language>(contextLanguage);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(getValidTheme(contextTheme));

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

  // Apply language changes immediately
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    saveSettings({ language: newLanguage, theme });
    setContextLanguage(newLanguage);
    toast.success(t('profile.accountSettings.saveSuccess') || 'Language updated successfully');
  };

  // Apply theme changes immediately
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    saveSettings({ language, theme: newTheme });
    setContextTheme(newTheme);
    toast.success(t('profile.accountSettings.saveSuccess') || 'Theme updated successfully');
  };

  return (
    <div className="h-full overflow-y-auto bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {t('admin.sidebar.settings') || 'Settings'}
          </h1>
        </div>
        
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {/* Language Selection */}
            <div className="border-b border-[var(--color-border)] pb-6">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                {t('profile.accountSettings.language') || 'Language'}
              </h2>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  {t('profile.accountSettings.selectLanguage') || 'Select Language'}
                </label>
                <select
                  value={language}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (['en', 'es', 'fr', 'de', 'hi', 'ar'].includes(value)) {
                      handleLanguageChange(value as Language);
                    }
                  }}
                  className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                >
                  <option value="en">{t('profile.accountSettings.languages.english') || 'English'}</option>
                  <option value="es">{t('profile.accountSettings.languages.spanish') || 'Spanish'}</option>
                  <option value="fr">{t('profile.accountSettings.languages.french') || 'French'}</option>
                  <option value="de">{t('profile.accountSettings.languages.german') || 'German'}</option>
                  <option value="hi">{t('profile.accountSettings.languages.hindi') || 'Hindi'}</option>
                  <option value="ar">{t('profile.accountSettings.languages.arabic') || 'Arabic'}</option>
                </select>
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                {t('profile.accountSettings.theme') || 'Theme'}
              </h2>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  {t('profile.accountSettings.selectTheme') || 'Select Theme'}
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg-hover)] bg-[var(--color-bg-secondary)]">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={theme === 'light'}
                      onChange={(e) => {
                        if (['light', 'dark', 'system'].includes(e.target.value)) {
                          handleThemeChange(e.target.value as 'light' | 'dark' | 'system');
                        }
                      }}
                      className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text-primary)]">
                      {t('profile.accountSettings.light') || 'Light'}
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg-hover)] bg-[var(--color-bg-secondary)]">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={theme === 'dark'}
                      onChange={(e) => {
                        if (['light', 'dark', 'system'].includes(e.target.value)) {
                          handleThemeChange(e.target.value as 'light' | 'dark' | 'system');
                        }
                      }}
                      className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text-primary)]">
                      {t('profile.accountSettings.dark') || 'Dark'}
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg-hover)] bg-[var(--color-bg-secondary)]">
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      checked={theme === 'system'}
                      onChange={(e) => {
                        if (['light', 'dark', 'system'].includes(e.target.value)) {
                          handleThemeChange(e.target.value as 'light' | 'dark' | 'system');
                        }
                      }}
                      className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-sm text-[var(--color-text-primary)]">
                      {t('profile.accountSettings.systemDefault') || 'System Default'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

