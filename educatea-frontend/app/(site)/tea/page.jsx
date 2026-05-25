"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

// Caminhos de assets (não traduzíveis) — pareados por índice com os arrays
// `pages.tea.characteristics.items` e `pages.tea.stats.items` em translations.js
const CHARACTERISTIC_AVATARS = [
  "/images/avatars/avatar01.png",
  "/images/avatars/avatar02.png",
  "/images/avatars/avatar05.png",
  "/images/avatars/avatar06.png",
];

const STAT_FLAGS = [
  "/images/languages/US.webp",
  "/images/languages/BR.webp",
  "/images/languages/BR.webp",
];

function ToggleBtn({ isOpen, dark = false }) {
  return (
    <div
      className={`shrink-0 mt-1 size-7 flex items-center justify-center rounded-md transition-colors ${
        dark
          ? "bg-white/15 hover:bg-white/25"
          : "bg-[#1A3879] dark:bg-blue-700 hover:bg-[#0033FF]"
      }`}
    >
      {isOpen ? (
        <Minus size={14} className="text-white" />
      ) : (
        <Plus size={14} className="text-white" />
      )}
    </div>
  );
}

function CollapsibleSection({ id, sectionClass, header, children, dark = false, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const toggle = () => setIsOpen((v) => !v);

  return (
    <section
      id={id}
      className={`${sectionClass} transition-all duration-300 ${
        !isOpen
          ? dark
            ? "shadow-lg shadow-black/25 border-b border-white/10"
            : "shadow-md shadow-black/8 border-b border-gray-200 dark:border-zinc-700"
          : ""
      }`}
    >
      {header(isOpen, toggle)}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-500 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

export default function TEA() {
  const { t } = useLanguage();

  // Conteúdo traduzido vindo de translations.js (ver `pages.tea.*`)
  const characteristics = t('pages.tea.characteristics.items');
  const spectrumBars = t('pages.tea.spectrum.bars');
  const stats = t('pages.tea.stats.items');
  const diagnosisSteps = t('pages.tea.diagnosis.steps');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="bg-[#1A3879] dark:bg-[#1A3879] flex items-center justify-center py-16 lg:py-24 px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-7xl flex flex-col gap-5 text-white w-full"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold opacity-80 tracking-widest uppercase"
          >
            {t('pages.tea.hero.eyebrow')}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-5xl lg:text-7xl font-black leading-tight tracking-tight lg:w-3/4"
          >
            {t('pages.tea.hero.title')}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg lg:text-xl opacity-75 max-w-2xl leading-relaxed"
          >
            {t('pages.tea.hero.description')}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-1">
            <Link
              href="/comunidade"
              className="bg-white text-[#1A3879] px-8 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              {t('pages.tea.hero.cta_community')} <ChevronRight size={16} />
            </Link>
            <a
              href="#o-que-e"
              className="border border-white/40 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-white/10 transition-colors"
            >
              {t('pages.tea.hero.cta_more')}
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ── O QUE É ──────────────────────────────────────────── */}
      <CollapsibleSection
        id="o-que-e"
        sectionClass="bg-white dark:bg-zinc-900 px-6"
        header={(isOpen, toggle) => (
          <div
            className={`max-w-7xl mx-auto cursor-pointer transition-all duration-300 ${
              isOpen ? "pt-16 lg:pt-24 pb-6" : "py-5"
            }`}
            onClick={toggle}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-[#1A3879] dark:text-blue-400 tracking-widest uppercase">
                  {t('pages.tea.what_is.eyebrow')}
                </p>
                <h2 className={`font-black text-gray-900 dark:text-white leading-tight transition-all duration-300 ${
                  isOpen ? "text-3xl lg:text-5xl" : "text-xl lg:text-2xl"
                }`}>
                  {t('pages.tea.what_is.title')}
                </h2>
              </div>
              <ToggleBtn isOpen={isOpen} />
            </div>
          </div>
        )}
      >
        <div className="max-w-7xl mx-auto pb-16 lg:pb-24 flex flex-col gap-6">
          <div className="h-1 w-16 bg-[#F9AD18] rounded-full" />
          <p className="text-gray-600 dark:text-zinc-400 text-lg leading-relaxed text-justify">
            {t('pages.tea.what_is.paragraph1_prefix')}
            <span className="font-bold text-[#1A3879] dark:text-blue-300">
              {t('pages.tea.what_is.highlight')}
            </span>
            {t('pages.tea.what_is.paragraph1_suffix')}
          </p>
          <p className="text-gray-600 dark:text-zinc-400 text-lg leading-relaxed text-justify">
            {t('pages.tea.what_is.paragraph2')}
          </p>
        </div>
      </CollapsibleSection>

      {/* ── CARACTERÍSTICAS ───────────────────────────────────── */}
      <CollapsibleSection
        sectionClass="bg-gray-50 dark:bg-zinc-900 px-6"
        header={(isOpen, toggle) => (
          <div
            className={`max-w-7xl mx-auto cursor-pointer transition-all duration-300 ${
              isOpen ? "pt-10 lg:pt-14 pb-6" : "py-5"
            }`}
            onClick={toggle}
          >
            <div className={`relative transition-all duration-300 ${isOpen ? "flex flex-col items-center text-center gap-1.5" : "flex items-center justify-between gap-4"}`}>
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-[#1A3879] dark:text-blue-400 tracking-widest uppercase">
                  {t('pages.tea.characteristics.eyebrow')}
                </p>
                <h2 className={`font-black text-gray-900 dark:text-white leading-tight transition-all duration-300 ${
                  isOpen ? "text-3xl lg:text-5xl mb-16" : "text-xl lg:text-2xl"
                }`}>
                  {t('pages.tea.characteristics.title')}
                </h2>
              </div>
              <div className={isOpen ? "absolute right-0 top-0" : ""}>
                <ToggleBtn isOpen={isOpen} />
              </div>
            </div>
          </div>
        )}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-20 lg:pb-28"
        >
          {characteristics.map(({ title, text }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="flex flex-col items-center text-center gap-4"
            >
              <Image
                src={CHARACTERISTIC_AVATARS[i]}
                alt={title}
                width={96}
                height={96}
                className="rounded-full object-cover w-24 h-24 shrink-0"
              />
              <div className="flex flex-col items-center gap-1.5">
                <h3 className="text-[#F9AD18] font-bold text-xl">{title}</h3>
                <div className="h-0.5 w-10 bg-[#F9AD18] rounded-full" />
              </div>
              <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </CollapsibleSection>

      {/* ── ESPECTRO ─────────────────────────────────────────── */}
      <CollapsibleSection
        sectionClass="bg-white dark:bg-zinc-900 px-6"
        header={(isOpen, toggle) => (
          <div
            className={`max-w-7xl mx-auto cursor-pointer transition-all duration-300 ${
              isOpen ? "pt-10 lg:pt-14 pb-6" : "py-5"
            }`}
            onClick={toggle}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-[#1A3879] dark:text-blue-400 tracking-widest uppercase">
                  {t('pages.tea.spectrum.eyebrow')}
                </p>
                <h2 className={`font-black text-gray-900 dark:text-white leading-tight transition-all duration-300 ${
                  isOpen ? "text-3xl lg:text-5xl mb-8" : "text-xl lg:text-2xl"
                }`}>
                  {t('pages.tea.spectrum.title')}
                </h2>
              </div>
              <ToggleBtn isOpen={isOpen} />
            </div>
          </div>
        )}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start pb-20 lg:pb-28"
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-4 text-gray-600 dark:text-zinc-400 leading-relaxed">
            <p>{t('pages.tea.spectrum.paragraph1')}</p>
            <p>{t('pages.tea.spectrum.paragraph2')}</p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-5">
            {spectrumBars.map(({ label, pct }, i) => (
              <div key={label} className="group flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 group-hover:text-[#1A3879] dark:group-hover:text-blue-400 transition-colors">
                    {label}
                  </span>
                  <span className="text-xs font-mono text-gray-400 dark:text-zinc-500">
                    {pct}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: pct }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 * i }}
                    className="h-full bg-linear-to-r from-[#1A3879] to-[#0033FF] rounded-full"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </CollapsibleSection>

      {/* ── ESTATÍSTICAS ─────────────────────────────────────── */}
      <CollapsibleSection
        sectionClass="relative bg-[#1A3879] overflow-hidden"
        dark
        header={(isOpen, toggle) => (
          <div
            className={`px-6 cursor-pointer transition-all duration-300 ${
              isOpen ? "pt-20 lg:pt-28 pb-6" : "py-5"
            }`}
            onClick={toggle}
          >
            <div className={`max-w-7xl mx-auto relative transition-all duration-300 ${isOpen ? "flex flex-col items-center text-center gap-1.5" : "flex items-center justify-between gap-4"}`}>
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-white/60 tracking-widest uppercase">
                  {t('pages.tea.stats.eyebrow')}
                </p>
                <h2 className={`font-black text-white leading-tight transition-all duration-300 ${
                  isOpen ? "text-3xl lg:text-5xl mb-8" : "text-xl lg:text-2xl"
                }`}>
                  {t('pages.tea.stats.title')}
                </h2>
              </div>
              <div className={isOpen ? "absolute right-0 top-0" : ""}>
                <ToggleBtn isOpen={isOpen} dark />
              </div>
            </div>
          </div>
        )}
      >
        <div className="relative pb-20 lg:pb-28 px-6">
          <div className="absolute -top-32 -right-32 w-xl h-144 rounded-full bg-[#0033FF]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <p className="absolute inset-0 flex items-center justify-center text-[20rem] font-black text-white/3 leading-none select-none pointer-events-none overflow-hidden">
            N°
          </p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="relative max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {stats.map(({ number, label, sub }, i) => (
              <motion.div
                key={number}
                variants={fadeUp}
                className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-white text-center flex flex-col gap-3 hover:bg-white/18 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-[60px] h-[60px]">
                  <Image
                    src={STAT_FLAGS[i]}
                    alt={t('pages.tea.stats.flag_alt')}
                    width={120}
                    height={120}
                    quality={100}
                    className="absolute top-0 right-0 w-full h-full object-cover"
                    style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                  />
                </div>
                <p className="text-6xl font-black tracking-tight group-hover:scale-105 transition-transform duration-300 origin-center">
                  {number}
                </p>
                <p className="font-semibold text-base leading-snug text-white/90">{label}</p>
                <p className="text-sm text-white/50 leading-relaxed">{sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </CollapsibleSection>

      {/* ── DIAGNÓSTICO ──────────────────────────────────────── */}
      <CollapsibleSection
        sectionClass="bg-gray-50 dark:bg-zinc-900 px-6"
        header={(isOpen, toggle) => (
          <div
            className={`max-w-7xl mx-auto cursor-pointer transition-all duration-300 ${
              isOpen ? "pt-20 lg:pt-28 pb-6" : "py-5"
            }`}
            onClick={toggle}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-[#1A3879] dark:text-blue-400 tracking-widest uppercase">
                  {t('pages.tea.diagnosis.eyebrow')}
                </p>
                <h2 className={`font-black text-gray-900 dark:text-white leading-tight transition-all duration-300 ${
                  isOpen ? "text-3xl lg:text-5xl" : "text-xl lg:text-2xl"
                }`}>
                  {t('pages.tea.diagnosis.title')}
                </h2>
              </div>
              <ToggleBtn isOpen={isOpen} />
            </div>
          </div>
        )}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-7xl mx-auto flex flex-col gap-12"
        >
          <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            {t('pages.tea.diagnosis.intro')}
          </motion.p>

          <div className="flex flex-col">
            {diagnosisSteps.map(({ step, title, text }, i) => (
              <motion.div
                key={step}
                variants={fadeUp}
                className="flex gap-6 md:gap-10 group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#1A3879] text-white flex items-center justify-center font-black text-sm shrink-0 group-hover:bg-[#0033FF] transition-colors duration-300">
                    {step}
                  </div>
                  {i < diagnosisSteps.length - 1 && (
                    <div className="w-px flex-1 min-h-12 bg-gray-200 dark:bg-zinc-700 mt-2" />
                  )}
                </div>
                <div className="pb-12 flex flex-col gap-2 flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#1A3879] dark:group-hover:text-blue-400 transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-gray-600 dark:text-zinc-400 leading-relaxed">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </CollapsibleSection>

      {/* ── RECURSOS ─────────────────────────────────────────── */}
      <CollapsibleSection
        sectionClass="bg-white dark:bg-zinc-900 px-6"
        header={(isOpen, toggle) => (
          <div
            className={`max-w-7xl mx-auto cursor-pointer transition-all duration-300 ${
              isOpen ? "pt-10 lg:pt-14 pb-6" : "py-5"
            }`}
            onClick={toggle}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-[#1A3879] dark:text-blue-400 tracking-widest uppercase">
                  {t('pages.tea.resources.eyebrow')}
                </p>
                <h2 className={`font-black text-gray-900 dark:text-white leading-tight transition-all duration-300 ${
                  isOpen ? "text-3xl lg:text-5xl" : "text-xl lg:text-2xl"
                }`}>
                  {t('pages.tea.resources.title')}
                </h2>
              </div>
              <ToggleBtn isOpen={isOpen} />
            </div>
          </div>
        )}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-7xl mx-auto pb-20 lg:pb-28 flex flex-col gap-12"
        >
          <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            {t('pages.tea.resources.intro')}
          </motion.p>

          <motion.div variants={fadeUp} className="w-full">
            <div className="w-full h-64 lg:h-[30rem] rounded-2xl bg-gray-100 dark:bg-zinc-700 border-2 border-dashed border-[#1A3879] dark:border-blue-400" />
          </motion.div>
        </motion.div>
      </CollapsibleSection>

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <CollapsibleSection
        sectionClass="relative bg-linear-to-br from-[#1A3879] via-[#0D2F80] to-[#0033FF] overflow-hidden"
        dark
        defaultOpen={false}
        header={(isOpen, toggle) => (
          <div
            className={`px-6 cursor-pointer transition-all duration-300 ${
              isOpen ? "pt-20 lg:pt-28 pb-6" : "py-5"
            }`}
            onClick={toggle}
          >
            <div className={`max-w-7xl mx-auto relative transition-all duration-300 ${isOpen ? "flex flex-col items-center text-center gap-1.5" : "flex items-center justify-between gap-4"}`}>
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-white/60 tracking-widest uppercase">
                  {t('pages.tea.cta.eyebrow')}
                </p>
                <h2 className={`font-black text-white leading-tight transition-all duration-300 ${
                  isOpen ? "text-3xl lg:text-5xl" : "text-xl lg:text-2xl"
                }`}>
                  {t('pages.tea.cta.title')}
                </h2>
              </div>
              <div className={isOpen ? "absolute right-0 top-0" : ""}>
                <ToggleBtn isOpen={isOpen} dark />
              </div>
            </div>
          </div>
        )}
      >
        <div className="relative px-6 pb-20 lg:pb-28">
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#0033FF]/30 blur-3xl pointer-events-none" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="relative max-w-7xl mx-auto flex flex-col items-center text-center gap-8"
          >
            <motion.p variants={fadeUp} className="text-lg text-white/65 max-w-xl mx-auto leading-relaxed">
              {t('pages.tea.cta.text')}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/comunidade"
                className="bg-white text-[#1A3879] px-10 py-3 rounded-full font-bold text-base hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-xl shadow-black/25"
              >
                {t('pages.tea.cta.cta_community')} <ChevronRight size={18} />
              </Link>
              <Link
                href="/noticias"
                className="border-2 border-white/25 text-white px-10 py-3 rounded-full font-bold text-base hover:bg-white/10 transition-colors"
              >
                {t('pages.tea.cta.cta_news')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
