"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

import Slide01 from "../public/images/carrosel-jogo/slide-1.png";
import Slide02 from "../public/images/carrosel-jogo/slide-2.png";
import Slide03 from "../public/images/carrosel-jogo/slide-3.png";
import Slide04 from "../public/images/carrosel-jogo/slide-4.png";

import LeftChevron from "../public/images/icons/leftChevron.webp";
import RightChevron from "../public/images/icons/rightChevron.webp";

const slides = [Slide01, Slide02, Slide03, Slide04];
const SLIDE_TIME = 5;

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countdown, setCountdown] = useState(SLIDE_TIME);
  const { t } = useLanguage();

  /* AUTOPLAY — countdown como dependência para evitar closure stale */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown === 1) {
        setCurrentSlide((slide) =>
          slide === slides.length - 1 ? 0 : slide + 1
        );
        setCountdown(SLIDE_TIME);
      } else {
        setCountdown((prev) => prev - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const changeSlide = (index) => {
    setCurrentSlide(index);
    setCountdown(SLIDE_TIME);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="z-10 w-full max-w-5xl 2xl:max-w-7xl mx-auto text-center px-4 sm:px-0"
      id="slider"
    >
      {/* TITLE */}
      <h1 className="text-white text-2xl sm:text-3xl font-bold mb-8 sm:mb-16">
        {t('components.slider.title')}
      </h1>

      {/* SLIDER */}
      <div
        className="
          relative
          rounded-2xl
          overflow-hidden
          bg-black
          
          h-[220px]
          sm:h-[420px]
          lg:h-[600px]
          2xl:h-[700px]
        "
      >
        {/* SLIDE IMAGE */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentSlide]}
              alt={`${t('components.slider.slide_alt')} ${currentSlide + 1}`}
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* COUNTDOWN */}
        <div
          className="
            absolute top-3 right-3
            sm:top-4 sm:right-4
            bg-[#0033FF] text-white
            size-10 sm:size-12
            flex items-center justify-center
            rounded-full
            z-20
          "
        >
          <span className="font-bold text-sm sm:text-xl">
            {countdown}s
          </span>
        </div>

        {/* LEFT ARROW */}
        <motion.button
          whileHover={{ x: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            changeSlide(
              currentSlide === 0 ? slides.length - 1 : currentSlide - 1
            )
          }
          className="
            absolute left-0 top-1/2 -translate-y-1/2
            bg-white/25 text-white
            text-2xl sm:text-3xl
            px-3 sm:px-4
            py-4 sm:py-6
            rounded-tr-2xl rounded-br-2xl
            z-20
          "
        >
          <Image src={LeftChevron} className="w-4" alt="Previous" />
        </motion.button>

        {/* RIGHT ARROW */}
        <motion.button
          whileHover={{ x: 4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            changeSlide(
              currentSlide === slides.length - 1 ? 0 : currentSlide + 1
            )
          }
          className="
            absolute right-0 top-1/2 -translate-y-1/2
            bg-white/25 text-white
            text-2xl sm:text-3xl
            px-3 sm:px-4
            py-4 sm:py-6
            rounded-tl-2xl rounded-bl-2xl
            z-20
          "
        >
          <Image src={RightChevron} className="w-4" alt="Next" />
        </motion.button>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => changeSlide(index)}
            animate={{
              width: currentSlide === index ? 40 : 20,
              backgroundColor:
                currentSlide === index ? "#0033FF" : "transparent",
            }}
            transition={{ duration: 0.3 }}
            className="
              h-2.5 sm:h-3
              rounded-full
              border-2 border-[#0033FF]
            "
          />
        ))}
      </div>
    </motion.div>
  );
}
