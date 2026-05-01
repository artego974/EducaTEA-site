"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

import Feira1 from "../public/images/feiras/Feira1.png";
import Feira2 from "../public/images/feiras/Feira2.png";
import Feira3 from "../public/images/feiras/Feira3.png";
import Feira4 from "../public/images/feiras/Feira4.png";
import Feira5 from "../public/images/feiras/Feira5.png";
import Feira6 from "../public/images/feiras/Feira6.png";

import FeiraLogo1 from "../public/images/feiras/logo/FeiraLogo1.webp";
import FeiraLogo2 from "../public/images/feiras/logo/FeiraLogo2.webp";
import FeiraLogo3 from "../public/images/feiras/logo/FeiraLogo3.webp";
import FeiraLogo4 from "../public/images/feiras/logo/FeiraLogo4.webp";
import FeiraLogo5 from "../public/images/feiras/logo/FeiraLogo5.webp";
import FeiraLogo6 from "../public/images/feiras/logo/FeiraLogo6.webp";

export default function Fair() {
  const { t } = useLanguage();

  const feiras = [
    { id: 1, image: Feira1, logo: FeiraLogo1, },
    { id: 2, image: Feira2, logo: FeiraLogo2, },
    { id: 3, image: Feira3, logo: FeiraLogo3, },
    { id: 4, image: Feira4, logo: FeiraLogo4, },
    { id: 5, image: Feira5, logo: FeiraLogo5, },
    { id: 6, image: Feira6, logo: FeiraLogo6, },
  ];

  const [index, setIndex] = useState(0);

  /* AUTOPLAY */
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % feiras.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [feiras.length]);

  const feiraAtual = feiras[index];

  const visibleFeiras = [
    feiras[(index - 1 + feiras.length) % feiras.length],
    feiras[index],
    feiras[(index + 1) % feiras.length],
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      className="w-full lg:py-12 overflow-hidden"
      id="feiras"
    >
      {/* ================= TÍTULO ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex justify-center mb-10"
      >
        <h1 className="text-center text-white font-bold text-2xl xl:text-3xl w-4/5 lg:mb-16">
          {t('components.fair.title')}
        </h1>
      </motion.div>

      {/* ================= MOBILE / TABLET ================= */}
      <div className="xl:hidden">
        {/* IMAGEM PRINCIPAL */}
        <div className="flex justify-center px-4">
          <div className="relative w-full max-w-4xl h-[280px] sm:h-[380px] rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={feiraAtual.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={feiraAtual.image}
                  alt="Imagem da feira"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
                  <Image src={feiraAtual.logo} alt="Logo" width={120} height={120} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* THUMBNAILS */}
        <div className="mt-6 flex justify-center gap-3 px-4 overflow-x-auto">
          {feiras.map((feira, i) => (
            <motion.button
              key={feira.id}
              onClick={() => setIndex(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex-shrink-0
                w-[110px] h-[70px]
                rounded-lg overflow-hidden
                ${i === index ? "ring-2 ring-white" : ""}
              `}
            >
              <Image src={feira.image} alt="Thumbnail da feira" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Image src={feira.logo} alt="Logo" width={45} height={45} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden xl:flex items-center justify-center gap-6 px-4">
        {visibleFeiras.map((feira, i) => {
          const isCenter = i === 1;

          return (
            <motion.div
              key={feira.id}
              layout
              animate={{
                scale: isCenter ? 1.1 : 0.95,
                opacity: isCenter ? 1 : 0.7,
              }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 22,
              }}
              className={`relative rounded-xl overflow-hidden
                ${isCenter
                  ? "z-20 w-[440px] h-[420px]"
                  : "z-10 w-[400px] h-[380px]"
                }
              `}
            >
              <Image src={feira.image} alt="Imagem da feira" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/30" />

              <div className="absolute bottom-12 left-4 right-4 flex items-center justify-center">
                <Image src={feira.logo} alt="Logo" width={150} height={150} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}