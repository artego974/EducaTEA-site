"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Calendar, Tag, Newspaper, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// ─────────────────────────────────────────────────────────────
//  ADICIONAR UMA NOVA NOTÍCIA:
//  1) Inclua um novo objeto no array `NOTICIAS_META` abaixo
//     (apenas dados não-traduzíveis: id, date, image).
//  2) Adicione o conteúdo textual em `pages.news.items.<id>` nos
//     arquivos locales/pt-br.js, locales/en-us.js e locales/es-es.js.
// ─────────────────────────────────────────────────────────────
const NOTICIAS_META = [
  {
    id: 1,
    date: "25/04/2026",
    image: "/images/banners/Linkedin.png",
  },
];

// ─────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function plainText(p) {
  return p.replace(/\{destaque:(.*?)\}/g, "$1");
}

function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

// Chaves usadas para `pages.news.sort_options.<key>` em translations.js
const SORT_KEYS = ["date_desc", "date_asc", "alpha_asc", "alpha_desc"];

function parseDate(str) {
  const [d, m, y] = str.split("/");
  return new Date(+y, +m - 1, +d);
}

function sortNoticias(list, order) {
  return [...list].sort((a, b) => {
    if (order === "date_desc") return parseDate(b.date) - parseDate(a.date);
    if (order === "date_asc")  return parseDate(a.date) - parseDate(b.date);
    if (order === "alpha_asc") return a.title.localeCompare(b.title);
    if (order === "alpha_desc")return b.title.localeCompare(a.title);
    return 0;
  });
}

