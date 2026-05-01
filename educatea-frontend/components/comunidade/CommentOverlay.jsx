"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Repeat2,
  Repeat
} from "lucide-react";

import AvatarExemplo from "../../public/images/avatars/AvatarExample.png";


export default function CommentOverlay({ comment, onClose }) {
  if (!comment) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Modal */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-[90%] max-w-7xl h-4/5 rounded-xl overflow-hidden flex flex-col items-center"
          initial={{ scale: 0.9, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 40 }}
        >
          {/* HEADER ROXO */}
          <div className="bg-[#5B3FA6] w-full items-end px-24 h-36 flex gap-4 relative">

            <Image className="rounded-full size-36 border-white border-4 -mb-16" src={AvatarExemplo} alt="" />

            <div className="text-white py-6 flex flex-col gap-1">
              <p className="font-semibold">@arthurjuwer</p>

              <div className="flex gap-2 mt-1 text-xs font-semibold">
                <h2 className="text-base">Tags:</h2>
                <span className="bg-white text-[#5B3FA6] px-8 py-1 rounded-full">
                  Admin
                </span>
                <span className="bg-white text-[#5B3FA6] px-8 py-1 rounded-full">
                  Desenvolvedor
                </span>
                <span className="bg-white text-[#5B3FA6] px-8 py-1 rounded-full">
                  Senac São Leopoldo
                </span>
                <span className="bg-white text-[#5B3FA6] px-8 py-1 rounded-full">
                  Aluno
                </span>
              </div>
            </div>

            {/* Fechar */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* CONTEÚDO */}
          <div className="max-w-3xl flex-1 overflow-y-auto px-8 py-6 space-y-3 mt-6">
            {/* Comentário principal */}
            <div className="border-2 border-[#0033FF] rounded-lg p-6 px-8 flex items-center justify-center gap-10">
              <Image
                src={comment.image}
                alt={comment.author}
                className="rounded-full w-20"
              />

              <div>
                <p className="text-lg w-11/12 leading-relaxed">
                  {comment.text}
                </p>
                <span className="text-sm text-gray-500 mt-1 block">
                  {comment.author}
                </span>
              </div>
            </div>

            {/* AÇÕES */}
            <div className="flex items-center justify-between text-lg">
                
                <div className="flex justify-center font-medium items-center gap-6">
                    <button className="flex items-center gap-2 hover:text-black">
                        <ThumbsUp className="w-6 h-6" />
                        6
                    </button>

                    <button className="flex items-center gap-2 hover:text-black">
                        <MessageCircle className="w-6 h-6" />
                        3
                    </button>

                    <button className="flex items-center gap-2 hover:text-black">
                        <Repeat className="w-6 h-6" />
                        1
                    </button>
                </div>


              <div className="flex justify-center items-center gap-4">
                <button className="flex items-center gap-1 hover:text-black">
                    <Share2 className="w-6 h-6" />
                </button>
                <button className="flex items-center gap-1 hover:text-black ml-auto">
                    <Bookmark className="w-6 h-6" />
                </button>
              </div>

              
            </div>

            {/* RESPOSTAS */}
            <div className="space-y-6 mt-8 pl-30">
              {[1, 2].map((_, i) => (
                <div
                  key={i}
                  className="border-2 border-[#0033FF] rounded-lg p-5 flex gap-4"
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full" />

                  <div>
                    <p className="text-sm text-gray-700">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </p>
                    <span className="text-xs text-gray-500">
                      Usuário Exemplo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
