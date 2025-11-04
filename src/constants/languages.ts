export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'ar';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  countryCode: string; // ISO 3166-1 alpha-2 country code for react-country-flag
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', countryCode: 'US' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', countryCode: 'ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', countryCode: 'FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', countryCode: 'DE' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', countryCode: 'IN' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', countryCode: 'SA' },
];

export const getLanguageByCode = (code: Language): LanguageOption | undefined => {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
};

