import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locals/en.json';
import fr from './locals/fr.json';

const LANGUAGE_STORAGE_KEY = 'appLanguage';
const SUPPORTED_LANGUAGES = ['en', 'fr'] as const;

const isSupportedLanguage = (language: string | null): language is (typeof SUPPORTED_LANGUAGES)[number] => {
  return language !== null && SUPPORTED_LANGUAGES.includes(language as (typeof SUPPORTED_LANGUAGES)[number]);
};

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isSupportedLanguage(savedLanguage) ? savedLanguage : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr }
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes
    }
  });

if (typeof window !== 'undefined') {
  i18n.on('languageChanged', (language) => {
    if (isSupportedLanguage(language)) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  });
}

export default i18n;
