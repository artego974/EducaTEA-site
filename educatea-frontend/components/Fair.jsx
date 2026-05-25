"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

import Feira1 from "../public/images/feiras/Feira1.webp";
import Feira2 from "../public/images/feiras/Feira2.webp";
import Feira3 from "../public/images/feiras/Feira3.webp";
import Feira4 from "../public/images/feiras/Feira4.png";
import Feira5 from "../public/images/feiras/Feira5.webp";
import Feira6 from "../public/images/feiras/Feira6.webp";
import Feira7 from "../public/images/feiras/Feira7.webp";
import Feira8 from "../public/images/feiras/Feira8.webp";

import FeiraLogo1 from "../public/images/feiras/logo/FeiraLogo1.webp";
import FeiraLogo2 from "../public/images/feiras/logo/FeiraLogo2.webp";
import FeiraLogo3 from "../public/images/feiras/logo/FeiraLogo3.webp";
import FeiraLogo4 from "../public/images/feiras/logo/FeiraLogo4.webp";
import FeiraLogo5 from "../public/images/feiras/logo/FeiraLogo5.webp";
import FeiraLogo6 from "../public/images/feiras/logo/FeiraLogo6.webp";
import FeiraLogo7 from "../public/images/feiras/logo/FeiraLogo7.webp";
import FeiraLogo8 from "../public/images/feiras/logo/FeiraLogo8.webp";

const AUTOPLAY_MS = 5000;
const RESUME_DELAY_MS = 6000;

export default function Fair() {
  const { t } = useLanguage();

  const feiras = [
    { id: 1, image: Feira1, logo: FeiraLogo1, title: "Feira de Projetos SENAC RS" },
    { id: 2, image: Feira2, logo: FeiraLogo2, title: "Mostra Científica SENAC SL" },
    { id: 3, image: Feira3, logo: FeiraLogo3, title: "Mostra IFRS" },
    { id: 4, image: Feira4, logo: FeiraLogo4, title: "Feevale Inovamundi" },
    { id: 5, image: Feira5, logo: FeiraLogo5, title: "Desafio Liga Jovem" },
    { id: 6, image: Feira6, logo: FeiraLogo6, title: "MOCITEC IFSUL Charqueadas" },
    { id: 7, image: Feira7, logo: FeiraLogo7, title: "Tecnosinos" },
    { id: 8, image: Feira8, logo: FeiraLogo8, title: "Ensino Médio Senac" },
  ];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef(null);

  /* AUTOPLAY */
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % feiras.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [feiras.length, isPaused, index]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const goTo = (i) => {
    const next = ((i % feiras.length) + feiras.length) % feiras.length;
    setIndex(next);
    pauseAutoplay();
  };

  const pauseAutoplay = () => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setIsPaused(false), RESUME_DELAY_MS);
  };

  const handleDragEnd = (_, info) => {
    const threshold = 60;
    if (info.offset.x < -threshold) goTo(index + 1);
    else if (info.offset.x > threshold) goTo(index - 1);
  };

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
      viewport={{ once: true, margin: "400px 0px 400px 0px" }}
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
        {/* CARD PRINCIPAL */}
        <div className="relative px-6">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragStart={pauseAutoplay}
            onDragEnd={handleDragEnd}
            className="relative mx-auto w-full max-w-md aspect-4/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 cursor-grab active:cursor-grabbing touch-pan-y select-none"
          >
            {/* IMAGEM COM TRANSIÇÃO + KEN BURNS */}
            <AnimatePresence mode="wait">
              <motion.div
                key={feiraAtual.id}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.08 }}
                  transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                >
                  <Image
                    src={feiraAtual.image}
                    alt={feiraAtual.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 448px"
                    className="object-cover"
                    priority={index === 0}
                    placeholder="blur"
                    draggable={false}
                  />
                </motion.div>

                {/* GRADIENTE PARA LEGIBILIDADE */}
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/40 a11y-img" />
              </motion.div>
            </AnimatePresence>

            {/* BARRA DE PROGRESSO (TOPO) */}
            <div className="absolute top-0 left-0 right-0 flex gap-1.5 p-3 a11y-no-bg">
              {feiras.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden"
                >
                  {i === index && !isPaused && (
                    <motion.div
                      key={`bar-${index}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                      className="h-full bg-white rounded-full"
                    />
                  )}
                  {i < index && (
                    <div className="h-full w-full bg-white rounded-full" />
                  )}
                </div>
              ))}
            </div>

            {/* CONTADOR (CANTO SUPERIOR DIREITO) */}
            <div className="absolute top-6 right-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 a11y-no-bg">
              <span className="text-white text-xs font-medium tracking-wide tabular-nums">
                {String(index + 1).padStart(2, "0")}
                <span className="opacity-50 mx-1">/</span>
                {String(feiras.length).padStart(2, "0")}
              </span>
            </div>

            {/* INFO INFERIOR — LOGO + TÍTULO */}
            <div className="absolute bottom-0 left-0 right-0 p-5 a11y-no-bg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`info-${feiraAtual.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="flex items-center gap-3"
                >
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-black/95 backdrop-blur-sm flex items-center justify-center p-1.5 shadow-lg">
                    <Image
                      src={feiraAtual.logo}
                      alt="Logo"
                      width={48}
                      height={48}
                      className="object-contain max-w-full max-h-full"
                      draggable={false}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white/60 text-[10px] uppercase tracking-[0.18em] font-semibold mb-0.5">
                      {t('components.fair.title')}
                    </p>
                    <h3 className="text-white text-base font-bold leading-tight truncate">
                      {feiraAtual.title}
                    </h3>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* DOTS DE NAVEGAÇÃO */}
        <div className="mt-6 flex justify-center items-center gap-2 px-4">
          {feiras.map((feira, i) => (
            <button
              key={feira.id}
              onClick={() => goTo(i)}
              aria-label={`Ir para ${feira.title}`}
              className="group p-2 -m-1 cursor-pointer"
            >
              <motion.div
                animate={{
                  width: i === index ? 28 : 8,
                  backgroundColor: i === index ? "#ffffff" : "rgba(255,255,255,0.35)",
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="h-2 rounded-full"
              />
            </button>
          ))}
        </div>

        {/* DICA DE INTERAÇÃO */}
        <p className="mt-4 text-center text-white/40 text-xs font-medium tracking-wide">
          ← arraste para navegar →
        </p>
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
              <Image
                src={feira.image}
                alt="Imagem da feira"
                fill
                sizes="440px"
                placeholder="blur"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 a11y-img" />

              <div className="absolute bottom-12 left-4 right-4 flex items-center justify-center a11y-no-bg">
                <Image src={feira.logo} alt="Logo" width={150} height={150} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
