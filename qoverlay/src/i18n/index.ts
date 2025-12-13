import { createI18n } from 'vue-i18n';

// 语言环境类型
export type Locale = 'zh' | 'en';

// 支持的语言列表
const supportedLocales: Locale[] = ['zh', 'en'];

// 读取localStorage中的语言偏好
const getStoredLanguage = (): Locale | null => {
  try {
    const stored = localStorage.getItem('prefer-language');
    if (stored && supportedLocales.includes(stored as Locale)) {
      return stored as Locale;
    }
  } catch (error) {
    console.error('Failed to read language from localStorage:', error);
  }
  return null;
};

// 检测浏览器语言
const detectBrowserLanguage = (): Locale => {
  const browserLang = navigator.language || 'zh';
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  return 'en';
};

// 保存语言选择到localStorage
const saveLanguagePreference = (locale: Locale) => {
  try {
    localStorage.setItem('prefer-language', locale);
  } catch (error) {
    console.error('Failed to save language preference:', error);
  }
};

// 确定初始语言
const determineInitialLocale = (): Locale => {
  // 先检查localStorage
  const storedLocale = getStoredLanguage();
  if (storedLocale) {
    return storedLocale;
  }
  // 再检测浏览器语言
  return detectBrowserLanguage();
};

// 创建国际化实例，初始为空
const initialLocale = determineInitialLocale();

const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: initialLocale, // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages: {}, // 初始为空，真正懒加载
  globalInjection: true // 全局注入 $t 函数
});

// 已加载的语言缓存
const loadedLocales: Set<Locale> = new Set();

// 真正的懒加载语言文件
const loadLanguageFile = async (locale: Locale) => {
  try {
    console.log(`Loading language file for ${locale}...`);
    
    // 如果语言已加载，直接切换
    if (!loadedLocales.has(locale)) {
      // 动态导入语言文件
      const messages = await import(`./messages/${locale}.json`);
      // 更新i18n的messages
      i18n.global.setLocaleMessage(locale, messages.default);
      // 标记为已加载
      loadedLocales.add(locale);
      console.log(`Loaded messages for ${locale}`);
    }
    
    // 切换语言
    i18n.global.locale.value = locale;
    console.log(`Set locale to ${locale}`);
    
    // 保存语言选择到localStorage
    saveLanguagePreference(locale);
  } catch (error) {
    console.error(`Failed to load language file for ${locale}:`, error);
  }
};

// 初始化加载默认语言
loadLanguageFile(initialLocale);

export default i18n;
export { loadLanguageFile };
