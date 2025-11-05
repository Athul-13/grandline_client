import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/theme_provider';
import { LanguageProvider } from './contexts/language_provider';
import { store } from './store/store';
import { getSettings } from './utils/settings';
import './index.css';
import App from './App.tsx';

// Load settings from localStorage
const settings = getSettings();
const defaultTheme = settings?.theme || 'system';
const defaultLanguage = (settings?.language as 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ar') || 'en';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider defaultTheme={defaultTheme} enableSystem>
          <LanguageProvider defaultLanguage={defaultLanguage}>
            <App />
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
