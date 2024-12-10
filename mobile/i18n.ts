import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from './locales/en.json';
import uk from './locales/uk.json';

const resources = {
  en: {translation: en},
  uk: {translation: uk},
};

const getLanguage = () => {
  const locales = RNLocalize.getLocales();
  return locales[0]?.languageCode || 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
