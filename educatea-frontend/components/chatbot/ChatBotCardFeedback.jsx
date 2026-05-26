"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const emojis = [
  { src: "https://em-content.zobj.net/source/apple/391/pouting-face_1f621.png", label: "Péssimo" },
  { src: "https://em-content.zobj.net/source/apple/391/frowning-face_2639-fe0f.png", label: "Ruim" },
  { src: "https://em-content.zobj.net/source/apple/391/neutral-face_1f610.png", label: "Regular" },
  { src: "https://em-content.zobj.net/source/apple/391/smiling-face-with-smiling-eyes_1f60a.png", label: "Bom" },
  { src: "https://em-content.zobj.net/source/apple/391/star-struck_1f929.png", label: "Excelente" },
];

const ChatBotCardFeedback = ({ onClose, sessionId }) => {
  const [voted, setVoted] = useState(false);

  const handleVote = async (label) => {
    setVoted(true);
    if (sessionId) {
      await fetch(`${API}/api/chatbot/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, rating: label }),
      }).catch(() => {});
    }
    setTimeout(onClose, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-4xl p-7 shadow-2xl border border-blue-50 w-[400px] relative overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {!voted ? (
          <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-start gap-4">
            <div className="flex flex-col gap-5">
              <p className="text-gray-700 font-semibold leading-snug text-[15px]">
                Ajude o <span className="text-blue-600">EducaTEA</span> a melhorar. Como foi sua experiência hoje?
              </p>
              <div className="flex justify-between items-center">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleVote(emoji.label)}
                    className="hover:scale-125 transition-all duration-300 cursor-pointer grayscale hover:grayscale-0 focus:grayscale-0 active:scale-90"
                    title={emoji.label}
                    aria-label={`Avaliar como ${emoji.label}`}
                  >
                    <img src={emoji.src} alt={emoji.label} className="w-9 h-9 object-contain" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="thanks" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-4 text-center gap-3">
            <img src="https://em-content.zobj.net/source/apple/391/wrapped-gift_1f381.png" alt="Presente" className="w-12 h-12" />
            <h3 className="font-bold text-blue-800 text-lg">Obrigado pelo feedback!</h3>
            <p className="text-sm text-gray-500">Sua opinião é fundamental para nossa jornada inclusiva.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={onClose} className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 transition-colors" aria-label="Fechar">
        <span className="text-lg">✕</span>
      </button>
    </motion.div>
  );
};

export default ChatBotCardFeedback;
