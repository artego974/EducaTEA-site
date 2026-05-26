"use client";

import { useState } from "react"; // Removemos useRef se não for usado
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// 1. Importe o hook do contexto que criamos
import { useLanguage } from "@/context/LanguageContext"; // Ajuste o caminho conforme sua pasta

// Importação das Imagens (Mantida igual)
import FlagBrasil from "../../public/images/languages/BR.webp"
import FlagPortugal from "../../public/images/languages/Portugal.webp"
import FlagAngola from "../../public/images/languages/Angola.webp"
import FlagUS from "../../public/images/languages/US.webp"
import FlagEspanha from "../../public/images/languages/ES.webp"
import FlagLatAm from "../../public/images/languages/LatAm.webp"

const languages = [
  { id: "pt-br", label: "Português (Brasil)", flag: FlagBrasil },
  // { id: "pt-pt", label: "Português (Portugal)", flag: FlagPortugal },
  // { id: "pt-ag", label: "Português (Angola)", flag: FlagAngola },
  { id: "en-us", label: "English (US)", flag: FlagUS },
  { id: "es-es", label: "Español", flag: FlagEspanha },
  // { id: "es-al", label: "Español (LatAm)", flag: FlagLatAm },
];

export function LanguageSelectHeader() {
  const [open, setOpen] = useState(false);
  
  // 2. Usamos o Contexto em vez de estado local para a língua
  const { lang, switchLanguage } = useLanguage();

  // 3. Encontramos o objeto da língua atual baseado no ID salvo no contexto global
  // Se não achar (primeira carga), usa o primeiro do array como fallback
  const selected = languages.find((l) => l.id === lang) || languages[0];

  const handleLanguageChange = (languageId) => {
    switchLanguage(languageId); // Atualiza o contexto e o localStorage
    setOpen(false); // Fecha o dropdown
  };

  return (
    <div className="relative">
      {/* Botão Principal */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
      >
        <Image
          src={selected.flag}
          className="w-12 h-8 rounded object-cover" // Adicionei object-cover para garantir ajuste
          alt={selected.label}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="
              absolute top-full right-0 mt-8
              bg-[#2f2f2f]
              rounded-lg
              shadow-lg
              overflow-hidden
              min-w-[250px]
              z-50
            "
          >
            {languages.map((item) => (
              <li
                key={item.id}
                // 4. Ao clicar, chamamos a função que atualiza o global
                onClick={() => handleLanguageChange(item.id)}
                className={`
                  flex items-center gap-4
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
                
                {/* Opcional: Indicador visual da seleção atual */}
                {lang === item.id && (
                  <span className="ml-auto text-xs text-green-400">Ativo</span>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}