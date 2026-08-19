import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '@/types/hunt';
import { translate, type TranslateFunction } from '@/lib/i18n';
import {
  loadSettings,
  saveApiKey,
  saveDemoMode,
  saveLanguage,
} from '@/lib/storage';

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  hasApiKey: boolean;
  t: TranslateFunction;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = loadSettings();
  const [language, setLanguageState] = useState<Language>(initial.language);
  const [demoMode, setDemoModeState] = useState<boolean>(initial.demoMode);
  const [apiKey, setApiKeyState] = useState<string | null>(initial.apiKey);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    saveLanguage(lang);
  }, []);

  const setDemoMode = useCallback((enabled: boolean) => {
    setDemoModeState(enabled);
    saveDemoMode(enabled);
  }, []);

  const setApiKey = useCallback((key: string | null) => {
    setApiKeyState(key);
    saveApiKey(key);
  }, []);

  const t = useCallback<TranslateFunction>(
    (key, vars) => translate(language, key, vars),
    [language]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      language,
      setLanguage,
      demoMode,
      setDemoMode,
      apiKey,
      setApiKey,
      hasApiKey: apiKey !== null && apiKey.length > 0,
      t,
    }),
    [language, setLanguage, demoMode, setDemoMode, apiKey, setApiKey, t]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
