"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

import Slide01 from "../public/images/carrosel-jogo/slide-1.webp";
import Slide02 from "../public/images/carrosel-jogo/slide-2.webp";
import Slide03 from "../public/images/carrosel-jogo/slide-3.webp";
import Slide04 from "../public/images/carrosel-jogo/slide-4.webp";

import LeftChevron from "../public/images/icons/leftChevron.webp";
import RightChevron from "../public/images/icons/rightChevron.webp";

const slides = [Slide01, Slide02, Slide03, Slide04];
const SLIDE_TIME = 5;
const SWIPE_THRESHOLD = 50;

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { t } = useLanguage();

  /* AUTOPLAY — pausa quando fullscreen está aberto */
  useEffect(() => {
    if (isFullscreen) return;
    const timer = setTimeout(() => {
      setCurrentSlide((s) => (s === slides.length - 1 ? 0 : s + 1));
    }, SLIDE_TIME * 1000);
    return () => clearTimeout(timer);
  }, [currentSlide, isFullscreen]);

  /* LOCK BODY SCROLL + ESC PARA FECHAR */
  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isFullscreen]);

  const changeSlide = (index) => setCurrentSlide(index);
  const goNext = () =>
    changeSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  const goPrev = () =>
    changeSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);

  const handleSwipeEnd = (_, info) => {
    if (info.offset.x < -SWIPE_THRESHOLD) goNext();
    else if (info.offset.x > SWIPE_THRESHOLD) goPrev();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="z-10 w-full text-center"
        id="slider"
      >
        {/* TITLE */}
        <h1 className="text-white text-2xl sm:text-3xl font-bold mb-8 sm:mb-16 px-4">
          {t('components.slider.title')}
        </h1>

        {/* SLIDER WRAPPER — full-bleed no mobile, max-w no desktop */}
        <div className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto">
          <div
            id="slider-slides"
            role="region"
            aria-roledescription="carousel"
            aria-label={t('components.slider.title')}
            className="
              relative
              overflow-hidden
              bg-black
              aspect-video
              sm:aspect-auto
              sm:h-[420px]
              lg:h-[600px]
              2xl:h-[700px]
              sm:rounded-2xl
            "
          >
            {/* SLIDE IMAGE + SWIPE — aria-live=off because slides auto-rotate; an SR-only live region below announces the current slide */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                role="group"
                aria-roledescription="slide"
                aria-label={`${t('components.slider.slide_alt')} ${currentSlide + 1} / ${slides.length}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleSwipeEnd}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <Image
                  src={slides[currentSlide]}
                  alt={`${t('components.slider.slide_alt')} ${currentSlide + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 1024px, (max-width: 1536px) 1280px, 1536px"
                  priority={currentSlide === 0}
                  placeholder="blur"
                  draggable={false}
                  className="object-cover pointer-events-none select-none"
                />
              </motion.div>
            </AnimatePresence>

            {/* PROGRESS BAR */}
            <motion.div
              key={`progress-${currentSlide}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: SLIDE_TIME, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-[#0033FF] z-20"
            />

            {/* EXPAND BUTTON */}
            <button
              onClick={() => setIsFullscreen(true)}
              aria-label="Expandir slider"
              className="
                absolute top-3 right-3 sm:top-4 sm:right-4
                z-30
                bg-[#FACC15] hover:bg-[#EAB308]
                text-zinc-900
                p-2 sm:p-2.5
                rounded-full
                shadow-lg shadow-[#FACC15]/40
                transition-colors
                cursor-pointer
              "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>

            {/* LEFT ARROW (desktop only) */}
            <motion.button
              whileHover={{ x: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goPrev}
              aria-label="Slide anterior"
              aria-controls="slider-slides"
              className="
                hidden sm:flex items-center justify-center
                absolute left-0 top-1/2 -translate-y-1/2
                bg-white/25 text-white
                text-2xl sm:text-3xl
                px-3 sm:px-4
                py-4 sm:py-6
                rounded-tr-2xl rounded-br-2xl
                z-20
                cursor-pointer
              "
            >
              <Image src={LeftChevron} className="w-4" alt="" aria-hidden="true" />
            </motion.button>

            {/* RIGHT ARROW (desktop only) */}
            <motion.button
              whileHover={{ x: 4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goNext}
              aria-label="Próximo slide"
              aria-controls="slider-slides"
              className="
                hidden sm:flex items-center justify-center
                absolute right-0 top-1/2 -translate-y-1/2
                bg-white/25 text-white
                text-2xl sm:text-3xl
                px-3 sm:px-4
                py-4 sm:py-6
                rounded-tl-2xl rounded-bl-2xl
                z-20
                cursor-pointer
              "
            >
              <Image src={RightChevron} className="w-4" alt="" aria-hidden="true" />
            </motion.button>
          </div>

          {/* SR-only status: anuncia o slide atual de forma educada */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {`${t('components.slider.slide_alt')} ${currentSlide + 1} / ${slides.length}`}
          </div>
        </div>

        {/* DOTS */}
        <div className="flex justify-center gap-3 mt-4 sm:mt-6 px-4" role="tablist" aria-label={t('components.slider.title')}>
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => changeSlide(index)}
              role="tab"
              aria-selected={currentSlide === index}
              aria-controls="slider-slides"
              aria-label={`${t('components.slider.slide_alt')} ${index + 1}`}
              animate={{
                width: currentSlide === index ? 40 : 20,
                backgroundColor:
                  currentSlide === index ? "#0033FF" : "transparent",
              }}
              transition={{ duration: 0.3 }}
              className="h-3 rounded-full border-2 border-[#0033FF] cursor-pointer"
            />
          ))}
        </div>

        {/* MELHORAR EXPERIÊNCIA — mesma função do botão de expandir */}
        <div className="flex justify-center mt-6 sm:mt-8 px-4">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsFullscreen(true)}
            aria-label={t('components.slider.improve_experience')}
            className="
              inline-flex items-center justify-center gap-2
              bg-[#FACC15] hover:bg-[#EAB308]
              text-zinc-900 font-semibold
              px-5 py-3 sm:px-6 sm:py-3.5
              rounded-full
              shadow-lg shadow-[#FACC15]/40
              transition-colors
              cursor-pointer
            "
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
            <span className="text-sm sm:text-base">{t('components.slider.improve_experience')}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* FULLSCREEN MODAL */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsFullscreen(false)}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/95 overflow-hidden"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(false);
              }}
              aria-label="Fechar"
              className="
                absolute top-4 right-4 z-50
                text-white
                p-3
                bg-[#0033FF] hover:bg-[#0033FF]/85
                rounded-full
                shadow-lg shadow-[#0033FF]/30
                transition-colors
                cursor-pointer
              "
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* COUNTER */}
            <div className="absolute top-4 left-4 z-50 text-white text-sm font-semibold bg-[#0033FF] px-3 py-1.5 rounded-full shadow-lg shadow-[#0033FF]/30">
              {currentSlide + 1} / {slides.length}
            </div>

            {/* SWIPE LAYER (não rotacionada) */}
            <motion.div
              className="absolute inset-0"
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              onDragEnd={handleSwipeEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`fs-${currentSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="
                    absolute top-1/2 left-1/2
                    -translate-x-1/2 -translate-y-1/2
                    aspect-video
                    h-[100vw] rotate-90
                    sm:rotate-0 sm:h-auto sm:w-[92vw] sm:max-w-6xl
                  "
                >
                  <Image
                    src={slides[currentSlide]}
                    alt={`${t('components.slider.slide_alt')} ${currentSlide + 1}`}
                    fill
                    sizes="100vw"
                    placeholder="blur"
                    draggable={false}
                    className="object-contain pointer-events-none select-none"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* HINT MOBILE */}
            <div className="sm:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-white/70 text-xs bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
              ← deslize para navegar →
            </div>

            {/* DOTS DESKTOP */}
            <div
              className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-50 gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    currentSlide === index
                      ? "w-10 bg-[#0033FF]"
                      : "w-5 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
