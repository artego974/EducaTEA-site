"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// 1. Importe o hook do contexto
import { useLanguage } from "@/context/LanguageContext";

// Importação das Imagens
import FlagBrasil from "../../public/images/languages/BR.webp"
import FlagUS from "../../public/images/languages/US.webp"
import FlagEspanha from "../../public/images/languages/ES.webp"

const languages = [
  { id: "pt-br", label: "Português (BR)", flag: FlagBrasil },
  { id: "en-us", label: "English (US)", flag: FlagUS },
  { id: "es-es", label: "Español (ES)", flag: FlagEspanha },
];

export function LanguageSelectFooter() {
  const [open, setOpen] = useState(false);
  
  // 2. Usamos o Contexto Global
  const { lang, switchLanguage } = useLanguage();

  // 3. Calcula qual língua mostrar baseado no Contexto
  const selected = languages.find((l) => l.id === lang) || languages[0];

  const handleLanguageChange = (languageId) => {
    switchLanguage(languageId);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Botão com Motion (Estilo do Footer) */}
      <motion.button
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-2
          cursor-pointer
          hover:opacity-80
          transition
        "
      >
        <Image
          src={selected.flag}
          width={20}
          height={20}
          alt={selected.label}
          className="rounded-sm object-cover"
        />
        <span className="lg:text-[15px]">{selected.label}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="
              absolute bottom-full mb-2
              left-1/2 -translate-x-1/2  /* Centraliza o menu em relação ao botão */
              bg-[#2f2f2f]
              rounded-lg
              shadow-lg
              overflow-hidden
              min-w-[200px]
              z-50
            "
          >
            {languages.map((item) => (
              <li
                key={item.id}
                onClick={() => handleLanguageChange(item.id)}
                className={`
                  flex items-center gap-2
                  px-4 py-2
                  cursor-pointer
                  transition
                  ${lang === item.id ? 'bg-white/20' : 'hover:bg-white/10'} 
                `}
              >
                <Image
                  src={item.flag}
                  width={20}
                  height={20}
                  alt={item.label}
                  className="rounded-sm"
                />
                <span className="text-white text-sm">{item.label}</span>
                
                {lang === item.id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500"></span>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}