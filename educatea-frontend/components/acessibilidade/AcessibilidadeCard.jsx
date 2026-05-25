"use client";

import { useState, useEffect } from "react";
import {
  Power, Volume2, Search, Type, Link2, Keyboard, ZoomIn, Plus, Minus, 
  Redo2, Undo2, ChevronDown, EyeOff, MousePointer2, AlignLeft, Contrast, 
  Sun, MoveRight, Baseline, ScanLine, Languages, PauseCircleIcon, BookA, 
  Home, Users2, FileText, LogIn, UserPlus2Icon, User2, Compass,
  Newspaper, Brain, ShieldCheck, Cookie // <-- Novos ícones aqui
} from "lucide-react";
import Image from "next/image";

// Importações de Imagens (Mantenha os caminhos do seu projeto)
import TextLogo from "../../public/images/logos/TextLogo.webp";
import FlagBrasil from "../../public/images/languages/BR.webp";
import FlagUS from "../../public/images/languages/US.webp";
import FlagEspanha from "../../public/images/languages/ES.webp";

// IMPORTANTE: Importando o Contexto de Acessibilidade
import { useAcessibilidade } from "@/context/AcessibilidadeContext";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname, useRouter } from "next/navigation";


const languages = [
  { id: "pt-br", label: "Português (BR)", flag: FlagBrasil },
  { id: "en-us", label: "English (US)", flag: FlagUS },
  { id: "es-es", label: "Español (ES)", flag: FlagEspanha },
];

