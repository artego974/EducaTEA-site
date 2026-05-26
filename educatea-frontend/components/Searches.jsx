"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
// Importações do Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Radar } from "react-chartjs-2";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

import CientificoImg from "../public/images/searches/Projeto de Pesquisa - EducaTEA.docx.pdf 1.png";

const imageMap = {
  cientifico: CientificoImg,
  pitch: CientificoImg,
};

// Mapa de arquivos para download
const fileMap = {
  cientifico: "/images/documents/Projeto de Pesquisa - EducaTEA.docx.pdf",
  pitch: "/images/documents/Pitch - EducaTEA 04_26.pdf", // Atualizado com o novo arquivo
};

export default function Searches() {
  const [active, setActive] = useState("cientifico");
  const { t } = useLanguage();

  // --- CONFIGURAÇÃO DOS GRÁFICOS ---

  // 1. Gráfico de Barras: Benchmark (Comparativo)
  const barData = {
    labels: ["EducaTEA", "Média de Mercado"],
    datasets: [
      {
        label: "Score SUS",
        data: [86.25, 68],
        backgroundColor: ["rgba(46, 204, 113, 0.8)", "rgba(231, 76, 60, 0.8)"],
        borderColor: ["rgba(46, 204, 113, 1)", "rgba(231, 76, 60, 1)"],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Performance vs Indústria",
        color: "#ffffff",
        font: { size: 14, weight: "bold" },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ctx.raw + " pontos",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: "#cccccc" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      x: {
        ticks: { color: "#ffffff", font: { weight: "bold" } },
        grid: { display: false },
      },
    },
  };

  // 2. Gráfico de Rosca: Porcentagem de Aprovação
  const doughnutData = {
    labels: ["Excelente (75%)", "Bom (17%)", "OK (8%)"],
    datasets: [
      {
        data: [75, 16.7, 8.3],
        backgroundColor: [
          "rgba(46, 204, 113, 0.8)",
          "rgba(52, 152, 219, 0.8)",
          "rgba(241, 196, 15, 0.8)",
        ],
        borderColor: [
          "rgba(46, 204, 113, 1)",
          "rgba(52, 152, 219, 1)",
          "rgba(241, 196, 15, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#ffffff", font: { size: 11 } },
      },
      title: {
        display: true,
        text: "Classificação dos Professores",
        color: "#ffffff",
        font: { size: 14, weight: "bold" },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ctx.raw + "% dos professores",
        },
      },
    },
  };

  // 3. Gráfico Radar: Detalhes de Usabilidade
  const radarData = {
    labels: [
      "Facilidade",
      "Aprendizado",
      "Frequência",
      "Consistência",
      "Confiança",
      "Integração",
    ],
    datasets: [
      {
        label: "EducaTEA",
        data: [95.8, 93.7, 93.7, 89.5, 87.5, 83.3],
        backgroundColor: "rgba(46, 204, 113, 0.2)",
        borderColor: "#2ecc71",
        pointBackgroundColor: "#2ecc71",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#2ecc71",
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Pontos Fortes (Detalhado)",
        color: "#ffffff",
        font: { size: 14, weight: "bold" },
      },
    },
    scales: {
      r: {
        angleLines: { color: "rgba(255, 255, 255, 0.2)" },
        grid: { color: "rgba(255, 255, 255, 0.2)" },
        pointLabels: {
          color: "#ffffff",
          font: { size: 11, weight: "bold" },
        },
        ticks: { display: false, backdropColor: "transparent" },
        suggestedMin: 50,
        suggestedMax: 100,
      },
    },
  };

  // Conteúdo dinâmico
  const content = {
    title: t(`components.searches.${active}.title`),
    text: t(`components.searches.${active}.text`),
    image: imageMap[active],
    file: fileMap[active], // Mapeamento dinâmico do arquivo
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="w-full flex justify-center px-4 sm:px-6"
      id="trabalhos"
    >
      <div className="w-full max-w-7xl flex flex-col items-center gap-12 sm:gap-16">

        {/* ================= MAIN CONTENT AREA ================= */}
        <div className="w-full min-h-[520px] sm:min-h-[600px] flex items-center justify-center">
          <AnimatePresence mode="wait">

            {active === "resultados" ? (
              /* ===== ABA: RESULTADOS (3 GRÁFICOS) ===== */
              <motion.div
                key="resultados"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col items-center gap-6 text-white"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
                  {content.title}
                </h1>
                <p className="text-center text-gray-300 max-w-3xl mb-4 text-sm sm:text-base">
                  Resultados da validação com docentes da rede básica e profissionalizante da instituição Senac São Leopoldo utilizando a metodologia SUS.
                  O projeto atingiu nível <strong>Excelente (Grade A) em Nov/24</strong>.
                </p>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full items-center">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-xl flex flex-col h-[320px]">
                    <Bar options={barOptions} data={barData} />
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-xl flex flex-col h-[320px]">
                    <Radar options={radarOptions} data={radarData} />
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-xl flex flex-col h-[320px] md:col-span-2 lg:col-span-1">
                    <Doughnut options={doughnutOptions} data={doughnutData} />
                  </div>
                </div>
              </motion.div>

            ) : (
              /* ===== ABAS: CIENTÍFICO E PITCH ===== */
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={`w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                  active === "pitch" ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Imagem */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full lg:w-1/2 flex justify-center"
                >
                  <Image
                    src={content.image}
                    alt={content.title}
                    className="shadow-lg w-full max-w-md h-auto object-contain rounded-lg"
                    priority
                  />
                </motion.div>

                {/* Texto */}
                <div className="w-full lg:w-1/2 flex flex-col text-white">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                    {content.title}
                  </h1>

                  <p className="text-sm sm:text-base leading-relaxed text-gray-200 text-justify">
                    {content.text}
                  </p>

                  {/* ===== BOTÃO DE DOWNLOAD (AGORA PARA AMBOS) ===== */}
                  <motion.a
                    href={content.file}
                    download
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#F9A318] hover:bg-[#ffb338] transition text-white font-semibold
                               px-10 py-2.5 rounded-xl mt-6 self-center lg:self-start shadow-md text-center"
                  >
                    {t('components.searches.button')}
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================= TABS SELECTOR ================= */}
        <div className="flex w-full lg:w-[600px] 2xl:w-[700px] text-sm lg:text-base flex-wrap justify-center border-2 border-[#0033FF] rounded-full overflow-hidden font-semibold mt-4">
          {["cientifico", "pitch", "resultados"].map((item) => (
            <motion.button
              key={item}
              onClick={() => setActive(item)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-1/3 lg:px-6 py-2 transition ${
                active === item
                  ? "bg-[#0033FF] text-white font-bold"
                  : "text-white hover:bg-[#0033FF]/20"
              }`}
            >
              {t(`components.searches.tabs.${item}`)}
            </motion.button>
          ))}
        </div>

      </div>
    </motion.section>
  );
}