"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAcessibilidade } from "@/context/AcessibilidadeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUp, 
  ArrowDown, 
  Home, 
  Gamepad2, 
  Calendar, 
  Search, 
  Images, 
  MessageSquare, 
  Users,
  ListEnd
} from "lucide-react";

export default function AcessibilidadeTeclado() {
  const { settings } = useAcessibilidade();
  const pathname = usePathname();
  const [activeKey, setActiveKey] = useState(null);

  const isPaginaPrincipal = pathname === "/";

  const handleScroll = (direction) => {
    const scrollAmount = window.innerHeight * 0.7;
    window.scrollBy({
      top: direction === "up" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const botoesNavegacao = [
    { id: "apresentacao", icon: <Home size={16} />,          label: "Início",    key: "1" },
    { id: "jogo",         icon: <Gamepad2 size={16} />,      label: "Jogo",      key: "2" },
    { id: "feiras",       icon: <Calendar size={16} />,      label: "Feira",     key: "3" },
    { id: "trabalhos",    icon: <Search size={16} />,        label: "Pesquisas", key: "4" },
    { id: "slider",       icon: <Images size={16} />,        label: "Galeria",   key: "5" },
    { id: "comunidade",   icon: <MessageSquare size={16} />, label: "Fórum",     key: "6" },
    { id: "equipe",       icon: <Users size={16} />,         label: "Equipe",    key: "7" },
    { id: "footer",       icon: <ListEnd size={16} />,       label: "Footer",    key: "8" },
  ];

  // Ouvir teclas do teclado físico — useEffect ANTES do return condicional
  useEffect(() => {
    if (!settings.tecladoVirtual) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        handleScroll("up");
        setActiveKey("up");
        setTimeout(() => setActiveKey(null), 300);
      } else if (e.key === "ArrowDown") {
        handleScroll("down");
        setActiveKey("down");
        setTimeout(() => setActiveKey(null), 300);
      } else if (isPaginaPrincipal) {
        const btn = botoesNavegacao.find(b => b.key === e.key);
        if (btn) {
          scrollToSection(btn.id);
          setActiveKey(btn.key);
          setTimeout(() => setActiveKey(null), 300);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settings.tecladoVirtual, isPaginaPrincipal]);

  // Retorno condicional DEPOIS de todos os hooks
  if (!settings.tecladoVirtual) return null;

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[9900]">
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-zinc-900 border-y border-r border-gray-200 dark:border-zinc-700 shadow-2xl rounded-r-2xl p-2 flex flex-col gap-1.5"
      >
        {/* Label topo */}
        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500 text-center pb-1 px-1">
          Teclas
        </div>

        {/* Botão de Subir */}
        <motion.button
          onClick={() => { handleScroll("up"); setActiveKey("up"); setTimeout(() => setActiveKey(null), 300); }}
          animate={activeKey === "up" ? { scale: 0.9 } : { scale: 1 }}
          className="w-14 h-12 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#1A3879] dark:text-blue-400 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors shadow-sm group relative"
          title="Subir Tela (↑)"
        >
          <ArrowUp size={16} strokeWidth={2.5} />
          <span className="text-[9px] font-mono font-bold text-gray-400 dark:text-zinc-500">↑</span>
          <span className="absolute left-[60px] bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Subir ↑
          </span>
        </motion.button>

        {/* Seções — só aparecem na página principal, com animação */}
        <AnimatePresence>
          {isPaginaPrincipal && (
            <motion.div
              key="secoes"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden flex flex-col gap-1.5"
            >
              <div className="w-full h-px bg-gray-200 dark:bg-zinc-700 mt-0.5" />

              {botoesNavegacao.map((btn) => (
                <motion.button
                  key={btn.id}
                  onClick={() => { scrollToSection(btn.id); setActiveKey(btn.key); setTimeout(() => setActiveKey(null), 300); }}
                  animate={activeKey === btn.key ? { scale: 0.9 } : { scale: 1 }}
                  className="w-14 h-14 bg-white hover:bg-blue-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors shadow-sm group relative"
                  title={`${btn.label} (tecla ${btn.key})`}
                >
                  {/* Badge estilo tecla de teclado físico */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "22px",
                      height: "22px",
                      borderRadius: "5px",
                      fontSize: "11px",
                      fontFamily: "monospace",
                      fontWeight: "900",
                      lineHeight: 1,
                      userSelect: "none",
                      transition: "all 75ms",
                      background: "linear-gradient(180deg, #f9fafb 0%, #e5e7eb 100%)",
                      border: "1px solid #9ca3af",
                      borderBottom: "3px solid #6b7280",
                      boxShadow: "0 2px 0 #4b5563, inset 0 1px 0 rgba(255,255,255,0.8)",
                      color: "#1A3879",
                      ...(activeKey === btn.key && {
                        transform: "translateY(2px)",
                        borderBottom: "1px solid #6b7280",
                        boxShadow: "0 0px 0 #4b5563, inset 0 1px 0 rgba(255,255,255,0.4)",
                      })
                    }}
                  >
                    {btn.key}
                  </span>

                  {/* Ícone abaixo */}
                  <span className="text-gray-400 dark:text-zinc-500 leading-none">
                    {btn.icon}
                  </span>

                  {/* Tooltip Hover */}
                  <span className="absolute left-[60px] bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap flex items-center gap-1.5">
                    <kbd
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "16px",
                        height: "18px",
                        borderRadius: "3px",
                        fontSize: "10px",
                        fontFamily: "monospace",
                        fontWeight: "700",
                        background: "rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        borderBottom: "2px solid rgba(255,255,255,0.4)",
                      }}
                    >
                      {btn.key}
                    </kbd>
                    {btn.label}
                  </span>
                </motion.button>
              ))}

              <div className="w-full h-px bg-gray-200 dark:bg-zinc-700 mb-0.5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão de Descer */}
        <motion.button
          onClick={() => { handleScroll("down"); setActiveKey("down"); setTimeout(() => setActiveKey(null), 300); }}
          animate={activeKey === "down" ? { scale: 0.9 } : { scale: 1 }}
          className="w-14 h-12 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#1A3879] dark:text-blue-400 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors shadow-sm group relative"
          title="Descer Tela (↓)"
        >
          <ArrowDown size={16} strokeWidth={2.5} />
          <span className="text-[9px] font-mono font-bold text-gray-400 dark:text-zinc-500">↓</span>
          <span className="absolute left-[60px] bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Descer ↓
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
