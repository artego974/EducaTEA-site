"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

function StatCard({ number, label, source, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center bg-[#1A3879]/5 dark:bg-white/5 rounded-2xl px-5 py-6 border border-[#1A3879]/10 dark:border-white/10"
    >
      <span className="text-3xl font-extrabold text-[#1A3879] dark:text-blue-400 leading-none">
        {number}
      </span>
      <span className="mt-2 text-sm text-gray-600 dark:text-gray-300 font-medium leading-snug">
        {label}
      </span>
      <span className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 font-normal italic">
        {source}
      </span>
    </motion.div>
  );
}

export default function TeaSection() {
  const { t } = useLanguage();
  const s = t("components.tea_section");

  return (
    <section
      id="sobre-tea"
      className="bg-white dark:bg-zinc-900 py-16 px-6 border-b border-gray-100 dark:border-zinc-800"
    >
      <div className="max-w-4xl mx-auto">

        {/* Eyebrow + title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="text-[11px] font-bold text-[#1A3879] dark:text-blue-400 uppercase tracking-widest">
            {s.eyebrow}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {s.title_part1}{" "}
            <span className="text-[#1A3879] dark:text-blue-400">{s.title_highlight}</span>
            {s.title_part2}
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-10 max-w-3xl"
        >
          {s.description}
        </motion.p>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard number={s.stat1_number} label={s.stat1_label} source={s.stat1_source} delay={0.15} />
          <StatCard number={s.stat2_number} label={s.stat2_label} source={s.stat2_source} delay={0.25} />
          <StatCard number={s.stat3_number} label={s.stat3_label} source={s.stat3_source} delay={0.35} />
        </div>

        {/* Citations */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-l-2 border-[#1A3879]/20 dark:border-blue-400/20 pl-4 space-y-1.5"
        >
          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
            {s.citations_label}
          </p>
          {s.citations.map((cite, i) => (
            <p key={i} className="text-xs text-gray-400 dark:text-gray-500 italic leading-snug">
              {cite}
            </p>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
