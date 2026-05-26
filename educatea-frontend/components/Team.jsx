"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import Linkedin from "@/public/images/icons/Linkedin.webp";
import { useLanguage } from "@/context/LanguageContext";

import ArthurCidade from "@/public/images/team/ArthurCidade.webp"
import ArthurJuwer from "@/public/images/team/ArthurJuwer.webp"
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

  return (
    <motion.article
      variants={cardVariant}
      className="relative w-[288px] h-[310px] lg:w-[266px] lg:h-[300px] 2xl:w-[288px] 2xl:h-[320px] cursor-pointer [perspective:1200px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.85, ease: "easeInOut" }}
        className="relative w-full h-full [transform-style:preserve-3d]"
      >
        {/* ================= FRENTE ================= */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden bg-[#D9D9D9]">
          <Image
            src={pessoa.imagem}
            alt={pessoa.nome}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 288px, (max-width: 1536px) 266px, 288px"
          />

          {pessoa.linkedin && (
            <a
              href={pessoa.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="none bottom-0 right-4 z-10 rounded-full shadow hover:scale-110 transition"
            >
              <Image src={Linkedin} alt="LinkedIn" className="h-6 w-6" />
            </a>
          )}

          <label className="bg-[#242424] dark:bg-[#0033FF] text-white p-3 text-center font-bold w-full absolute bottom-0 rounded-bl-xl rounded-br-xl z-10">
            {pessoa.nome}
          </label>
        </div>

        {/* ================= VERSO ================= */}
        <div className="absolute inset-0 bg-[#0033FF] rounded-xl flex flex-col items-center justify-center gap-6 text-white [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <p className="font-bold text-lg text-center px-4">
            {pessoa.nome}
          </p>

          {pessoa.linkedin && (
            <a
              href={pessoa.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-[#0033FF] px-5 py-2 rounded-lg font-bold hover:scale-105 transition"
            >
              <Image src={Linkedin} alt="LinkedIn" className="h-6 w-6" />
              LinkedIn
            </a>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}

/* ================= COMPONENTE ================= */

export default function Team() {
  const { t } = useLanguage();

  return (
    <section
      id="equipe"
      className="flex flex-col gap-6 items-center justify-center dark:bg-zinc-800 text-white"
    >
      {/* TÍTULO */}
      <motion.h1
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-[#0033FF] text-center text-whiteuppercase font-bold p-3 px-6 w-full text-2xl lg:mb-10"
      >
        {t('components.team.title')}
      </motion.h1>

      <div className="lg:flex lg:flex-col lg:items-center lg:gap-14 w-full">

        {/* ================= DESENVOLVEDORES ================= */}
        <motion.div
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-12"
        >
          <h2 className="uppercase text-center font-bold text-3xl text-black dark:text-white">
            {t('components.team.developers')}
          </h2>

          <motion.div
            variants={gridVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center lg:flex-row gap-6 lg:gap-8"
          >
            {desenvolvedores.map((dev, index) => (
              <FlipCard key={index} pessoa={dev} />
            ))}
          </motion.div>
        </motion.div>

        {/* ================= ORIENTADORES ================= */}
        <motion.div
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-12 mb-12"
        >
          <h2 className="uppercase text-center font-bold text-3xl mt-6 lg:mt-0 text-black dark:text-white">
            {t('components.team.mentors')}
          </h2>

          <motion.div
            variants={gridVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8"
          >
            {orientadores.map((ori, index) => (
              <FlipCard key={index} pessoa={ori} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
