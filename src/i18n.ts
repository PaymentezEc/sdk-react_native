import en from './locales/en';
import es from './locales/es';

type SupportedLanguages = 'en' | 'es';
type LocaleData = typeof en;

const translations: Record<SupportedLanguages, LocaleData> = { en, es };

let currentLang: SupportedLanguages = 'en';

export const setLanguage = (lang: SupportedLanguages) => {
  currentLang = lang;
};

export const t = (path: string): string => {
  const keys = path.split('.');
  let result: any = translations[currentLang];
  for (const key of keys) {
    if (result && typeof result === 'object') {
      result = result[key];
    } else {
      return path;
    }
  }
  return result || path;
};
