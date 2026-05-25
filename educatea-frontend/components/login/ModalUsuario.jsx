"use client";

import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";

// ─── InputField fora do componente para evitar perda de foco no re-render ───
function InputField({ label, placeholder, type = "text", value, onChange, error, success, info, name, autoComplete }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const finalType = isPassword ? (show ? "text" : "password") : type;

  const borderColor = error
    ? "border-red-400 focus:border-red-500"
    : success
    ? "border-green-400 focus:border-green-500"
    : "border-gray-200 focus:border-[#1A3879]";

  return (
    <div className="w-full flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={finalType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full bg-white border-2 ${borderColor} rounded-xl px-4 py-3 text-[15px] text-gray-800 placeholder:text-gray-400 outline-none transition-colors pr-10`}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {!isPassword && success && (
          <CheckCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none" />
        )}
        {!isPassword && error && (
          <AlertCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none" />
        )}
      </div>
      {error && <p className="text-[12px] text-red-500 font-medium flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
      {!error && info && <p className="text-[12px] text-gray-400 font-medium">{info}</p>}
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function ModalUsuario({ isOpen, onClose, switchUser = null }) {
  const [view, setView] = useState("selection");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState("avatar01.png");
  const [submitting, setSubmitting] = useState(false);

  // Campos individuais — evita re-render total ao digitar
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Erros por campo
  const [fieldErrors, setFieldErrors] = useState({});

  const { t } = useLanguage();
  const { login, register } = useUser();
  const { showToast } = useToast();

  const tagsIds = [
    "admin", "developer", "student", "aee",
    "psychologist", "senac_rs", "teacher", "tutor",
    "person_tea", "tea_1", "tea_2", "tea_3",
  ];

  const avatars = [
    "avatar01.png","avatar02.png","avatar03.png","avatar04.png","avatar05.png",
    "avatar06.png","avatar07.png","avatar08.png","avatar09.png",
  ];

  // Reset completo ao fechar
  useEffect(() => {
    if (!isOpen) {
      setView("selection");
      setSelectedTags([]);
      setSelectedAvatar("avatar01.png");
      setName(""); setEmail(""); setPassword(""); setPasswordConfirm("");
      setFieldErrors({});
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const setFieldError = (field, msg) =>
    setFieldErrors((prev) => ({ ...prev, [field]: msg }));

  const clearFieldError = (field) =>
    setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const toggleTag = (tagId) =>
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );

  // ── Login ──
  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!email) errors.email = "E-mail obrigatório.";
    else if (!validateEmail(email)) errors.email = "E-mail inválido.";
    if (!password) errors.password = "Senha obrigatória.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await login(email, password);
      showToast("Login realizado com sucesso! 🎉", "success");
      onClose();
    } catch (err) {
      const msg = err.message || "Erro ao fazer login.";
      showToast(msg, "error");
      if (msg.toLowerCase().includes("credenciais")) {
        setFieldErrors({ email: " ", password: "E-mail ou senha incorretos." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Cadastro step 1 ──
  const handleRegisterStep1 = (e) => {
    e.preventDefault();
    const errors = {};
    if (!name.trim()) errors.name = "Nome obrigatório.";
    if (!email) errors.email = "E-mail obrigatório.";
    else if (!validateEmail(email)) errors.email = "Formato de e-mail inválido.";
    if (!password) errors.password = "Senha obrigatória.";
    else if (password.length < 6) errors.password = "Mínimo de 6 caracteres.";
    if (!passwordConfirm) errors.passwordConfirm = "Confirme sua senha.";
    else if (password !== passwordConfirm) errors.passwordConfirm = "As senhas não coincidem.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      showToast("Corrija os campos destacados antes de continuar.", "warning");
      return;
    }
    setView("register_step2");
  };

  // ── Cadastro step 2 ──
  const handleFinishRegister = async () => {
    setSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email,
        password,
        profilePicture: selectedAvatar,
        tags: selectedTags,
        role: "student",
      });
      showToast(`Conta criada com sucesso! Bem-vindo(a), ${name.split(" ")[0]}! 🎉`, "success");
      onClose();
    } catch (err) {
      const msg = err.message || "Erro ao criar conta.";
      showToast(msg, "error");
      if (msg.toLowerCase().includes("e-mail")) {
        setView("register");
        setFieldErrors({ email: "Este e-mail já está cadastrado." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-[430px] bg-white rounded-[20px] shadow-2xl flex flex-col items-center overflow-hidden max-h-[95vh] overflow-y-auto">

        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 z-10 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* ── TELA 1: SELEÇÃO ── */}
        {view === "selection" && (
          <div className="w-full flex flex-col gap-1 animate-in fade-in duration-200">
            <h2 className="text-[24px] font-bold text-center border-b border-gray-100 py-5 px-6">
              {t('components.user_modal.selection.title')}
            </h2>

            {/* Banner do usuário atual (modo trocar conta) */}
            {switchUser && (
              <div className="mx-6 mt-5 flex justify-center">
                <div className="flex items-center gap-3 p-4 w-full rounded-2xl bg-gray-50 border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors" onClick={onClose}>
                  <img
                    src={`/images/avatars/${switchUser.profilePicture || "avatar01.png"}`}
                    alt={switchUser.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold text-sm text-gray-900 leading-tight">{switchUser.name}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                      Logado
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 flex flex-col gap-4">
              <button
                onClick={() => setView("register")}
                className="w-full bg-[#1A3879] text-white font-bold py-3.5 rounded-xl cursor-pointer hover:bg-[#152d63] transition-colors"
              >
                {t('components.user_modal.selection.create_account')}
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">{t('components.user_modal.selection.or')}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <button
                onClick={() => setView("login")}
                className="w-full border-2 border-[#1A3879] text-[#1A3879] font-bold py-3.5 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors"
              >
                {t('components.user_modal.selection.login')}
              </button>
              <p className="text-center text-xs text-gray-400 px-2">
                {t('components.user_modal.selection.disclaimer')}{" "}
                <Link href="/termos" className="font-semibold underline text-[#1A3879]" onClick={onClose}>
                  {t('components.user_modal.selection.terms')}
                </Link>{" "}e{" "}
                <Link href="/privacidade" className="font-semibold underline text-[#1A3879]" onClick={onClose}>
                  {t('components.user_modal.selection.privacy')}
                </Link>.
              </p>
            </div>
          </div>
        )}

        {/* ── TELA 2: LOGIN ── */}
        {view === "login" && (
          <form onSubmit={handleLogin} className="w-full" noValidate>
            <h2 className="text-[24px] font-bold text-center border-b border-gray-100 py-5 px-6">
              {t('components.user_modal.login.title')}
            </h2>
            <div className="p-6 flex flex-col gap-4">
              <InputField
                label={t('components.user_modal.login.email_label')}
                placeholder={t('components.user_modal.login.email_placeholder')}
                type="email"
                name="email"
                value={email}
                autoComplete="email"
                onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                error={fieldErrors.email}
                success={email && validateEmail(email) && !fieldErrors.email}
              />
              <InputField
                label={t('components.user_modal.login.password_label')}
                placeholder={t('components.user_modal.login.password_placeholder')}
                type="password"
                name="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                error={fieldErrors.password}
              />
              <div className="flex justify-end -mt-2">
                <button type="button" className="text-xs text-[#1A3879] font-semibold hover:underline cursor-pointer">
                  {t('components.user_modal.login.forgot_btn')}
                </button>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1A3879] text-white font-bold py-3.5 rounded-xl cursor-pointer hover:bg-[#152d63] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {submitting ? "Entrando..." : t('components.user_modal.login.submit_btn')}
              </button>
              <button type="button" onClick={() => { setView("selection"); setFieldErrors({}); }} className="text-sm text-gray-400 hover:text-gray-600 text-center cursor-pointer">
                {t('components.user_modal.login.back_btn')}
              </button>
            </div>
          </form>
        )}

        {/* ── TELA 3: CADASTRO PASSO 1 ── */}
        {view === "register" && (
          <form onSubmit={handleRegisterStep1} className="w-full" noValidate>
            <div className="flex items-center justify-between border-b border-gray-100 py-5 px-6">
              <h2 className="text-[24px] font-bold">
                {t('components.user_modal.register_step1.title')}
              </h2>
              <span className="text-sm text-[#1A3879] font-semibold mr-8">1 / 2</span>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <InputField
                label={t('components.user_modal.register_step1.name_label')}
                placeholder={t('components.user_modal.register_step1.name_placeholder')}
                type="text"
                name="name"
                value={name}
                autoComplete="name"
                onChange={(e) => { setName(e.target.value); clearFieldError("name"); }}
                error={fieldErrors.name}
                success={name.trim().length >= 2 && !fieldErrors.name}
              />
              <InputField
                label={t('components.user_modal.register_step1.email_label')}
                placeholder="ex: seuemail@email.com"
                type="email"
                name="email"
                value={email}
                autoComplete="email"
                onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                error={fieldErrors.email}
                success={email && validateEmail(email) && !fieldErrors.email}
              />
              <InputField
                label={t('components.user_modal.register_step1.password_label')}
                placeholder="Mínimo 6 caracteres"
                type="password"
                name="password"
                value={password}
                autoComplete="new-password"
                onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                error={fieldErrors.password}
                info={t('components.user_modal.register_step1.password_info')}
              />
              <InputField
                label={t('components.user_modal.register_step1.repeat_password_label')}
                placeholder="Repita a senha"
                type="password"
                name="passwordConfirm"
                value={passwordConfirm}
                autoComplete="new-password"
                onChange={(e) => { setPasswordConfirm(e.target.value); clearFieldError("passwordConfirm"); }}
                error={fieldErrors.passwordConfirm}
                success={passwordConfirm && passwordConfirm === password && !fieldErrors.passwordConfirm}
              />
              {/* Indicador de progresso */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 h-1.5 rounded-full bg-[#1A3879]" />
                <div className="flex-1 h-1.5 rounded-full bg-gray-200" />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1A3879] text-white font-bold py-3.5 rounded-xl cursor-pointer hover:bg-[#152d63] transition-colors mt-1"
              >
                {t('components.user_modal.register_step1.next_btn')}
              </button>
              <button type="button" onClick={() => { setView("selection"); setFieldErrors({}); }} className="text-sm text-gray-400 hover:text-gray-600 text-center cursor-pointer">
                {t('components.user_modal.login.back_btn')}
              </button>
            </div>
          </form>
        )}

        {/* ── TELA 4: CADASTRO PASSO 2 ── */}
        {view === "register_step2" && (
          <div className="w-full">
            <div className="flex items-center justify-between border-b border-gray-100 py-5 px-6">
              <h2 className="text-[24px] font-bold">
                {t('components.user_modal.register_step2.title')}
              </h2>
              <span className="text-sm text-[#1A3879] font-semibold mr-8">2 / 2</span>
            </div>
            <div className="p-6 flex flex-col gap-5">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('components.user_modal.register_step2.icon_label')}
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-[#1A3879] shadow-md flex-shrink-0">
                    <img src={`/images/avatars/${selectedAvatar}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avatars.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setSelectedAvatar(av)}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          selectedAvatar === av ? "border-[#1A3879] scale-110 shadow-md" : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <img src={`/images/avatars/${av}`} alt={av} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('components.user_modal.register_step2.tags_label')}
                  <span className="text-gray-400 font-normal ml-1">(opcional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {tagsIds.map((tagId) => (
                    <button
                      key={tagId}
                      type="button"
                      onClick={() => toggleTag(tagId)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                        selectedTags.includes(tagId)
                          ? "bg-[#1A3879] text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {t(`components.user_modal.tags.${tagId}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progresso */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-[#1A3879]" />
                <div className="flex-1 h-1.5 rounded-full bg-[#1A3879]" />
              </div>

              <button
                type="button"
                onClick={handleFinishRegister}
                disabled={submitting}
                className="w-full bg-[#1A3879] text-white font-bold py-3.5 rounded-xl cursor-pointer hover:bg-[#152d63] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {submitting ? "Criando conta..." : t('components.user_modal.register_step2.finish_btn')}
              </button>
              <button type="button" onClick={() => setView("register")} className="text-sm text-gray-400 hover:text-gray-600 text-center cursor-pointer">
                {t('components.user_modal.register_step2.back_btn')}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
