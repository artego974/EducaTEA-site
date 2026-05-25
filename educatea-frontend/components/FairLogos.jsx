"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import FeiraLogo1 from "../public/images/feiras/logo/FeiraLogo1.webp";
import FeiraLogo2 from "../public/images/feiras/logo/FeiraLogo2.webp";
import FeiraLogo3 from "../public/images/feiras/logo/FeiraLogo3.webp";
import FeiraLogo4 from "../public/images/feiras/logo/FeiraLogo4.webp";
import FeiraLogo5 from "../public/images/feiras/logo/FeiraLogo5.webp";
import FeiraLogo6 from "../public/images/feiras/logo/FeiraLogo6.webp";
import FeiraLogo7 from "../public/images/feiras/logo/FeiraLogo7.webp";
import FeiraLogo8 from "../public/images/feiras/logo/FeiraLogo8.webp";

export default function FairLogos() {
  const feiras = [
    { id: 1, logo: FeiraLogo1, title: "Feira de Projetos SENAC RS" },
    { id: 2, logo: FeiraLogo2, title: "Mostra IFRS" },
    { id: 3, logo: FeiraLogo3, title: "Mostra Científica" },
    { id: 4, logo: FeiraLogo4, title: "Feevale Inovamundi" },
    { id: 5, logo: FeiraLogo5, title: "MOCITEC IFSUL Charqueadas" },
    { id: 6, logo: FeiraLogo6, title: "Desafio Liga Jovem" },
    { id: 7, logo: FeiraLogo7, title: "Ensino Médio Senac" },
    { id: 8, logo: FeiraLogo8, title: "Tecnosinos" },
  ];

  const loopFeiras = [
    ...feiras.map((f) => ({ ...f, key: `a-${f.id}` })),
    ...feiras.map((f) => ({ ...f, key: `b-${f.id}` })),
    ...feiras.map((f) => ({ ...f, key: `c-${f.id}` })),
  ];

  return (
    <div className="w-full overflow-hidden py-2 sm:py-6">
      <motion.div
        className="flex gap-8 sm:gap-20 w-max"
        animate={{ x: ["0%", "-66.6667%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 25,
          ease: "linear",
        }}
      >
        {loopFeiras.map((feira) => (
          <div
            key={feira.key}
            className="min-w-[90px] sm:min-w-[160px] h-[55px] sm:h-[100px] flex items-center justify-center"
          >
            <Image
              src={feira.logo}
              alt={feira.title}
              width={200}
              height={140}
              className="object-contain max-h-full w-auto"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
