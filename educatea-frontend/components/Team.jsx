"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import Linkedin from "@/public/images/icons/Linkedin.webp";
import { useLanguage } from "@/context/LanguageContext";

import ArthurCidade from "@/public/images/team/ArthurCidade.webp"
import ArthurJuwer from "@/public/images/team/ArthurJuwer.webp"
import AthosFelipe from "@/public/images/team/AthosFelipe.webp"
import Elisangela from "@/public/images/team/Elisangela.webp"
import Gabriele from "@/public/images/team/Gabriele.webp"
import GabrielMoraes from "@/public/images/team/GabrielMoraes.webp"

/* ================= DADOS (Nomes Próprios mantidos fixos) ================= */
const desenvolvedores = [
  {
    nome: "Arthur Cidade Matjjie",
    imagem: ArthurCidade,
    linkedin: "https://www.linkedin.com/in/arthur-cidade-mattjie/",
  },
  {
    nome: "Arthur Juwer Rambo",
    imagem: ArthurJuwer,
    linkedin: "https://www.linkedin.com/in/arthurjuwer/",
  },
  {
    nome: "Athos Felipe Souza",
    imagem: AthosFelipe,
    linkedin: "https://www.linkedin.com/in/athos-souza-020a69343/",
  },
];

const orientadores = [
  {
    nome: "Elisangela Gisele",
    imagem: Elisangela,
    linkedin: "",
  },
  {
    nome: "Gabriel Moraes",
    imagem: GabrielMoraes,
    linkedin: "https://www.linkedin.com/in/gabrielmdo/",
  },
  {
    nome: "Gabriele de Oliveira",
    imagem: Gabriele,
    linkedin: "https://www.linkedin.com/in/gabriele-alves-8804b014a/",
  },
];

/* ================= VARIANTS ================= */

const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const gridVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

/* ================= FLIP CARD ================= */

function FlipCard({ pessoa }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const leaveTimeout = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(leaveTimeout.current);
    setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    leaveTimeout.current = setTimeout(() => {
      setIsFlipped(false);
    }, 300);
  };

  const handleTouch = (e) => {
    if (e.target.closest("a")) return;
    e.preventDefault();
    setIsFlipped((prev) => !prev);
  };

  return (
    <motion.article
      variants={cardVariant}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="relative w-[260px] h-[340px] 2xl:w-[288px] 2xl:h-[370px] cursor-pointer [perspective:1200px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleTouch}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.85, ease: "easeInOut" }}
        className="relative w-full h-full [transform-style:preserve-3d]"
      >
        {/* ================= FRENTE ================= */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl overflow-hidden bg-zinc-300 dark:bg-zinc-700 ring-1 ring-black/5 dark:ring-white/10 shadow-xl shadow-black/10 dark:shadow-black/40">
          <Image
            src={pessoa.imagem}
            alt={pessoa.nome}
            fill
            className="object-cover"
            sizes="(max-width: 1536px) 260px, 288px"
          />

          {/* gradiente para legibilidade */}
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${
              isFlipped ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Badge LinkedIn (indicador de interação) */}
          {pessoa.linkedin && (
            <div
              className={`absolute top-0 right-0 transition-opacity duration-500 ${
                isFlipped ? "opacity-0" : "opacity-100"
              }`}
            >
              <span
                aria-hidden
                className="absolute inset-0 rounded-bl-2xl bg-[#0033FF]/40 animate-ping [animation-duration:7s]"
              />
              <div className="relative flex items-center justify-center size-12">
                <Image src={Linkedin} alt="LinkedIn" className="h-6 w-6" />
              </div>
            </div>
          )}

          {/* Bloco de nome */}
          <div
            className={`absolute inset-x-0 bottom-0 px-5 pb-5 pt-8 transition-opacity duration-500 ${
              isFlipped ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="block h-0.5 w-8 bg-[#0033FF] rounded-full mb-2.5" aria-hidden />
            <p className="font-bold text-white text-lg leading-tight drop-shadow">
              {pessoa.nome}
            </p>
          </div>
        </div>

        {/* ================= VERSO ================= */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-6 text-white [transform:rotateY(180deg)] [backface-visibility:hidden] bg-gradient-to-br from-[#0033FF] to-[#1A3879] ring-1 ring-white/10 shadow-xl shadow-black/20">
          {/* Padrão decorativo sutil */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-12 -left-10 h-44 w-44 rounded-full bg-white/5 blur-2xl"
          />

          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/70">
            EducaTEA
          </span>

          <p className="font-bold text-xl text-center px-6 leading-tight">
            {pessoa.nome}
          </p>

          {pessoa.linkedin ? (
            <a
              href={pessoa.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onTouchEnd={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 flex items-center gap-2 bg-white text-[#0033FF] px-6 py-2.5 rounded-full font-bold hover:scale-105 transition shadow-lg shadow-black/20"
            >
              <Image src={Linkedin} alt="LinkedIn" className="h-5 w-5" />
              LinkedIn
            </a>
          ) : (
            <span className="text-white/60 text-[11px] uppercase tracking-widest font-semibold">
              —
            </span>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}

/* ================= TEAM SECTION ================= */

function TeamGroup({ label, people }) {
  return (
    <motion.div
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="flex flex-col items-center gap-8 lg:gap-10 w-full"
    >
      <h2 className="uppercase text-center font-bold text-2xl lg:text-3xl text-black dark:text-white">
        {label}
      </h2>

      <motion.div
        variants={gridVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="flex flex-col lg:flex-row items-center justify-center gap-8 2xl:gap-10"
      >
        {people.map((p, idx) => (
          <FlipCard key={idx} pessoa={p} />
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ================= COMPONENTE ================= */

export default function Team() {
  const { t } = useLanguage();

  return (
    <section
      id="equipe"
      className="flex flex-col gap-6 items-center justify-center bg-white dark:bg-zinc-800"
    >
      {/* ================= TÍTULO PRINCIPAL ================= */}
      <motion.h1
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-[#0033FF] text-center text-white uppercase font-bold p-3 px-6 w-full text-2xl lg:mb-10"
      >
        {t('components.team.title')}
      </motion.h1>

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10 lg:gap-16 px-6 pb-12 lg:pb-20 w-full">
        <TeamGroup
          label={t('components.team.developers')}
          people={desenvolvedores}
        />
        <TeamGroup
          label={t('components.team.mentors')}
          people={orientadores}
        />
      </div>
    </section>
  );
}
