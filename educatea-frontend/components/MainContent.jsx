"use client"

import Image from "next/image";
import { useState } from "react";
import MainLogo from "../public/images/logos/MainLogo.webp";
import ChannelLogo from "../public/images/logos/youtubelogo.png";
import { useLanguage } from "@/context/LanguageContext";

export default function MainContent() {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const videoId = "eUXDVLxdcFc";

  return (
    <section 
      id="apresentacao" 
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
      <div className="w-full max-w-[740px] aspect-video rounded-lg overflow-hidden relative">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
            title={t('components.main_content.youtube_alt')}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={t('components.main_content.youtube_alt')}
            className="group w-full h-full relative cursor-pointer text-left"
          >
            <img
              src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
              alt={t('components.main_content.youtube_alt')}
              className="w-full h-full object-cover"
            />

            {/* Overlay escuro suave */}
            <span className="absolute inset-0 bg-black/20 lg:group-hover:bg-black/30 transition-colors" />

            {/* Top bar: avatar + (título / canal) */}
            <span className="absolute top-0 inset-x-0 px-3 sm:px-4 pt-2.5 sm:pt-3 pb-6 sm:pb-8 bg-linear-to-b from-black/85 via-black/50 to-transparent flex items-center gap-2.5 sm:gap-3 pointer-events-none">
              <Image
                src={ChannelLogo}
                width={40}
                height={40}
                alt={t('components.main_content.channel_logo_alt')}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover bg-white shrink-0"
              />
              <span className="flex flex-col min-w-0">
                <span className="text-white font-medium text-sm sm:text-base leading-snug line-clamp-2">
                  {t('components.main_content.video_title')}
                </span>
                <span className="text-white/80 text-[10px] sm:text-xs leading-tight">
                  {t('components.main_content.channel_name')}
                </span>
              </span>
            </span>

            {/* Botão central de play */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span
                className="flex items-center justify-center w-17 h-12 sm:w-21.25 sm:h-15 rounded-[14px] bg-[#FF0000] lg:bg-[#FF0000]/70 group-hover:bg-[#FF0000] transition-colors duration-200"
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-9 sm:h-9 text-white" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>

      {/* TEXTO */}
      <h1 className="text-center text-white font-bold text-lg sm:text-xl md:text-2xl leading-tight">
        {t('components.main_content.title_part1')} <br className="hidden sm:block" />
        {t('components.main_content.title_part2')}
      </h1>

    </section>
  );
}