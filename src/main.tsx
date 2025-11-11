import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './contexts/theme_provider';
import { LanguageProvider } from './contexts/language_provider';
import { store } from './store/store';
import { getSettings } from './utils/settings';
import './index.css';
import App from './App.tsx';
import { queryClient } from './config/query_client.ts';
import { QueryClientProvider } from '@tanstack/react-query';

// Load settings from localStorage
const settings = getSettings();
const defaultTheme = settings?.theme || 'system';
const defaultLanguage = (settings?.language as 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ar') || 'en';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider defaultTheme={defaultTheme} enableSystem>
              <LanguageProvider defaultLanguage={defaultLanguage}>
                <App />
              </LanguageProvider>
            </ThemeProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);