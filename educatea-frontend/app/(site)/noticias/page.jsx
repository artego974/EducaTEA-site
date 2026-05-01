"use client";
import React from "react";
import Image from "next/image"; // Importante: Next.js Image
import { Play, Share2, ImageIcon } from "lucide-react"; 
import SuaImagem from "@/public/images/banners/Linkedin.png"

export default function Noticias() {
  return (
    /* Ajustado: bg-gray-50 para dark:bg-zinc-950 */
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      
      {/* HEADER DA NOTÍCIA */}
      {/* Ajustado: dark:bg-zinc-900 para um azul mais profundo ou cinza escuro */}
      <div className="bg-[#1A3879] dark:bg-zinc-[#1A3879] flex items-center justify-center py-12 px-6">
        <div className="max-w-7xl flex items-center justify-center flex-col gap-10 text-white w-full">
          <div className="flex flex-col gap-2 w-full">
            <p className="text-lg font-medium opacity-90 dark:text-blue-400">Apresentação de Pitch</p>
            <h2 className="text-4xl lg:text-6xl font-black leading-tight tracking-wide lg:w-11/12 mt-2">
              EDUCATEA AVANÇA
            </h2>
            <p className="text-lg mt-4 opacity-80 dark:text-zinc-400">25/04/2026</p>
          </div>
        </div>
      </div>

      {/* --- SEÇÃO DE CONTEÚDO --- */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 dark:bg-zinc-900">
        
        {/* Título da Seção */}
        {/* Ajustado: dark:border-zinc-800 e dark:text-white */}
        <div className="mb-10 border-b pb-4 border-gray-200 dark:border-zinc-800">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1A3879] dark:text-white uppercase tracking-wider">
              Revista Competência
            </h1>
        </div>

        {/* Texto da Notícia */}
        {/* Ajustado: text-gray-700 para dark:text-zinc-300 */}
        <div className="flex flex-col gap-8 text-gray-700 dark:text-zinc-300 text-lg leading-relaxed text-justify">
          
          <p>
            O <span className="font-bold text-[#1A3879] bg-blue-50 px-1 rounded dark:bg-blue-900/30 dark:text-blue-300">
              JOGO EDUCACIONAL EDUCATEA
            </span> é um texto fictício da indústria tipográfica e de impressão. Lorem Ipsum tem sido o texto 
            fictício padrão da indústria desde os anos 1500.
          </p>

          <p>
            Foi popularizado na década de 1960 com o lançamento de folhas Letraset contendo passagens 
            de Lorem Ipsum.
          </p>

          {/* --- Bloco de Imagem em Destaque --- */}
          {/* Ajustado: dark:bg-zinc-900 e dark:border-zinc-800 */}
          <figure className="my-8 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="w-full h-64 md:h-160 bg-gray-200 dark:bg-zinc-800 relative flex items-center justify-center">
                <Image 
                    src={SuaImagem} 
                    alt="Alunos jogando" 
                    fill // Use fill para layouts responsivos dentro de containers com altura fixa
                    className="object-cover w-full h-full" 
                  /> 
            </div>
            
            {/* Ajustado: dark:border-blue-500 */}
            <figcaption className="p-6 border-l-4 border-[#1A3879] dark:border-blue-500">
              <h3 className="text-xl font-bold text-[#1A3879] dark:text-white mb-1">
                Aplicação do Jogo na Escola Senac São Leopoldo
              </h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 italic flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-zinc-600 block"></span>
                Imagem: Arthur Juwer Rambo e Arthur Cidade
              </p>
            </figcaption>
          </figure>

          <p>
            O Lorem Ipsum é um texto fictício da indústria tipográfica e de impressão. Tem sido o texto 
            fictício padrão da indústria desde os anos 1500.
          </p>
        </div>

      </div>
    </div>
  );
}