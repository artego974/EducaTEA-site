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
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Line, Radar } from "react-chartjs-2";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

// Plugin: faixas coloridas SUS (F/D/C/B/A) no fundo do gráfico de percentil
const susBandsPlugin = {
  id: "susBands",
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    if (!chartArea || !scales?.x) return;
    const xScale = scales.x;

    const bands = [
      { from: 0,    to: 51.7, color: "rgba(231, 76, 60, 0.18)",  label: "F" },
      { from: 51.7, to: 62.6, color: "rgba(230, 126, 34, 0.18)", label: "D" },
      { from: 62.6, to: 71.4, color: "rgba(241, 196, 15, 0.18)", label: "C" },
      { from: 71.4, to: 84.5, color: "rgba(46, 204, 113, 0.18)", label: "B" },
      { from: 84.5, to: 100,  color: "rgba(52, 152, 219, 0.18)", label: "A" },
    ];

    bands.forEach((b) => {
      const x1 = xScale.getPixelForValue(b.from);
      const x2 = xScale.getPixelForValue(b.to);
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.fillRect(x1, chartArea.top, x2 - x1, chartArea.bottom - chartArea.top);
      ctx.restore();
    });
  },
};

// Plugin: rótulos (u1, u2...) acima de cada ponto do gráfico de percentil
const userLabelsPlugin = {
  id: "userLabels",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta) return;
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    meta.data.forEach((point, i) => {
      const raw = chart.data.datasets[0].data[i];
      if (!raw?.label) return;
      ctx.fillText(raw.label, point.x, point.y - 8);
    });
    ctx.restore();
  },
};

ChartJS.register(susBandsPlugin, userLabelsPlugin);

import CientificoImg from "../public/images/searches/Projeto de Pesquisa.webp";
import PitchImg from "../public/images/searches/Pitch.webp";

