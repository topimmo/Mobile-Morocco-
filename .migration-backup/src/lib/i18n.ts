import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from '@/locales/fr.json';
import ar from '@/locales/ar.json';

const resources = {
  fr: { translation: fr },
  ar: { translation: ar },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export const changeLanguage = (lang: 'fr' | 'ar') => {
  i18n.changeLanguage(lang);
  localStorage.setItem('language', lang);
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};

export const getCurrentLanguage = () => i18n.language as 'fr' | 'ar';

export default i18n;
