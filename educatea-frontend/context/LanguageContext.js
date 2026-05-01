'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('pt-br');
  // 1. Novo estado de carregamento
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tenta pegar a língua salva
    const savedLang = localStorage.getItem('appLanguage');
    
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
    
    // 2. Avisa que terminou de carregar a preferência
    setIsLoading(false);
  }, []);

  const switchLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('appLanguage', newLang);
  };

  const t = (key) => {
    const keys = key.split('.');
    let current = translations[lang] || translations['pt-br'];
    
    for (let k of keys) {
      if (current[k] === undefined) return key;
      current = current[k];
    }
    return current;
  };

  return (
    // 3. Passamos o isLoading para quem quiser usar
    <LanguageContext.Provider value={{ lang, switchLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}