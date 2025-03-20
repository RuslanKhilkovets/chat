import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import RNSensitiveInfo from 'react-native-sensitive-info';
import en from './locales/en.json';
import uk from './locales/uk.json';

const resources = {
  en: {translation: en},
  uk: {translation: uk},
};

const getLang = async () => {
  const savedLang = await RNSensitiveInfo.getItem('language', {
    sharedPreferencesName: 'prefs',
    keychainService: 'keychain',
  });

  return savedLang || getDeviceLanguage();
};

const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  return locales[0]?.languageCode || 'en';
};

const initI18n = async () => {
  const language = await getLang();

  i18n.use(initReactI18next).init({
    resources,
    lng: language, // Now lng is properly set
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n(); // Call async initialization

export default i18n;