export default function AcessibilidadeCard({ onClose }) {
  const [langOpen, setLangOpen] = useState(false);
  const { lang, switchLanguage, t } = useLanguage();
  const {
    settings,
    toggleSetting,
    setSetting,
    setDaltonismo,
    changeZoom,
    aplicarModelo,
    resetSettings,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useAcessibilidade();


  // 1. Puxe o setSetting do contexto
  const currentLang = languages.find((l) => l.id === lang) || languages[0];

  // 2. Salva qual era o idioma padrão quando o usuário abriu o site
  const [defaultLang] = useState(lang);

  // 3. ADICIONE ESTE EFEITO: Ele observa o histórico e muda a língua automaticamente!
  useEffect(() => {
    // Se o histórico "viajou no tempo" para um idioma salvo, troca a língua do site
    if (settings.idioma && settings.idioma !== lang) {
      switchLanguage(settings.idioma);
    }
    // Se a pessoa clicou em "Desligar" (o histórico volta pra null), reseta pro idioma padrão
    if (settings.idioma === null && lang !== defaultLang) {
      switchLanguage(defaultLang);
    }
  }, [settings.idioma]); // Este efeito só roda quando o histórico do painel muda
  
  // Calcula qual língua mostrar baseado no Contexto Global
  // Inicializando o roteador do Next.js
  const router = useRouter();
  const pathname = usePathname(); // <-- ADICIONE ESTA LINHA AQUI

  // NOVA FUNÇÃO: Faz a navegação e fecha o painel
  const handleNavigation = (path) => {
    router.push(path);
    onClose(); 
  };

  // Consumindo as funções e estados do nosso Contexto
  

  return (
    <div
      className="
        relative w-[450px] max-w-[calc(100vw-3rem)] h-[75dvh] rounded-3xl py-4 px-3 flex flex-col text-white shadow-xl
        overflow-y-auto overflow-x-hidden
        bg-[#EAEAEA]
        z-0
        [&::-webkit-scrollbar]:w-0
      "
    >
      {/* Camada de fundo fixada atrás de tudo */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#143A7B] from-[26%] via-[#EAEAEA] via-[26%] to-[#EAEAEA] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-end">
        <button onClick={onClose}>
          <ChevronDown className="w-6 h-6 text-white hover:text-gray-400 cursor-pointer" />
        </button>
      </div>

      <h2 className="text-center text-lg font-semibold my-5">
        {t('components.accessibility_card.title')}
      </h2>

      {/* Ações Rápidas (Conectadas ao Contexto) */}
      <div className="flex gap-3 mb-4">
        <ActionButton icon={<Undo2 size={16} />} label={t('components.accessibility_card.undo_btn')} onClick={undo} disabled={!canUndo} />
        <ActionButton icon={<Power size={16} />} label={t('components.accessibility_card.power_btn')} onClick={resetSettings} />
        <ActionButton icon={<Redo2 size={16} />} label={t('components.accessibility_card.redo_btn')} onClick={redo} disabled={!canRedo} />
      </div>

      <div className="flex flex-col gap-4">
        {/* --- IDIOMA --- */}
        <Section title={t('components.accessibility_card.section_language')}>
          <p className="text-[10px] text-gray-400 mb-3 px-1 font-bold uppercase tracking-widest">
            {t('components.accessibility_card.language_select')}
          </p>

          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="w-full flex items-center justify-between gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-[#143A7B]/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={currentLang.flag}
                  width={24}
                  height={24}
                  alt={currentLang.label}
                  className="rounded-sm shadow-sm"
                />
                <span className="text-sm font-bold text-gray-700">
                  {currentLang.label}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${langOpen ? "rotate-180" : ""}`}
              />
            </button>

            {langOpen && (
                  <ul className="mt-3 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col gap-1">                {languages.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      // Salva no histórico! O useEffect que criamos acima fará a troca visual na mesma hora.
                      setSetting('idioma', item.id); 
                      setLangOpen(false);      
                    }}
                    className={`
                      flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
                      ${lang === item.id ? 'bg-blue-50' : 'hover:bg-blue-50'}
                    `}
                  >
                    <Image src={item.flag} width={20} height={20} alt={item.label} className="rounded-sm" />
                    <span className="text-xs font-bold text-gray-600">{item.label}</span>
                    
                    {/* Pontinho azul para indicar o idioma atual */}
                    {lang === item.id && (
                      <div className="ml-auto size-2 bg-blue-500 rounded-full" />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        {/* --- OPÇÕES GERAIS --- */}
        <Section title={t('components.accessibility_card.section_general')}>
          <div className="grid grid-cols-3 gap-3">
            {/* Visuais */}
            <Option icon={<Contrast />} label={t('components.accessibility_card.high_contrast')} active={settings.altoContraste} onClick={() => toggleSetting('altoContraste')} t={t} />
            <Option
              icon={<Sun />}
              label={t('components.accessibility_card.dark_mode')}
              active={settings.modoEscuro}
              onClick={() => toggleSetting('modoEscuro')}
              t={t}
            />
            <Option icon={<Baseline />} label={t('components.accessibility_card.text_spacing')} active={settings.espacamentoTexto} onClick={() => toggleSetting('espacamentoTexto')} t={t} />

            {/* Foco e Leitura (Apenas UI por enquanto, adicione a lógica se desejar) */}
            <Option
              icon={<MoveRight />}
              label={t('components.accessibility_card.reading_guide')}
              active={settings.guiaLeitura}
              onClick={() => toggleSetting('guiaLeitura')}
              desktopOnly
              t={t}
            />
            <Option
              icon={<ScanLine />}
              label={t('components.accessibility_card.reading_mask')}
              active={settings.mascaraLeitura}
              onClick={() => toggleSetting('mascaraLeitura')}
              desktopOnly
              t={t}
            />
            {/* <Option icon={<AlignLeft />} label="Texto Alinhado" /> */}

            {/* Navegação e Movimento */}
            <Option icon={<MousePointer2 />} label={t('components.accessibility_card.giant_cursor')} active={settings.cursorGigante} onClick={() => toggleSetting('cursorGigante')} desktopOnly t={t} />
            {/* <Option icon={<PauseCircleIcon />} label="Parar Animações" active={settings.pararAnimacoes} onClick={() => toggleSetting('pararAnimacoes')} /> */}
            {/* <Option icon={<BookA />} label="Dicionário" /> */}

            {/* Outros */}
            <Option icon={<Volume2 />} label={t('components.accessibility_card.text_reader')} active={settings.leitorTexto} onClick={() => toggleSetting('leitorTexto')} t={t} />
            <Option
              icon={<Search />}
              label={t('components.accessibility_card.magnifier')}
              active={settings.lupa}
              onClick={() => toggleSetting('lupa')}
              desktopOnly
              t={t}
            />
            <Option icon={<Type />} label={t('components.accessibility_card.readable_font')} active={settings.fonteLegivel} onClick={() => toggleSetting('fonteLegivel')} t={t} />
            <Option icon={<Link2 />} label={t('components.accessibility_card.highlight_links')} active={settings.destacarLinks} onClick={() => toggleSetting('destacarLinks')} t={t} />
            <Option
              icon={<Keyboard />}
              label={t('components.accessibility_card.keyboard_nav')}
              active={settings.tecladoVirtual}
              onClick={() => toggleSetting('tecladoVirtual')}
              desktopOnly
              t={t}
            />
            {/* Lógica de Zoom */}
            <Option
              icon={<ZoomIn />}
              label={t('components.accessibility_card.text_magnifier')}
              active={settings.zoom > 1}
              onClick={() => { settings.zoom > 1.4 ? changeZoom(-1) : changeZoom(0.1) }}
              t={t}
            />
          </div>
        </Section>

        {/* --- DALTONISMO --- */}
        <Section title={t('components.accessibility_card.section_colorblind')}>
          <p className="text-[10px] text-gray-400 mb-3 px-1 font-bold uppercase tracking-widest">
            {t('components.accessibility_card.colorblind_select')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <ColorCard label={t('components.accessibility_card.color_standard')} gradient="from-red-500 via-green-400 to-blue-500" active={settings.daltonismo === null} onClick={() => setDaltonismo(null)} />
            <ColorCard label={t('components.accessibility_card.protanopia')} gradient="from-red-600 to-green-500" active={settings.daltonismo === 'protanopia'} onClick={() => setDaltonismo('protanopia')} />
            <ColorCard label={t('components.accessibility_card.deuteranopia')} gradient="from-green-600 to-red-500" active={settings.daltonismo === 'deuteranopia'} onClick={() => setDaltonismo('deuteranopia')} />
            <ColorCard label={t('components.accessibility_card.tritanopia')} gradient="from-blue-500 to-yellow-400" active={settings.daltonismo === 'tritanopia'} onClick={() => setDaltonismo('tritanopia')} />
          </div>
        </Section>

        {/* --- FÁCIL NAVEGAÇÃO --- */}
        <Section title={t('components.accessibility_card.section_navigation')}>
          <div className="grid grid-cols-2 gap-3">
            <Option
              icon={<Home size={20} />}
              label={t('components.accessibility_card.nav_home')}
              onClick={() => handleNavigation('/')}
              active={pathname === '/'}
              t={t}
            />
            <Option
              icon={<Users2 size={20} />}
              label={t('components.accessibility_card.nav_community')}
              onClick={() => handleNavigation('/comunidade')}
              active={pathname === '/comunidade'}
              t={t}
            />
            <Option
              icon={<Newspaper size={20} />}
              label={t('components.accessibility_card.nav_news')}
              onClick={() => handleNavigation('/noticias')}
              active={pathname === '/noticias'}
              t={t}
            />
            <Option
              icon={<Brain size={20} />}
              label={t('components.accessibility_card.nav_tea')}
              onClick={() => handleNavigation('/tea')}
              active={pathname === '/tea'}
              t={t}
            />
            <Option
              icon={<FileText size={20} />}
              label={t('components.accessibility_card.nav_terms')}
              onClick={() => handleNavigation('/termos')}
              active={pathname === '/termos'}
              t={t}
            />
            <Option
              icon={<ShieldCheck size={20} />}
              label={t('components.accessibility_card.nav_privacy')}
              onClick={() => handleNavigation('/privacidade')}
              active={pathname === '/privacidade'}
              t={t}
            />
            <Option
              icon={<Cookie size={20} />}
              label={t('components.accessibility_card.nav_cookies')}
              onClick={() => handleNavigation('/cookies')}
              active={pathname === '/cookies'}
              t={t}
            />
            <Option
              icon={<User2 size={20} />}
              label={t('components.accessibility_card.nav_account')}
              onClick={() => handleNavigation('/account')}
              active={pathname === '/account'}
              t={t}
            />
          </div>
        </Section>

        {/* --- MODELOS PRONTOS --- */}
        <Section title={t('components.accessibility_card.section_models')}>
          <Model label={t('components.accessibility_card.model_blind')} onClick={() => aplicarModelo('cega')} t={t} />
          <Model label={t('components.accessibility_card.model_adhd')} onClick={() => aplicarModelo('tdah')} t={t} />
          <Model label={t('components.accessibility_card.model_dyslexia')} onClick={() => aplicarModelo('dislexa')} t={t} />
          <Model label={t('components.accessibility_card.model_elderly')} onClick={() => aplicarModelo('idade')} t={t} />
          <Model label={t('components.accessibility_card.model_parkinson')} t={t} />
        </Section>

        <div className="w-full flex items-center justify-center py-1">
          <Image src={TextLogo} className="w-24" alt="Logo" />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES ATUALIZADOS
// ==========================================

function Section({ title, children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white text-[#454545] rounded-2xl p-4 transition-all duration-300 shadow-sm border border-gray-100">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-semibold text-base">{title}</h3>
        <div className="size-6 bg-[#54536A] text-white flex items-center justify-center rounded-[6px] hover:bg-[#3f3e52] transition-colors">
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[1000px] mt-4 opacity-100" : "max-h-0 opacity-0"}`}>
        {children}
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1 bg-white text-[#143A7B] rounded-full px-3 py-1 text-sm font-medium flex-1 justify-center transition-colors shadow-sm ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function ColorCard({ label, gradient, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg p-2 transition-colors cursor-pointer group border-2 ${
        active ? "border-blue-500 bg-blue-50" : "bg-white border-[#CFCFCF] hover:border-blue-300"
      }`}
    >
      <div className={`h-4 rounded mx-1 my-2 bg-gradient-to-r ${gradient} group-hover:scale-105 transition-transform`} />
      <p className="text-[10px] text-center font-medium">{label}</p>
    </div>
  );
}

function Option({ icon, label, active, onClick, desktopOnly, t }) {
  // Se não houver onClick (ex: opções não finalizadas), ele se comporta como botão normal
  return (
    <button
      onClick={onClick}
      aria-disabled={desktopOnly ? true : undefined}
      className={`relative overflow-hidden cursor-pointer rounded-lg p-2.5 flex text-center justify-center flex-col items-center gap-2 text-[10px] border transition-all min-h-[80px] ${
        desktopOnly ? "pointer-events-none lg:pointer-events-auto" : ""
      } ${
        active
          ? "bg-[#143A7B] text-white border-[#143A7B]"
          : "bg-white border-[#CFCFCF] text-[#1A3879] hover:bg-blue-50 hover:border-blue-400"
      }`}
    >
      <div className={`flex flex-col items-center gap-2 ${desktopOnly ? "opacity-30 lg:opacity-100" : ""}`}>
        {icon}
        <span className="leading-tight">{label}</span>
      </div>
      {desktopOnly && (
        <span className="lg:hidden absolute bottom-0 inset-x-0 bg-gray-700/90 text-white text-[8px] font-bold py-0.5 uppercase tracking-widest text-center">
          {t('components.accessibility_card.desktop_only')}
        </span>
      )}
    </button>
  );
}

function Model({ label, onClick, t }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#EFEFEF] last:border-none">
      <div className="flex items-center gap-2">
        <div className="size-5 rounded-full bg-[#E5E5E5]" />
        <span className="text-xs text-[#454545] font-medium">{label}</span>
      </div>
      
      {/* Alterei o Toggle switch antigo para um botão de "Aplicar" para facilitar a UX com o Contexto */}
      <button
        onClick={onClick}
        className="bg-[#143A7B] text-white text-[9px] px-3 py-1 rounded-full hover:bg-blue-800 transition-colors cursor-pointer"
      >
        {t('components.accessibility_card.model_apply')}
      </button>
    </div>
  );
}