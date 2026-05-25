"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirmar exclusão",
  message = "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
  confirmLabel = "Excluir",
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-zinc-700">
              <h3 className="font-bold text-lg dark:text-white">{title}</h3>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-600 dark:text-red-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{message}</p>
            </div>

            <div className="flex gap-3 px-6 pb-6 justify-end">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
