"use client"
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useLanguage } from "@/context/LanguageContext";

const STORAGE_KEY = "educatea_cookie_consent";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Se o usuário já escolheu, não mostra o banner novamente
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setIsVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-zinc-900 border border-gray-200 pb-8 p-6 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {t('components.cookie_banner.title')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('components.cookie_banner.text')}{' '}
            <Link href="/cookies" className="text-[#1A3879] dark:text-blue-400 font-semibold hover:underline">
              {t('components.cookie_banner.policy_link')}
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 items-center">
          <button
            onClick={handleAccept}
            className="bg-[#1A3879] text-sm cursor-pointer hover:bg-[#152d63] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
          >
            {t('components.cookie_banner.accept_btn')}
          </button>

          <button
            onClick={handleReject}
            className="border border-gray-300 dark:border-zinc-600 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 text-[#1A3879] dark:text-blue-400 font-semibold py-2 px-4 rounded-md transition-colors duration-200"
          >
            {t('components.cookie_banner.reject_btn')}
          </button>

          <Link
            href="/cookies"
            className="text-[#1A3879] dark:text-blue-400 font-semibold cursor-pointer hover:underline text-sm text-center"
          >
            {t('components.cookie_banner.what_are_cookies')}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CookieBanner;