export default function Noticias() {
  const { t } = useLanguage();
  const [hoveredId, setHoveredId]   = useState(null);
  const [sortOrder, setSortOrder]   = useState("date_desc");
  const [sortOpen, setSortOpen]     = useState(false);
  const dropdownRef                 = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Mescla meta (id, date, image) + conteúdo traduzido (de translations.js)
  const noticias = NOTICIAS_META.map((n) => {
    const content = t(`pages.news.items.${n.id}`);
    return {
      ...n,
      category: content?.category ?? "",
      title: content?.title ?? "",
      paragraphs: content?.paragraphs ?? [],
      imageCaption: content?.image_caption ?? "",
      imageSource: content?.image_source ?? "",
    };
  });

  const sorted = sortNoticias(noticias, sortOrder);
  const totalLabel = noticias.length === 1
    ? t('pages.news.count_one')
    : t('pages.news.count_other');
  const sortedLabel = sorted.length === 1
    ? t('pages.news.count_one')
    : t('pages.news.count_other');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative bg-[#1A3879] overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-[#F9AD18]/10 blur-3xl pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative max-w-7xl mx-auto px-6 pt-16 lg:pt-24 pb-24 lg:pb-32 flex flex-col gap-5 text-white"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 border border-white/20 px-3 py-1.5 rounded-full tracking-widest uppercase">
              <Newspaper size={11} />
              {t('pages.news.hero.badge')}
            </span>
            <span className="text-xs font-semibold text-[#F9AD18] bg-[#F9AD18]/15 border border-[#F9AD18]/30 px-3 py-1.5 rounded-full">
              {noticias.length} {totalLabel}
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-black leading-tight tracking-tight max-w-2xl">
            {t('pages.news.hero.title')}
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-white/60 max-w-lg leading-relaxed">
            {t('pages.news.hero.description')}
          </motion.p>
        </motion.div>
      </div>

      {/* ── FILTROS ──────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="-mt-6 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        >

          {/* ── MOBILE: dropdown ─────────────────────────────── */}
          <div className="sm:hidden flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500 px-1">
              {t('pages.news.filter_label')}
            </span>
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1" ref={dropdownRef}>
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-gray-50 dark:bg-zinc-700/60 border border-gray-200 dark:border-zinc-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-zinc-200 transition-colors"
              >
                <span className="flex items-center gap-2 truncate">
                  <SlidersHorizontal size={14} className="text-[#1A3879] dark:text-[#5b83d4] shrink-0" />
                  {t(`pages.news.sort_options.${sortOrder}`)}
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-gray-400 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {SORT_KEYS.map((key, i) => (
                      <button
                        key={key}
                        onClick={() => { setSortOrder(key); setSortOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors flex items-center justify-between
                          ${i > 0 ? "border-t border-gray-100 dark:border-zinc-700" : ""}
                          ${sortOrder === key
                            ? "bg-[#1A3879] text-white"
                            : "text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
                          }`}
                      >
                        {t(`pages.news.sort_options.${key}`)}
                        {sortOrder === key && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F9AD18] shrink-0" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500 shrink-0">
              {sorted.length} {sortedLabel}
            </span>
          </div>
          </div>

          {/* ── DESKTOP: pills ───────────────────────────────── */}
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-sm font-semibold text-gray-400 dark:text-zinc-500 mr-2">
              {t('pages.news.filter_label')}
            </span>
            {SORT_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => setSortOrder(key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  sortOrder === key
                    ? "bg-[#1A3879] text-white"
                    : "text-gray-500 dark:text-zinc-400 hover:text-[#1A3879] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-700"
                }`}
              >
                {t(`pages.news.sort_options.${key}`)}
              </button>
            ))}
          </div>

          <span className="hidden sm:block text-sm font-semibold text-gray-400 dark:text-zinc-500 shrink-0">
            {sorted.length} {sortedLabel}
          </span>

        </motion.div>
      </div>

      {/* ── CARDS ────────────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
        className="max-w-7xl mx-auto px-6 py-10 lg:py-16"
      >
        {sorted.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-zinc-500 text-lg py-24">
            {t('pages.news.empty')}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {chunk(sorted, 3).map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              variants={fadeUp}
              className="flex flex-col md:flex-row gap-4"
              style={{ height: "clamp(360px, 52vw, 580px)" }}
              onMouseLeave={() => setHoveredId(null)}
            >
            {row.map((noticia) => {
              const isHovered  = hoveredId === noticia.id;
              const anyHovered = hoveredId !== null;

              return (
                <div
                  key={noticia.id}
                  onMouseEnter={() => setHoveredId(noticia.id)}
                  className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ease-in-out"
                  style={{ flex: isHovered ? 4 : anyHovered ? 1 : 2, minWidth: 0 }}
                >
                  {/* Background */}
                  {noticia.image ? (
                    <Image
                      src={noticia.image}
                      alt={noticia.title}
                      fill
                      quality={90}
                      className="object-cover transition-transform duration-700"
                      style={{ transform: isHovered ? "scale(1.04)" : "scale(1)" }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#1A3879]" />
                  )}

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/92 via-black/35 to-transparent a11y-img" />

                  {/* Yellow accent bar at bottom on hover */}
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-[#F9AD18] transition-all duration-500"
                    style={{ width: isHovered ? "100%" : "0%" }}
                  />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 flex flex-col gap-2">

                    {/* Category pill — hover only */}
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: isHovered ? "40px" : "0px", opacity: isHovered ? 1 : 0 }}
                    >
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                        <Tag size={10} />
                        {noticia.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-white font-black leading-tight transition-all duration-300 line-clamp-3"
                      style={{ fontSize: isHovered ? "clamp(1.25rem, 2vw, 1.75rem)" : "clamp(0.875rem, 1.5vw, 1rem)" }}
                    >
                      {noticia.title}
                    </h3>

                    {/* Date — always visible */}
                    <div className="flex items-center gap-1.5 text-white/50 text-xs">
                      <Calendar size={11} />
                      {noticia.date}
                    </div>

                    {/* Excerpt — hover only */}
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: isHovered ? "120px" : "0px", opacity: isHovered ? 1 : 0 }}
                    >
                      <p className="text-white/65 text-sm leading-relaxed line-clamp-3 mt-1 border-t border-white/10 pt-3">
                        {plainText(noticia.paragraphs[0]).substring(0, 220)}…
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
            </motion.div>
            ))}
          </div>
        )}
      </motion.div>

    </div>
  );
}
