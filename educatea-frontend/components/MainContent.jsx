"use client"

import Image from "next/image";
import MainLogo from "../public/images/logos/MainLogo.webp";
import IconYoutube from "../public/images/icons/Youtube.webp";
import { useLanguage } from "@/context/LanguageContext";

export default function MainContent() {
  const { t } = useLanguage();

  return (
    <section 
      id="apresentacao" 
      // Mantemos o caminho direto aqui para evitar erros de importação
      style={{ backgroundImage: "url('/images/banners/Main.webp')" }} 
      className={`
        relative flex flex-col items-center justify-between gap-8 px-6 py-10 
        2xl:min-h-[88dvh] bg-cover bg-center bg-no-repeat bg-black/65 bg-blend-overlay
      `}
    >
      
      {/* LOGO */}
      <Image
        src={MainLogo}
        width={180}
        height={180}
        alt={t('components.main_content.logo_alt')}
        className="w-[140px] sm:w-[180px] md:w-[220px] h-auto"
      />

      {/* VÍDEO / YOUTUBE */}
      <div className="w-full max-w-[740px] aspect-video bg-white flex items-center justify-center rounded-lg">
        <Image
          src={IconYoutube}
          width={90}
          height={90}
          alt={t('components.main_content.youtube_alt')}
          className="w-[60px] sm:w-[80px] md:w-[90px] h-auto"
        />
      </div>

      {/* TEXTO */}
      <h1 className="text-center text-white font-bold text-lg sm:text-xl md:text-2xl leading-tight">
        {t('components.main_content.title_part1')} <br className="hidden sm:block" />
        {t('components.main_content.title_part2')}
      </h1>

    </section>
  );
}