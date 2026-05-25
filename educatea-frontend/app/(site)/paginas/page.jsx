"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const PAGES = [
  { name: "PÁGINA INICIAL",  href: "/",                   avatar: "/images/avatars/avatar01.png", color: "#E53935" },
  { name: "COMUNIDADE",      href: "/comunidade",          avatar: "/images/avatars/avatar02.png", color: "#F9AD18" },
  { name: "NOTÍCIAS",        href: "/noticias",            avatar: "/images/avatars/avatar03.png", color: "#1A3879" },
  { name: "O QUE É O TEA?",  href: "/tea",                 avatar: "/images/avatars/avatar04.png", color: "#16A34A" },
  { name: "MATERIAIS",       href: "/materiais-baixados",  avatar: "/images/avatars/avatar05.png", color: "#7C3AED" },
  { name: "MEUS POSTS",      href: "/meus-posts",          avatar: "/images/avatars/avatar06.png", color: "#0EA5E9" },
  { name: "MEUS SALVOS",     href: "/meus-salvos",         avatar: "/images/avatars/avatar07.png", color: "#DB2777" },
  { name: "PERFIL",          href: "/perfil",              avatar: "/images/avatars/avatar08.png", color: "#0F766E" },
  { name: "CONFIGURAÇÕES",   href: "/configuracoes",       avatar: "/images/avatars/avatar09.png", color: "#475569" },
  { name: "PRIVACIDADE",     href: "/privacidade",         avatar: "/images/avatars/avatar01.png", color: "#1A3879" },
  { name: "TERMOS",          href: "/termos",              avatar: "/images/avatars/avatar02.png", color: "#E53935" },
  { name: "COOKIES",         href: "/cookies",             avatar: "/images/avatars/avatar03.png", color: "#F9AD18" },
];

function PageCard({ page, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay: (index % 2) * 0.08 }}
      className="relative"
    >
      <Link
        href={page.href}
        className="group relative flex items-center gap-4 sm:gap-6 rounded-[2.5rem] pl-3 pr-8 sm:pr-12 py-3 sm:py-4 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] overflow-hidden cursor-pointer"
        style={{ backgroundColor: page.color }}
      >
        {/* Avatar */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 shrink-0 flex items-center justify-center">
          <Image
            src={page.avatar}
            alt={page.name}
            width={120}
            height={120}
            className="object-contain w-full h-full"
          />
        </div>

        {/* Title */}
        <span className="text-white font-black uppercase tracking-tight text-2xl lg:text-3xl leading-none drop-shadow-sm flex-1">
          {page.name}
        </span>

        {/* Subtle hover sheen */}
        <span className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-white/0 group-hover:bg-white/5 transition-colors" />
      </Link>

      {/* Number badge */}
      <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-base sm:text-lg shadow-md ring-4 ring-white dark:ring-zinc-900">
        {index + 1}.
      </div>
    </motion.div>
  );
}

export default function MaisPaginas() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors">
      {/* ── HERO ───────────────────────────────────────────── */}
      <div className="relative bg-[#1A3879] overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-[#F9AD18]/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 lg:pt-24 pb-16 lg:pb-24 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight"
          >
            Mais Páginas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
            className="text-base sm:text-lg text-white/60 max-w-xl mt-3 leading-relaxed"
          >
            Explore todas as áreas do EducaTEA em um só lugar.
          </motion.p>
        </div>
      </div>

      {/* ── GRID ───────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {PAGES.map((page, i) => (
            <PageCard key={page.href} page={page} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
