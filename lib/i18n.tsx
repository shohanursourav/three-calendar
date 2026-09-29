'use client';

/**
 * Bilingual copy + language state.
 *
 * Bengali is the default language and drives everything the user sees: month names, weekday
 * names, holiday names and even the numerals (০১২৩…). Switching to English keeps the same data
 * but shows Latin script and Latin digits.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Language } from './types';
import { STORAGE_KEYS } from './config';
import { TRANSLATIONS, translate, type TranslationKey } from './translations';

export { TRANSLATIONS, translate };
export type { TranslationKey };

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLang = 'bn',
}: {
  children: ReactNode;
  initialLang?: Language;
}) {
  const [lang, setLangState] = useState<Language>(initialLang);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEYS.language);
    if (stored === 'bn' || stored === 'en') setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEYS.language, next);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang(lang === 'bn' ? 'en' : 'bn'),
      t: (key, params) => translate(lang, key, params),
    }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return context;
}
