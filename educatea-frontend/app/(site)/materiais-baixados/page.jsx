"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, FileImage, FileArchive, Trash2 } from "lucide-react";

import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";

const STORAGE_KEY = "educatea_downloaded_materials";

const ICON_BY_KIND = {
  pdf:   FileText,
  image: FileImage,
  zip:   FileArchive,
};

export default function MateriaisBaixadosPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading } = useUser();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      showToast("Faça login para ver seus materiais baixados.", "warning");
      router.replace("/");
      return;
    }
    if (!user) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setMaterials(Array.isArray(parsed) ? parsed : []);
    } catch {
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading, showToast, router]);

  const handleRemove = (id) => {
    const updated = materials.filter((m) => m.id !== id);
    setMaterials(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    showToast("Material removido da lista.", "success");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1A3879] dark:text-white">Materiais Baixados</h1>
            <p className="text-gray-500 mt-1">
              {materials.length} {materials.length === 1 ? "material" : "materiais"} disponíveis
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="bg-[#1A3879] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#152d63] transition-colors cursor-pointer"
          >
            Explorar materiais
          </button>
        </div>

        {/* Perfil rápido */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 border border-gray-100 dark:border-zinc-700 flex items-center gap-4 mb-8 shadow-sm">
          <img
            src={`/images/avatars/${user.profilePicture || "avatar01.png"}`}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <p className="font-bold text-lg dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Lista de materiais */}
        {loading ? (
          <p className="text-center text-gray-400 py-12">Carregando materiais...</p>
        ) : materials.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download size={28} className="text-gray-300 dark:text-zinc-600" />
            </div>
            <p className="text-gray-400 mb-4">Você ainda não baixou nenhum material.</p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#1A3879] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#152d63] transition-colors cursor-pointer"
            >
              Ver materiais disponíveis
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {materials.map((m) => {
                const Icon = ICON_BY_KIND[m.kind] ?? FileText;
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-5 shadow-sm flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#1A3879]/10 dark:bg-blue-400/10 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-[#1A3879] dark:text-blue-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[15px] dark:text-white truncate">{m.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {m.size ? `${m.size} • ` : ""}
                        Baixado em {new Date(m.downloadedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {m.url && (
                        <a
                          href={m.url}
                          download
                          className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-700 text-[#1A3879] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          title="Baixar novamente"
                        >
                          <Download size={16} />
                        </a>
                      )}
                      <button
                        onClick={() => handleRemove(m.id)}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                        title="Remover da lista"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
