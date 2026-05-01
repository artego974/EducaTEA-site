"use client";

import React from "react";
import Image from "next/image";
import ChatFace from "../../public/images/avatars/avatar09.png";
import { useLanguage } from "@/context/LanguageContext";

export default function ChatbotButton({ onClick }) {
  const { t } = useLanguage();

  return (
    <div
      onClick={onClick}
      className={`bg-[#F9A318] ${t('components.chatbot_button.text') == "Habla con el Chatbot" ? "2xl:w-[255px] lg:w-[235px] w-full" : "2xl:w-[240px] lg:w-[220px] 2xl:w-[240px] w-full"}  z-40 cursor-pointer border-2 border-white rounded-full text-white flex justify-between gap-3 lg:py-1.5 lg:px-5 p-2.5 items-center font-semibold hover:opacity-90 transition`}
    >
      <Image 
        src={ChatFace} 
        className="2xl:size-11 lg:size-[42px] size-10" 
        alt={t('components.chatbot_button.alt')} 
      />
      <p className="lg:w-full lg:text-[15px] 2xl:text-base lg:block hidden">
        {t('components.chatbot_button.text')}
      </p>
    </div>
  );
}