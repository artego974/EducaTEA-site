"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

import TextLogo from "@/public/images/logos/TextLogo.webp";

import {
  User2, Users, ChevronRight,
  FileText, Settings, LogOut, UserCircle,
} from "lucide-react";

import { LanguageSelectHeader } from "./sub-components/LanguageSelectHeader";
import UserModal from "./login/ModalUsuario";

import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

// ─── Dropdown de perfil (usuário logado) ────────────────────────────────────
function ProfileDropdown({ user, avatarSrc, onClose, onLogout }) {
  const menuItems = [
    { href: "/perfil",         icon: UserCircle, label: "Meu Perfil"      },
    { href: "/meus-posts",     icon: FileText,   label: "Meus Posts"      },
    { href: "/configuracoes",  icon: Settings,   label: "Configurações"   },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute right-0 top-[calc(100%+10px)] w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 dark:border-zinc-800 overflow-hidden z-50"
    >
      {/* User card */}
      <div className="px-4 py-4 flex items-center gap-3 bg-gray-50 dark:bg-zinc-800/60 border-b border-gray-100 dark:border-zinc-800">
        {avatarSrc ? (
          <img src={avatarSrc} alt="Avatar" className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-[#1A3879]/20" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#1A3879] flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-sm text-gray-900 dark:text-white truncate leading-tight">{user.name}</p>
          <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
        </div>
      </div>

      {/* Menu items */}
      <nav className="py-1.5">
        {menuItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#1A3879] dark:hover:text-blue-400 transition-colors group"
          >
            <Icon size={16} className="text-gray-400 group-hover:text-[#1A3879] dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-100 dark:border-zinc-800 py-1.5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
        >
          <LogOut size={16} className="flex-shrink-0" />
          Sair
        </button>
      </div>
    </motion.div>
  );
}

// ─── Header principal ────────────────────────────────────────────────────────
export default function Header() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [hidden, setHidden]               = useState(false);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const profileRef = useRef(null);

  const { user, logout } = useUser();
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const router = useRouter();

  // Esconde header ao rolar para baixo
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 100) setHidden(true);
    else setHidden(false);
  });

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    if (!profileMenuOpen) return;
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileMenuOpen]);

  // Fecha dropdown ao pressionar Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setProfileMenuOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navItems = [
    { id: "presentation", href: "./#apresentacao" },
    { id: "tea",          href: "./#sobre-tea"    },
    { id: "fairs",        href: "./#feiras"       },
    { id: "works",        href: "./#trabalhos"    },
    { id: "community",    href: "./#comunidade"   },
    { id: "team",         href: "./#equipe"        },
  ];

  const avatarSrc = user?.profilePicture
    ? `/images/avatars/${user.profilePicture}`
    : null;

  const handleProfileClick = () => {
    if (user) setProfileMenuOpen((v) => !v);
    else setIsModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-100%", opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-[13dvh] fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 text-black font-bold transition-colors dark:bg-zinc-800/95 dark:border-zinc-900 dark:text-white"
      >
        {/* Logo */}
        <a href="./">
          <Image src={TextLogo} width={170} height={60} alt="Logo" />
        </a>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-x-8 list-none">
          <button className="bg-[#1A3879] text-white px-10 py-3 rounded-full hover:opacity-90 transition-opacity">
            {t('components.header.play')}
          </button>

          {navItems.map((item) => (
            <li key={item.id} className="cursor-pointer hover:opacity-80 text-sm uppercase dark:text-zinc-300 dark:hover:text-white">
              <a href={item.href}>{t(`components.header.menu.${item.id}`)}</a>
            </li>
          ))}
        </nav>

        {/* ── Desktop actions ── */}
        <div className="hidden md:flex items-center gap-x-3">

          {/* Community quick-access */}
          <Link
            href="/comunidade"
            className="group flex items-center gap-2 border border-[#1A3879]/25 bg-[#1A3879]/5 hover:bg-[#1A3879] text-[#1A3879] hover:text-white dark:border-blue-400/20 dark:bg-blue-400/5 dark:text-blue-300 dark:hover:bg-blue-500 dark:hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A3879] opacity-50 group-hover:bg-white dark:bg-blue-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1A3879] group-hover:bg-white dark:bg-blue-400" />
            </span>
            Comunidade
          </Link>

          {/* Profile button + dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileClick}
              className="transition-opacity cursor-pointer hover:opacity-80 flex items-center justify-center"
              title={user ? "Minha conta" : t('components.header.actions.open_profile')}
            >
              {user && avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="w-[42px] h-[42px] rounded-full object-cover border-2 border-[#1A3879]/30 dark:border-zinc-600"
                />
              ) : user ? (
                <div className="w-[42px] h-[42px] rounded-full bg-[#1A3879] flex items-center justify-center text-white text-sm font-bold border-2 border-[#1A3879]/30">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
              ) : (
                <User2 width={45} height={30} />
              )}
            </button>

            <AnimatePresence>
              {profileMenuOpen && user && (
                <ProfileDropdown
                  user={user}
                  avatarSrc={avatarSrc}
                  onClose={() => setProfileMenuOpen(false)}
                  onLogout={handleLogout}
                />
              )}
            </AnimatePresence>
          </div>

          <li className="list-none">
            <LanguageSelectHeader />
          </li>
        </div>

        {/* Hamburger mobile */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(true)}>
          <span className="w-6 h-0.5 bg-black rounded-full dark:bg-white transition-colors" />
          <span className="w-6 h-0.5 bg-black rounded-full dark:bg-white transition-colors" />
          <span className="w-6 h-0.5 bg-black rounded-full dark:bg-white transition-colors" />
        </button>
      </motion.header>

      {/* ── Menu mobile ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#1A3879] dark:bg-zinc-950 z-50 flex flex-col p-6 overflow-y-auto text-white"
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between mb-6">
              <Image src={TextLogo} width={150} height={50} alt="Logo" className="brightness-0 invert" />
              <button onClick={() => setMobileOpen(false)} className="p-2 text-white hover:text-gray-300 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Community card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-5">
              <Link
                href="/comunidade"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 active:scale-[0.98] transition-all dark:bg-zinc-900 dark:border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Users size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">Comunidade</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                      </span>
                      <p className="text-xs text-white/60">Feed ao vivo</p>
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-white/50" />
              </Link>
            </motion.div>

            {/* Nav links */}
            <nav className="flex flex-col gap-2 text-lg font-medium list-none flex-grow">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="border-b border-white/20 last:border-none dark:border-zinc-800"
                >
                  <a href={item.href} onClick={() => setMobileOpen(false)} className="block w-full py-4 text-white hover:text-gray-300 dark:text-zinc-200">
                    {t(`components.header.menu.${item.id}`)}
                  </a>
                </motion.li>
              ))}
            </nav>

            {/* Actions mobile */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-col gap-4">
              <button className="bg-white text-[#1A3879] dark:bg-zinc-800 dark:text-white py-4 px-6 rounded-full text-lg w-full font-bold shadow-md active:scale-95 transition-all">
                {t('components.header.play')}
              </button>

              {/* Perfil / conta mobile */}
              {user ? (
                <div className="bg-white/10 rounded-2xl border border-white/20 dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
                  {/* User info */}
                  <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 dark:border-zinc-800">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="Avatar" className="w-11 h-11 rounded-full object-cover flex-shrink-0 border-2 border-white/30" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-bold text-base flex-shrink-0">
                        {user.name?.[0]?.toUpperCase() ?? "U"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
                      <p className="text-xs text-white/50 mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  {/* Menu items */}
                  {[
                    { href: "/perfil",        label: "Meu Perfil",     icon: UserCircle },
                    { href: "/meus-posts",    label: "Meus Posts",     icon: FileText   },
                    { href: "/configuracoes", label: "Configurações",  icon: Settings   },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/10 border-b border-white/10 dark:border-zinc-800 last:border-none transition-colors"
                    >
                      <Icon size={16} className="opacity-60" />
                      {label}
                    </Link>
                  ))}
                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut size={16} className="opacity-80" />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white/10 p-4 rounded-2xl border border-white/20 dark:bg-zinc-900 dark:border-zinc-800">
                  <button
                    onClick={() => { setMobileOpen(false); setIsModalOpen(true); }}
                    className="flex items-center gap-3 flex-1"
                  >
                    <div className="bg-white/20 p-2.5 rounded-full border border-white/30 dark:bg-zinc-800">
                      <User2 size={24} className="text-white" />
                    </div>
                    <span className="text-sm font-bold text-white">Entrar / Cadastrar</span>
                  </button>
                  <div className="pl-4 ml-2 border-l border-white/20 dark:border-zinc-800">
                    <LanguageSelectHeader />
                  </div>
                </div>
              )}

              {/* Language (when logged in) */}
              {user && (
                <div className="flex justify-end">
                  <LanguageSelectHeader />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
