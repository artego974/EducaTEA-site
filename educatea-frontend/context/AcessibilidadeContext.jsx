"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AcessibilidadeContext = createContext();

const initialState = {
  altoContraste: false,
  modoEscuro: false,
  espacamentoTexto: false,
  pararAnimacoes: false,
  cursorGigante: false,
  fonteLegivel: false,
  destacarLinks: false,
  daltonismo: null, // 'tritanopia', 'protanopia', 'deuteranopia' ou null
  zoom: 1, // 1 é o padrão (100%)
  leitorTexto: false,
  idioma: null, 
  mascaraLeitura: false, 
  lupa: false,
  guiaLeitura: false,
  tecladoVirtual: false,
};


export function AcessibilidadeProvider({ children }) {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const settings = history[currentIndex];

  // Atualiza as configurações e salva no histórico para podermos usar o Voltar/Avançar
  const updateSettings = (newSettings) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newSettings);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  useEffect(() => {
    const html = document.documentElement;

    if (settings.modoEscuro) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [settings.modoEscuro]);

  // Efeito principal: Adiciona as classes CSS na tag <html> do site
  useEffect(() => {
    const html = document.documentElement;

    html.classList.toggle("a11y-alto-contraste", settings.altoContraste);
    html.classList.toggle("dark", settings.modoEscuro); // Requer darkMode: 'class' no tailwind.config
    html.classList.toggle("a11y-espacamento", settings.espacamentoTexto);
    html.classList.toggle("a11y-parar-animacoes", settings.pararAnimacoes);
    html.classList.toggle("a11y-cursor-gigante", settings.cursorGigante);
    html.classList.toggle("a11y-fonte-legivel", settings.fonteLegivel);
    html.classList.toggle("a11y-destacar-links", settings.destacarLinks);

    // Filtros de Daltonismo
    html.dataset.daltonismo = settings.daltonismo || "";

    // Zoom (Aumenta o tamanho base da fonte da página)
    html.style.fontSize = `${settings.zoom * 100}%`;

  }, [settings]);

  useEffect(() => {
    const handleMouseUp = () => {
      if (!settings.leitorTexto) return;
      const textoSelecionado = window.getSelection().toString();
      if (textoSelecionado) {
        const utterance = new SpeechSynthesisUtterance(textoSelecionado);
        utterance.lang = "pt-BR";
        window.speechSynthesis.speak(utterance);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [settings.leitorTexto]);
  

  // === Funções de Ação ===

  const toggleSetting = (key) => {
    updateSettings({ ...settings, [key]: !settings[key] });
  };

  const setSetting = (key, value) => {
    updateSettings({ ...settings, [key]: value });
  };

  const setDaltonismo = (tipo) => {
    updateSettings({ ...settings, daltonismo: settings.daltonismo === tipo ? null : tipo });
  };

  const changeZoom = (amount) => {
    updateSettings({ ...settings, zoom: Math.max(0.8, Math.min(settings.zoom + amount, 2)) });
  };

  const aplicarModelo = (modelo) => {
    let novasConfig = { ...initialState };
    if (modelo === "cega" || modelo === "leitor") novasConfig.leitorTexto = true;
    if (modelo === "tdah") { novasConfig.pararAnimacoes = true; novasConfig.destacarLinks = true; }
    if (modelo === "dislexa") { novasConfig.fonteLegivel = true; novasConfig.espacamentoTexto = true; }
    if (modelo === "idade") { novasConfig.zoom = 1.2; novasConfig.cursorGigante = true; novasConfig.altoContraste = true; }
    updateSettings(novasConfig);
  };

  // Funções do Cabeçalho (Desligar, Voltar, Avançar)
  const resetSettings = () => updateSettings(initialState);
  const undo = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const redo = () => setCurrentIndex((prev) => Math.min(history.length - 1, prev + 1));

  return (
    <AcessibilidadeContext.Provider
      value={{
        settings,
        toggleSetting,
        setSetting,
        setDaltonismo,
        changeZoom,
        aplicarModelo,
        resetSettings,
        undo,
        redo,
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
      }}
    >
      {children}
    </AcessibilidadeContext.Provider>
  );
}

export const useAcessibilidade = () => useContext(AcessibilidadeContext);