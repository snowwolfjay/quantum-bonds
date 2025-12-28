import { createI18n } from 'vue-i18n';

const supportedLocales = ['zh', 'en'];

const getStoredLanguage = () => {
  try {
    const stored = uni.getStorageSync('prefer-language');
    if (stored && supportedLocales.includes(stored)) {
      return stored;
    }
  } catch (error) {
    console.error('Failed to read language from storage:', error);
  }
  return null;
};

const detectSystemLanguage = () => {
  const systemInfo = uni.getSystemInfoSync();
  const language = systemInfo.language || 'zh';
  if (language.startsWith('zh')) {
    return 'zh';
  }
  return 'en';
};

const saveLanguagePreference = (locale) => {
  try {
    uni.setStorageSync('prefer-language', locale);
  } catch (error) {
    console.error('Failed to save language preference:', error);
  }
};

const determineInitialLocale = () => {
  const storedLocale = getStoredLanguage();
  if (storedLocale) {
    return storedLocale;
  }
  return detectSystemLanguage();
};

const initialLocale = determineInitialLocale();

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: {},
  globalInjection: true
});

const loadedLocales = new Set();

const loadLanguageFile = async (locale) => {
  try {
    console.log(`Loading language file for ${locale}...`);

    if (!loadedLocales.has(locale)) {
      let messages;
      if (locale === 'zh') {
        messages = await import('../i18n/messages/zh.json');
      } else if (locale === 'en') {
        messages = await import('../i18n/messages/en.json');
      }

      if (messages) {
        i18n.global.setLocaleMessage(locale, messages.default);
        loadedLocales.add(locale);
        console.log(`Loaded messages for ${locale}`);
      }
    }

    i18n.global.locale.value = locale;
    console.log(`Set locale to ${locale}`);

    saveLanguagePreference(locale);
  } catch (error) {
    console.error(`Failed to load language file for ${locale}:`, error);
  }
};

loadLanguageFile(initialLocale);

export default i18n;
export { loadLanguageFile };
