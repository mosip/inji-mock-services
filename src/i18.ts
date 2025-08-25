import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locals/en.json';
import fr from './locals/fr.json';
import es from './locals/es.json'; 
import hi from './locals/hi.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      hi: { translation: hi }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes
    }
  });

export default i18n;
