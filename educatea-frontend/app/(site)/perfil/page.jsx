"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Check, X, Camera } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const ROLE_LABELS = {
  admin:        "Administrador",
  developer:    "Desenvolvedor",
  student:      "Estudante",
  teacher:      "Professor",
  tutor:        "Tutor",
  aee:          "AEE",
  psychologist: "Psicólogo",
  person_tea:   "Pessoa TEA",
  senac_rs:     "Senac RS",
};

const AVATARS = [
  "avatar01.png","avatar02.png","avatar03.png","avatar04.png","avatar05.png",
  "avatar06.png","avatar07.png","avatar08.png","avatar09.png",
];

const TAG_LABELS = {
  admin: "Admin", developer: "Dev", student: "Estudante",
  aee: "AEE", psychologist: "Psicólogo", senac_rs: "Senac RS",
  teacher: "Professor", tutor: "Tutor", person_tea: "Pessoa TEA",
  tea_1: "TEA nível 1", tea_2: "TEA nível 2", tea_3: "TEA nível 3",
};

export default function Perfil() {
  const { user, setUser, getToken, loading: authLoading } = useUser();
  const { showToast } = useToast();
  const router = useRouter();

  const [editing, setEditing]           = useState(false);
  const [saving, setSaving]             = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);

  const [name, setName]               = useState("");
  const [country, setCountry]         = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      showToast("Faça login para acessar seu perfil.", "warning");
      router.replace("/");
    }
  }, [user, authLoading, showToast, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setCountry(user.country || "");
      setProfilePicture(user.profilePicture || "avatar01.png");
    }
  }, [user]);

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Carregando...</div>;
  }

  const handleSave = async () => {
    if (!name.trim()) { showToast("O nome não pode estar vazio.", "warning"); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name: name.trim(), country: country.trim(), profilePicture }),
      });
      if (!res.ok) throw new Error("Erro ao salvar.");
      const updated = await res.json();
      setUser(updated);
      setEditing(false);
      setAvatarPickerOpen(false);
      showToast("Perfil atualizado!", "success");
    } catch {
      showToast("Não foi possível salvar as alterações.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user.name || "");
    setCountry(user.country || "");
    setProfilePicture(user.profilePicture || "avatar01.png");
    setEditing(false);
    setAvatarPickerOpen(false);
  };

  const tags = user.tags || [];
  const currentAvatar = editing ? profilePicture : (user.profilePicture || "avatar01.png");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* ── Card principal ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden"
        >
          {/* Banner + avatar */}
          <div className="h-28 bg-gradient-to-r from-[#1A3879] to-[#2e5cb8] relative">
            <div className="absolute -bottom-12 left-6">
              <div className="relative group">
                <img
                  src={`/images/avatars/${currentAvatar}`}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-md"
                />
                {editing && (
                  <button
                    onClick={() => setAvatarPickerOpen((v) => !v)}
                    className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera size={20} className="text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Edit / Save buttons */}
            <div className="absolute top-3 right-4 flex gap-2">
              {editing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer backdrop-blur-sm"
                  >
                    <X size={14} /> Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 bg-white text-[#1A3879] text-sm font-bold px-3 py-1.5 rounded-full hover:bg-blue-50 disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    <Check size={14} /> {saving ? "Salvando..." : "Salvar"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer backdrop-blur-sm"
                >
                  <Pencil size={14} /> Editar perfil
                </button>
              )}
            </div>
          </div>

          {/* Avatar picker */}
          <AnimatePresence>
            {avatarPickerOpen && editing && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-b border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50"
              >
                <div className="px-6 py-4 mt-14">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Escolher avatar</p>
                  <div className="flex flex-wrap gap-3">
                    {AVATARS.map((av) => (
                      <button
                        key={av}
                        onClick={() => { setProfilePicture(av); setAvatarPickerOpen(false); }}
                        className={`rounded-full border-2 transition-all cursor-pointer ${profilePicture === av ? "border-[#1A3879] scale-110 shadow-md" : "border-transparent hover:border-gray-300"}`}
                      >
                        <img src={`/images/avatars/${av}`} className="w-12 h-12 rounded-full object-cover" alt={av} />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info */}
          <div className="px-6 pt-16 pb-6 space-y-5">

            {/* Nome */}
            <div>
              {editing ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-2xl font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-700 rounded-xl px-3 py-1.5 outline-none w-full border-2 border-transparent focus:border-[#1A3879] transition-colors"
                  placeholder="Seu nome"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              )}
              <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
            </div>

            {/* Role */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-[#1A3879]/10 text-[#1A3879] dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1 rounded-full font-semibold">
                {ROLE_LABELS[user.role] || user.role}
              </span>
              {user.country && !editing && (
                <span className="text-xs text-gray-500 dark:text-gray-400">🌍 {user.country}</span>
              )}
            </div>

            {/* País (só em modo edição) */}
            {editing && (
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">País</label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Ex: Brasil"
                  className="w-full bg-gray-100 dark:bg-zinc-700 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none border-2 border-transparent focus:border-[#1A3879] transition-colors"
                />
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Perfil</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 px-2.5 py-1 rounded-full font-medium">
                      {TAG_LABELS[tag] || tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Membro desde */}
            <p className="text-xs text-gray-400">
              Membro desde {new Date(user.createdAt || Date.now()).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </p>
          </div>
        </motion.div>

        {/* ── Links rápidos ── */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { label: "Meus Posts",    href: "/meus-posts",    desc: "Ver e editar publicações" },
            { label: "Configurações", href: "/configuracoes", desc: "Senha e preferências"       },
          ].map(({ label, href, desc }) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="bg-white dark:bg-zinc-800 rounded-2xl p-4 border border-gray-100 dark:border-zinc-700 text-left hover:border-[#1A3879]/30 hover:shadow-sm transition-all cursor-pointer"
            >
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
