"use client";

import Link from "next/link";
import Image from "next/image";
import { LanguageSelectFooter } from "./sub-components/LanguageSelectFooter";
import { Instagram, Linkedin, Mail } from "lucide-react"; // Adicionei mais ícones para compor
import { useLanguage } from "@/context/LanguageContext";

// Supondo que você tenha o logo em branco ou transparente
import LogoWhite from "@/public/images/logos/TextLogo.webp"; // Ajuste o caminho se necessário

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="footer" className="bg-[#1A1A1A] text-white mt-auto border-t border-gray-800">
      
      {/* Seção Principal */}
      <div className="2xl:max-w-7xl lg:max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Coluna 1: Marca e Descrição */}
          <div className="space-y-4">
                {/* Filtro css rápido para deixar o logo branco caso ele seja azul escuro */}
                <Image src={LogoWhite} alt="EducaTEA" width={140} height={40} className="object-contain" />
             
             <p className="text-gray-400 lg:text-[13px] 2xl:text-sm leading-relaxed max-w-xs">
               {t('components.footer.description')}
             </p>
          </div>

          {/* Coluna 2: Páginas */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">
                {t('components.footer.titles.pages')}
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/comunidade" className="hover:text-[#0033FF] transition-colors">
                  {t('components.footer.links.community')}
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="hover:text-[#0033FF] transition-colors pointer-events-none">
                  {t('components.footer.links.news') + ' - EM BREVE'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">
                {t('components.footer.titles.legal')}
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/termos" className="hover:text-[#0033FF] transition-colors">
                  {t('components.footer.links.terms')}
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-[#0033FF] transition-colors">
                  {t('components.footer.links.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-[#0033FF] transition-colors">
                  {t('components.footer.links.cookies')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Social & Idioma */}
          <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold mb-4 text-white">
                    {t('components.footer.titles.social')}
                </h3>
                <div className="flex gap-4">
                    <a href="https://www.instagram.com/educatea_oficial/" target="_blank" className="bg-gray-800 p-2 rounded-full hover:bg-[#0033FF] transition-all hover:-translate-y-1">
                        <Instagram size={20} />
                    </a>
                    <a 
                      href="mailto:educateariograndedosul@gmail.com" 
                      className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition-all hover:-translate-y-1 dark:bg-zinc-800 dark:hover:bg-red-500"
                    >
                      <Mail size={20} />
                    </a>
                </div>
            </div>
            
            {/* Componente de Idioma */}
            <div>
                <LanguageSelectFooter />
            </div>
          </div>

        </div>
      </div>

      {/* Barra Inferior */}
      <div className="border-t border-gray-800 bg-[#111111]">
        <div className="2xl:max-w-7xl lg:max-w-5xl mx-auto px-6 py-4 lg:py-6 flex flex-col md:flex-row justify-between items-center lg:gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            {t('components.footer.copyright')}
          </p>
          <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Espaço para logos de parceiros/Senac se quiser colocar pequeno no rodapé */}
             {/* <Image src={LogoSenac} width={60} alt="Senac" /> */}
          </div>
        </div>
      </div>
    </footer>
  );
}