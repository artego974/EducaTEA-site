"use client";

import React from "react";
import Image from "next/image";
import IconAcessibilidade from "../../public/images/icons/Acessibilidade.webp";
import { useLanguage } from "@/context/LanguageContext";

export default function AcessibilidadeButton({ onClick }) {
  const { t } = useLanguage();

  return (
    <div
      className="flex flex-col items-center gap-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-[#F91818] lg:w-[220px] 2xl:w-[240px] w-full border-2 border-white rounded-full text-white flex justify-between lg:gap-2 2xl:gap-3 lg:py-1.5 lg:px-5 p-2.5 items-center font-semibold hover:bg-[#d41414] transition-colors">
        <Image
          src={IconAcessibilidade}
          className="2xl:size-11 lg:size-[42px] size-10"
          alt={t('components.accessibility_button.alt')}
        />
        <p className="lg:w-full lg:text-[15px] 2xl:text-base lg:block hidden">
          {t('components.accessibility_button.text')}
        </p>
      </div>
    </div>
  );
}
