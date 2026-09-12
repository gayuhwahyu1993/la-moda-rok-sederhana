import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Language, Translations } from './types';
import { translations, getTranslation } from './translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage = 'id',
}) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  const t = useMemo(() => getTranslation(language), [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback to default 'id' if used outside provider
    return {
      language: 'id',
      setLanguage: () => {},
      t: translations.id,
    };
  }
  return context;
}
