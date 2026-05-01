"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LegalLayout({ children, title, date }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    /* ADICIONADO: dark:bg-zinc-950 dark:text-zinc-300 */
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 transition-colors duration-300 dark:bg-[#1A1A1A] dark:text-zinc-300">
      
      {/* --- CABEÇALHO CLEAN --- */}
      {/* ADICIONADO: dark:bg-zinc-900 dark:border-b dark:border-zinc-800 */}
      <header className="bg-[#1A3879] text-white pt-12 pb-24 px-6 dark:border-b dark:border-zinc-800">
        <div className="max-w-6xl mx-auto ">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors text-sm dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('components.legal_layout.back_home')}
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 dark:text-white ">
            {title}
          </h1>
          <p className="text-blue-200 text-sm dark:text-zinc-400">
             {t('components.legal_layout.last_updated')} {date}
          </p>
        </div>
      </header>

      {/* --- CORPO DA PÁGINA --- */}
      <div className="max-w-6xl mx-auto -mt-12 pb-20 px-4 md:px-0 ">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* CONTEÚDO DO TEXTO */}
          {/* ADICIONADO: dark:bg-zinc-900 dark:border-zinc-800 */}
          <main className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 transition-colors dark:bg-zinc-800 dark:border-zinc-800">
            
            {/* IMPORTANTE: Adicionei 'dark:prose-invert' e 'dark:prose-headings:text-white'. 
               Isso faz com que o texto renderizado pelo markdown/children fique branco no dark mode.
            */}
            <div className="prose prose-blue max-w-none prose-headings:text-[#1A3879] prose-a:text-[#1A3879] dark:prose-invert dark:prose-headings:text-white dark:prose-a:text-blue-400">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}