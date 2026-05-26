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

export default function FairLogos() {
  const feiras = [
    { id: 1, logo: FeiraLogo1, title: "Feira de Projetos SENAC RS" },
    { id: 2, logo: FeiraLogo2, title: "Mostra IFRS" },
    { id: 3, logo: FeiraLogo3, title: "Mostra Científica" },
    { id: 4, logo: FeiraLogo4, title: "Feevale Inovamundi" },
    { id: 5, logo: FeiraLogo5, title: "MOCITEC IFSUL Charqueadas" },
    { id: 6, logo: FeiraLogo6, title: "Desafio Liga Jovem" },
  ];

  return (
    <div className="w-full overflow-hidden py-6">
      <motion.div
        className="flex gap-20 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: typeof window !== "undefined" && window.innerWidth < 640 ? 20 : 30,
          ease: "linear",
        }}
      >
        {/* lista original */}
        {feiras.map((feira) => (
          <div
            key={feira.id}
            className="min-w-[160px] h-[100px] flex items-center justify-center"
          >
            <Image
              src={feira.logo}
              alt={feira.title}
              width={200}
              height={140}
              className="object-contain"
            />
          </div>
        ))}

        {/* lista duplicada para loop infinito */}
        {feiras.map((feira) => (
          <div
            key={`dup-${feira.id}`}
            className="min-w-[160px] h-[100px] flex items-center justify-center"
          >
            <Image
              src={feira.logo}
              alt={feira.title}
              width={200}
              height={140}
              className="object-contain"
            />
          </div>
        ))}
        {feiras.map((feira) => (
          <div
            key={`dup-${feira.id}`}
            className="min-w-[160px] h-[100px] flex items-center justify-center"
          >
            <Image
              src={feira.logo}
              alt={feira.title}
              width={200}
              height={140}
              className="object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
