let currentLanguage = 'en';

beforeEach(() => {
  currentLanguage = 'en';
});

const translations: Record<string, Record<string, string>> = {
  en: {
    'navbar.english': 'English',
    'navbar.french': 'French',
  },
  fr: {
    'navbar.english': 'English',
    'navbar.french': 'French',
  },
};

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => translations[currentLanguage]?.[key] ?? key,
    i18n: {
      changeLanguage: jest.fn((lng: string) => {
        currentLanguage = lng;
      }),
      get language() {
        return currentLanguage;
      },
      get resolvedLanguage() {
        return currentLanguage;
      },
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));