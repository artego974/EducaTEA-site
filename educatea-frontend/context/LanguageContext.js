'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import ptBr from '../locales/pt-br';

const LanguageContext = createContext();

const DEFAULT_LANG = 'pt-br';
const dictionaryCache = { [DEFAULT_LANG]: ptBr };

async function loadDictionary(lang) {
  if (dictionaryCache[lang]) return dictionaryCache[lang];

  let mod;
  if (lang === 'en-us') mod = await import('../locales/en-us');
  else if (lang === 'es-es') mod = await import('../locales/es-es');
  else return ptBr;

  dictionaryCache[lang] = mod.default;
  return mod.default;
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(DEFAULT_LANG);
  const [dict, setDict] = useState(ptBr);

  useEffect(() => {
    const saved = localStorage.getItem('appLanguage');
    if (!saved || saved === DEFAULT_LANG) return;

    loadDictionary(saved).then((d) => {
      setLang(saved);
      setDict(d);
    });
  }, []);

  const switchLanguage = async (newLang) => {
    const d = await loadDictionary(newLang);
    setLang(newLang);
    setDict(d);
    localStorage.setItem('appLanguage', newLang);
  };

  const t = (key) => {
    const keys = key.split('.');
    let current = dict;

    for (let k of keys) {
      if (current?.[k] === undefined) return key;
      current = current[k];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
