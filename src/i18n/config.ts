import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr.json';
import en from './locales/en.json';
import kr from './locales/kr.json';
import zh from './locales/zh.json';

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  kr: { translation: kr },
  zh: { translation: zh },
};

// Read ?lang= parameter from URL for hreflang support
const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    if (lang && ['fr', 'en', 'kr', 'zh'].includes(lang)) {
      return lang;
    }
  }
  return 'fr';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
