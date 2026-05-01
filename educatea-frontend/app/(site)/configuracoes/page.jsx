"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Configuracoes() {
  const { user, getToken, loading: authLoading } = useUser();
  const { showToast } = useToast();
  const router = useRouter();

  const [currentPassword, setCurrentPassword]   = useState("");
  const [newPassword, setNewPassword]           = useState("");
  const [confirmPassword, setConfirmPassword]   = useState("");
  const [showCurrent, setShowCurrent]           = useState(false);
  const [showNew, setShowNew]                   = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);
  const [saving, setSaving]                     = useState(false);
  const [errors, setErrors]                     = useState({});

  useEffect(() => {
    if (!authLoading && !user) {
      showToast("Faça login para acessar as configurações.", "warning");
      router.replace("/");
    }
  }, [user, authLoading, showToast, router]);

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Carregando...</div>;
  }

  const validate = () => {
    const e = {};
    if (!currentPassword) e.currentPassword = "Digite a senha atual.";
    if (!newPassword) e.newPassword = "Digite a nova senha.";
    else if (newPassword.length < 6) e.newPassword = "Mínimo de 6 caracteres.";
    if (!confirmPassword) e.confirmPassword = "Confirme a nova senha.";
    else if (newPassword !== confirmPassword) e.confirmPassword = "As senhas não coincidem.";
    return e;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      const res = await fetch(`${API}/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ password: newPassword }),
      });
      if (res.status === 403) throw new Error("Sem permissão.");
      if (!res.ok) throw new Error("Erro ao atualizar senha.");
      showToast("Senha alterada com sucesso!", "success");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setErrors({});
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const PasswordField = ({ label, value, onChange, show, onToggle, error, autoComplete }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
      <div className="relative">
        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-zinc-700 dark:text-white rounded-xl text-sm outline-none border-2 transition-colors ${
            error ? "border-red-400" : "border-transparent focus:border-[#1A3879]"
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12 px-4">
      <div className="max-w-xl mx-auto space-y-4">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1A3879] dark:text-white">Configurações</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Gerencie sua conta e segurança.</p>
        </div>

        {/* Conta */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={18} className="text-[#1A3879] dark:text-blue-400" />
            <h2 className="font-bold text-base dark:text-white">Segurança</h2>
          </div>

          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <PasswordField
              label="Senha atual"
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setErrors((p) => ({ ...p, currentPassword: "" })); }}
              show={showCurrent}
              onToggle={() => setShowCurrent((v) => !v)}
              error={errors.currentPassword}
              autoComplete="current-password"
            />
            <PasswordField
              label="Nova senha"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, newPassword: "" })); }}
              show={showNew}
              onToggle={() => setShowNew((v) => !v)}
              error={errors.newPassword}
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirmar nova senha"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
              show={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={saving}
              className="mt-2 bg-[#1A3879] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#152d63] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {saving ? "Salvando..." : "Alterar senha"}
            </button>
          </form>
        </motion.div>

        {/* Link para perfil */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onClick={() => router.push("/perfil")}
          className="w-full bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-5 shadow-sm text-left hover:border-[#1A3879]/30 hover:shadow-md transition-all cursor-pointer"
        >
          <p className="font-bold text-sm dark:text-white">Editar perfil público</p>
          <p className="text-xs text-gray-400 mt-0.5">Nome, avatar, país e tags → <span className="text-[#1A3879] dark:text-blue-400">/perfil</span></p>
        </motion.button>

      </div>
    </div>
  );
}