const imageMap = {
  cientifico: CientificoImg,
  pitch: PitchImg,
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

  // 1. Gráfico Percentil: Distribuição dos SUS Scores por Usuário
  const percentileData = {
    datasets: [
      {
        label: "SUS Score por Usuário",
        data: [
          { x: 60, y: 8,  label: "u5"  },
          { x: 70, y: 17, label: "u12" },
          { x: 80, y: 25, label: "u3"  },
          { x: 85, y: 33, label: "u2"  },
          { x: 88, y: 42, label: "u4"  },
          { x: 88, y: 55, label: "u11" },
          { x: 90, y: 67, label: "u8"  },
          { x: 92, y: 71, label: "u10" },
          { x: 93, y: 83, label: "u1"  },
          { x: 95, y: 92, label: "u6"  },
          { x: 98, y: 95, label: "u7"  },
          { x: 100, y: 96, label: "u9" },
        ],
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        pointBackgroundColor: "#3498db",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
        showLine: true,
        tension: 0.25,
        borderWidth: 2,
      },
    ],
  };

  const percentileOptions = {
    responsive: true,
    maintainAspectRatio: false,
    parsing: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { color: "#ffffff", font: { size: 10 }, boxWidth: 12 },
      },
      title: {
        display: true,
        text: "Distribuição Percentil dos SUS Scores por Usuário",
        color: "#ffffff",
        font: { size: 13, weight: "bold" },
      },
      tooltip: {
        callbacks: {
          title: (items) => items[0]?.raw?.label || "",
          label: (ctx) =>
            `SUS: ${ctx.raw.x}  •  Percentil: ${ctx.raw.y}`,
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "SUS Score",
          color: "#ffffff",
          font: { size: 11 },
        },
        ticks: { color: "#cccccc", stepSize: 20 },
        grid: { color: "rgba(255, 255, 255, 0.08)" },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Percentil Rank",
          color: "#ffffff",
          font: { size: 11 },
        },
        ticks: { color: "#cccccc", stepSize: 20 },
        grid: { color: "rgba(255, 255, 255, 0.08)" },
      },
    },
  };

  // 2. Gráfico Radar: Média das Respostas por Questão (SUS Q1-Q10)
  const radarData = {
    labels: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10"],
    datasets: [
      {
        label: "Média (1-5)",
        data: [4.7, 1.6, 4.5, 1.7, 4.6, 1.5, 4.7, 1.6, 4.8, 1.7],
        backgroundColor: "rgba(155, 89, 182, 0.35)",
        borderColor: "#9b59b6",
        borderWidth: 2,
        pointBackgroundColor: "#9b59b6",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#9b59b6",
        pointRadius: 3,
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
        text: "Média das Respostas por Questão (SUS)",
        color: "#ffffff",
        font: { size: 13, weight: "bold" },
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
        ticks: {
          display: true,
          color: "#cccccc",
          backdropColor: "transparent",
          stepSize: 1,
          font: { size: 9 },
        },
        suggestedMin: 0,
        suggestedMax: 5,
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
        <div className="w-full min-h-[460px] sm:min-h-[600px] flex items-center justify-center">
          <AnimatePresence mode="wait">

            {active === "resultados" ? (
              /* ===== ABA: RESULTADOS (3 GRÁFICOS) ===== */
              <motion.div
                key="resultados"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col items-center gap-4 sm:gap-6 text-white"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1 sm:mb-2">
                  {content.title}
                </h1>
                <p className="text-center text-gray-300 max-w-3xl mb-2 sm:mb-4 text-xs sm:text-base px-2">
                  Resultados da validação com docentes da rede básica e profissionalizante da instituição Senac São Leopoldo utilizando a metodologia SUS.
                  O projeto atingiu nível <strong>Excelente (Grade A) em Nov/25</strong>.
                </p>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 h-full items-center">
                  <div className="bg-white/5 p-2.5 sm:p-4 rounded-2xl border border-white/10 shadow-xl flex flex-col h-70 sm:h-90">
                    <div className="flex-1 min-h-0 relative">
                      <Line options={percentileOptions} data={percentileData} />
                    </div>
                    <div className="flex justify-center gap-2 sm:gap-3 mt-2 text-[10px] sm:text-xs flex-wrap">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-sm" style={{ background: "rgba(231, 76, 60, 0.6)" }}></span>F</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-sm" style={{ background: "rgba(230, 126, 34, 0.6)" }}></span>D</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-sm" style={{ background: "rgba(241, 196, 15, 0.6)" }}></span>C</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-sm" style={{ background: "rgba(46, 204, 113, 0.6)" }}></span>B</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 inline-block rounded-sm" style={{ background: "rgba(52, 152, 219, 0.6)" }}></span>A</span>
                    </div>
                  </div>
                  <div className="bg-white/5 p-2.5 sm:p-4 rounded-2xl border border-white/10 shadow-xl flex flex-col h-70 sm:h-90">
                    <Radar options={radarOptions} data={radarData} />
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
                className={`w-full flex flex-col lg:flex-row items-center gap-6 lg:gap-16 ${
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
                    className="shadow-lg w-full max-w-[300px] sm:max-w-sm lg:max-w-md h-auto object-contain rounded-lg"
                    priority
                  />
                </motion.div>

                {/* Texto */}
                <div className="w-full lg:w-1/2 flex flex-col text-white">
                  <h1 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4 text-center lg:text-left">
                    {content.title}
                  </h1>

                  <p className="text-[13px] sm:text-base leading-relaxed text-gray-200 text-justify sm:px-4 lg:px-0">
                    {content.text}
                  </p>

                  {/* ===== BOTÃO DE DOWNLOAD (AGORA PARA AMBOS) ===== */}
                  <motion.a
                    href={content.file}
                    download
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#F9A318] hover:bg-[#ffb338] transition text-white font-semibold
                               px-8 sm:px-10 py-2.5 rounded-xl mt-4 sm:mt-6 self-center lg:self-start shadow-md text-center text-sm sm:text-base cursor-pointer"
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
              className={`w-1/3 lg:px-6 py-2 transition cursor-pointer ${
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