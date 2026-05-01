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
import FlagPortugal from "../../public/images/languages/Portugal.webp";
import FlagAngola from "../../public/images/languages/Angola.webp";
import FlagUS from "../../public/images/languages/US.webp";
import FlagEspanha from "../../public/images/languages/ES.webp";
import FlagLatAm from "../../public/images/languages/LatAm.webp";

// IMPORTANTE: Importando o Contexto de Acessibilidade
import { useAcessibilidade } from "@/context/AcessibilidadeContext";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname, useRouter } from "next/navigation";


const languages = [
  { id: "pt-br", label: "Português (Brasil)", flag: FlagBrasil },
  { id: "en-us", label: "English (US)", flag: FlagUS },
  { id: "es-es", label: "Español", flag: FlagEspanha },
];

export default function AcessibilidadeCard({ onClose }) {
  const [langOpen, setLangOpen] = useState(false);
  const { lang, switchLanguage } = useLanguage();
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
        relative w-[450px] h-[75dvh] rounded-3xl py-4 px-3 flex flex-col text-white shadow-xl
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
        Painel de Acessibilidade
      </h2>

      {/* Ações Rápidas (Conectadas ao Contexto) */}
      <div className="flex gap-3 mb-4">
        <ActionButton icon={<Undo2 size={16} />} label="Voltar" onClick={undo} disabled={!canUndo} />
        <ActionButton icon={<Power size={16} />} label="Desligar" onClick={resetSettings} />
        <ActionButton icon={<Redo2 size={16} />} label="Avançar" onClick={redo} disabled={!canRedo} />
      </div>

      <div className="flex flex-col gap-4">
        {/* --- IDIOMA --- */}
        <Section title="Idioma">
          <p className="text-[10px] text-gray-400 mb-3 px-1 font-bold uppercase tracking-widest">
            Selecione sua preferência
          </p>

          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="w-full flex items-center justify-between gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-[#143A7B]/20 transition-all"
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
        <Section title="Opções Gerais">
          <div className="grid grid-cols-3 gap-3">
            {/* Visuais */}
            <Option icon={<Contrast />} label="Alto Contraste" active={settings.altoContraste} onClick={() => toggleSetting('altoContraste')} />
            <Option 
              icon={<Sun />} 
              label="Modo Escuro" 
              active={settings.modoEscuro} 
              onClick={() => toggleSetting('modoEscuro')} 
            />
            <Option icon={<Baseline />} label="Espaçamento de Texto" active={settings.espacamentoTexto} onClick={() => toggleSetting('espacamentoTexto')} />

            {/* Foco e Leitura (Apenas UI por enquanto, adicione a lógica se desejar) */}
            <Option 
              icon={<MoveRight />} 
              label="Guia de Leitura" 
              active={settings.guiaLeitura} 
              onClick={() => toggleSetting('guiaLeitura')} 
            />
            <Option 
              icon={<ScanLine />} 
              label="Máscara de Leitura" 
              active={settings.mascaraLeitura} 
              onClick={() => toggleSetting('mascaraLeitura')} 
            />
            <Option icon={<AlignLeft />} label="Texto Alinhado" />

            {/* Navegação e Movimento */}
            <Option icon={<MousePointer2 />} label="Cursor Gigante" active={settings.cursorGigante} onClick={() => toggleSetting('cursorGigante')} />
            <Option icon={<PauseCircleIcon />} label="Parar Animações" active={settings.pararAnimacoes} onClick={() => toggleSetting('pararAnimacoes')} />
            <Option icon={<BookA />} label="Dicionário" />

            {/* Outros */}
            <Option icon={<Volume2 />} label="Leitor de texto" active={settings.leitorTexto} onClick={() => toggleSetting('leitorTexto')} />
            <Option 
              icon={<Search />} 
              label="Lupa" 
              active={settings.lupa} 
              onClick={() => toggleSetting('lupa')} 
            />
            <Option icon={<Type />} label="Fonte Legível" active={settings.fonteLegivel} onClick={() => toggleSetting('fonteLegivel')} />
            <Option icon={<Link2 />} label="Destacar Links" active={settings.destacarLinks} onClick={() => toggleSetting('destacarLinks')} />
            <Option 
              icon={<Keyboard />} 
              label="Teclado de Navegação" 
              active={settings.tecladoVirtual} 
              onClick={() => toggleSetting('tecladoVirtual')} 
            />            
            {/* Lógica de Zoom */}
            <Option 
              icon={<ZoomIn />} 
              label="Ampliador de Texto" 
              active={settings.zoom > 1} 
              onClick={() => { settings.zoom > 1.4 ? changeZoom(-1) : changeZoom(0.1) }} 
            />
          </div>
        </Section>

        {/* --- DALTONISMO --- */}
        <Section title="Daltonismo">
          <div className="grid grid-cols-2 gap-3">
            <ColorCard label="Sem daltonismo" gradient="from-indigo-500 via-green-400 to-red-500" active={settings.daltonismo === null} onClick={() => setDaltonismo(null)} />
            <ColorCard label="Tritanopia" gradient="from-teal-500 to-red-500" active={settings.daltonismo === 'tritanopia'} onClick={() => setDaltonismo('tritanopia')} />
            <ColorCard label="Protonopia" gradient="from-blue-700 to-yellow-400" active={settings.daltonismo === 'protanopia'} onClick={() => setDaltonismo('protanopia')} />
            <ColorCard label="Deuteranopia" gradient="from-green-600 to-yellow-500" active={settings.daltonismo === 'deuteranopia'} onClick={() => setDaltonismo('deuteranopia')} />
          </div>
        </Section>

        {/* --- FÁCIL NAVEGAÇÃO --- */}
        <Section title="Fácil Navegação">
          <div className="grid grid-cols-2 gap-3">
            <Option 
              icon={<Home size={20} />} 
              label="1. Inicial" 
              onClick={() => handleNavigation('/')} 
              active={pathname === '/'} 
            />
            <Option 
              icon={<Users2 size={20} />} 
              label="2. Comunidade" 
              onClick={() => handleNavigation('/comunidade')} 
              active={pathname === '/comunidade'} 
            />
            <Option 
              icon={<Newspaper size={20} />} 
              label="3. Notícias" 
              onClick={() => handleNavigation('/noticias')} 
              active={pathname === '/noticias'} 
            />
            <Option 
              icon={<Brain size={20} />} 
              label="4. O que é o TEA" 
              onClick={() => handleNavigation('/TEA')} 
              active={pathname === '/TEA'} 
            />
            <Option 
              icon={<FileText size={20} />} 
              label="5. Termos de uso" 
              onClick={() => handleNavigation('/termos')} 
              active={pathname === '/termos'} 
            />
            <Option 
              icon={<ShieldCheck size={20} />} 
              label="6. Privacidade" 
              onClick={() => handleNavigation('/privacidade')} 
              active={pathname === '/privacidade'} 
            />
            <Option 
              icon={<Cookie size={20} />} 
              label="7. Cookies" 
              onClick={() => handleNavigation('/cookies')} 
              active={pathname === '/cookies'} 
            />
            <Option 
              icon={<User2 size={20} />} 
              label="8. Conta" 
              onClick={() => handleNavigation('/account')} 
              active={pathname === '/account'} 
            />
          </div>
        </Section>

        {/* --- MODELOS PRONTOS --- */}
        <Section title="Modelos prontos">
          <Model label="Pessoa cega / Baixa Visão" onClick={() => aplicarModelo('cega')} />
          <Model label="Pessoa TDAH" onClick={() => aplicarModelo('tdah')} />
          <Model label="Pessoa Dislexa" onClick={() => aplicarModelo('dislexa')} />
          <Model label="Pessoa com Alta idade" onClick={() => aplicarModelo('idade')} />
          <Model label="Pessoa com Parkinson" />
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

function Option({ icon, label, active, onClick }) {
  // Se não houver onClick (ex: opções não finalizadas), ele se comporta como botão normal
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-lg p-2.5 flex text-center justify-center flex-col items-center gap-2 text-[10px] border transition-all min-h-[80px] ${
        active
          ? "bg-[#143A7B] text-white border-[#143A7B]"
          : "bg-white border-[#CFCFCF] text-[#1A3879] hover:bg-blue-50 hover:border-blue-400"
      }`}
    >
      {icon}
      <span className="leading-tight">{label}</span>
    </button>
  );
}

function Model({ label, onClick }) {
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
        APLICAR
      </button>
    </div>
  );
}