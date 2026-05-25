"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

import TextLogo from "@/public/images/logos/TextLogo.webp";

import { User2, ChevronRight, ChevronDown, X } from "lucide-react";

import { LanguageSelectHeader } from "./sub-components/LanguageSelectHeader";
import UserModal from "./login/ModalUsuario";

import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

// ─── Dropdown de perfil (usuário logado) ────────────────────────────────────
const LANGUAGES = [
  { id: "pt-br", label: "Português (BR)", flag: "/images/languages/BR.webp" },
  { id: "en-us", label: "English (US)",   flag: "/images/languages/US.webp" },
  { id: "es-es", label: "Español (ES)",   flag: "/images/languages/ES.webp" },
];

function ProfileDropdown({ user, avatarSrc, onClose, onLogout, onSwitchAccount }) {
  const { lang, switchLanguage, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);

  const roles = Array.isArray(user?.roles) && user.roles.length > 0
    ? user.roles
    : ["Admin", "Desenvolvedor", "Professor", "Moderador", "Beta"];
  // Com 1-2 roles mostra todos os nomes; com 3+ mostra 1 nome + "+N"
  // (espaço disponível ~164px não comporta 2 nomes + count simultaneamente)
  const visibleRoles = roles.length <= 2 ? roles : roles.slice(0, 1);
  const extraCount   = roles.length <= 2 ? 0     : roles.length - 1;

  const currentFlag = (LANGUAGES.find((l) => l.id === lang) ?? LANGUAGES[0]).flag;

  const contaItems = [
    { href: "/perfil",             label: t('components.header.dropdown.profile')   },
    { href: "/meus-posts",         label: t('components.header.dropdown.activity')  },
    { href: "/meus-salvos",        label: t('components.header.dropdown.saved')     },
    { href: "/materiais-baixados", label: t('components.header.dropdown.materials') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute right-0 top-[calc(100%+10px)] w-72 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl shadow-black/10 border border-gray-200 dark:border-zinc-700 overflow-hidden z-50"
    >
      {/* User card */}
      <div className="px-4 pt-4 pb-3 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X size={14} />
        </button>

        <div className="flex items-center gap-3 pr-6">
          {avatarSrc ? (
            <img src={avatarSrc} alt="Avatar" className="w-14 h-14 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#1A3879] flex items-center justify-center shrink-0 text-white font-bold text-xl">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-base text-gray-900 dark:text-white leading-tight truncate">
                {user.name}
              </p>
              <img src="/images/languages/BR.webp" alt="Brasil" className="w-6 h-4 rounded-sm object-cover shrink-0" />
            </div>
            {roles.length > 0 && (
              <div className="flex flex-nowrap gap-1.5 mt-1.5">
                {visibleRoles.map((role) => (
                  <span key={role} className="px-2 py-0.5 rounded-full bg-[#1A3879] text-white text-xs font-medium shrink-0 whitespace-nowrap">
                    {role}
                  </span>
                ))}
                {extraCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#1A3879] text-white text-xs font-medium shrink-0">
                    +{extraCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-zinc-700" />

      {/* Conta */}
      <div className="px-4 pt-3 pb-0.5">
        <p className="text-sm font-bold text-gray-900 dark:text-white">{t('components.header.dropdown.section_account')}</p>
      </div>
      <nav className="pb-1">
        {contaItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="block px-4 py-2 text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            {label}
          </Link>
        ))}

        {/* Idioma com submenu inline */}
        <button
          onClick={() => setLangOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <span>{t('components.header.dropdown.section_language')}</span>
          <div className="flex items-center gap-2">
            <img src={currentFlag} alt="" className="w-5 h-3.5 rounded-sm object-cover" />
            <ChevronDown size={14} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
          </div>
        </button>
        <AnimatePresence initial={false}>
          {langOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="overflow-hidden bg-gray-50 dark:bg-zinc-800/40"
            >
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => { switchLanguage(l.id); setLangOpen(false); }}
                  className={`w-full flex items-center gap-3 pl-8 pr-4 py-2 text-sm transition-colors cursor-pointer ${
                    lang === l.id
                      ? "text-[#1A3879] dark:text-blue-400 font-semibold"
                      : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                  } hover:bg-gray-100 dark:hover:bg-zinc-800`}
                >
                  <img src={l.flag} alt="" className="w-5 h-3.5 rounded-sm object-cover shrink-0" />
                  <span>{l.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="border-t border-gray-200 dark:border-zinc-700" />

      {/* Usuário */}
      <div className="px-4 pt-3 pb-0.5">
        <p className="text-sm font-bold text-gray-900 dark:text-white">{t('components.header.dropdown.section_user')}</p>
      </div>
      <nav className="pb-2">
        <button
          onClick={onSwitchAccount}
          className="w-full text-left px-4 py-2 text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          {t('components.header.dropdown.switch_account')}
        </button>
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-2 text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          {t('components.header.dropdown.logout')}
        </button>
      </nav>
    </motion.div>
  );
}

// ─── Menu mobile (full screen, espelha o dropdown desktop) ──────────────────
function MobileMenu({ user, avatarSrc, navItems, onClose, onLogout, onSwitchAccount, onLogin }) {
  const { lang, switchLanguage, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const dialogRef = useRef(null);

  const roles = Array.isArray(user?.roles) && user.roles.length > 0
    ? user.roles
    : ["Admin", "Desenvolvedor", "Professor", "Moderador", "Beta"];
  const visibleRoles = roles.length <= 2 ? roles : roles.slice(0, 1);
  const extraCount   = roles.length <= 2 ? 0     : roles.length - 1;

  const currentLang = LANGUAGES.find((l) => l.id === lang) ?? LANGUAGES[0];

  // Lock body scroll while menu is open
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  // Focus trap + Escape to close + restore focus on unmount
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const node = dialogRef.current;

    const getFocusable = () => {
      if (!node) return [];
      const selector =
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
      return Array.from(node.querySelectorAll(selector)).filter(
        (el) => !el.hasAttribute("inert") && el.offsetParent !== null
      );
    };

    // Move focus into the dialog (next tick — wait for motion to mount children)
    const focusTimer = window.setTimeout(() => {
      getFocusable()[0]?.focus();
    }, 0);

    const handleKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = getFocusable();
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !node.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !node.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKey);
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [onClose]);

  const contaItems = [
    { href: "/perfil",             label: t('components.header.dropdown.profile')   },
    { href: "/meus-posts",         label: t('components.header.dropdown.activity')  },
    { href: "/meus-salvos",        label: t('components.header.dropdown.saved')     },
    { href: "/materiais-baixados", label: t('components.header.dropdown.materials') },
  ];

  // JOGAR vira o primeiro item da lista do "Menu"
  const menuItems = [
    { id: "play", href: "/#jogo", label: t('components.header.play') },
    ...navItems.map((item) => ({
      id: item.id,
      href: item.href,
      label: t(`components.header.menu.${item.id}`),
    })),
  ];

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('components.header.mobile.section_menu')}
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 bg-[#1A3879] dark:bg-zinc-950 z-50 flex flex-col overflow-y-auto text-white"
    >
      {/* Sticky header */}
      <div className="sticky top-0 bg-[#1A3879]/95 dark:bg-zinc-950/95 backdrop-blur-sm z-10 flex items-center justify-between px-5 py-4 border-b border-white/15 dark:border-zinc-800">
        <Image src={TextLogo} width={130} height={42} alt="Logo" />
        <button
          onClick={onClose}
          aria-label="Fechar menu"
          className="w-9 h-9 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-5">
        {/* Card de usuário ou botão de login */}
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl bg-white/10 border border-white/20 dark:bg-zinc-900 dark:border-zinc-800 p-4"
          >
            <div className="flex items-center gap-3">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" className="w-14 h-14 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white font-bold text-xl">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-base text-white leading-tight truncate">
                    {user.name}
                  </p>
                  <img src="/images/languages/BR.webp" alt="Brasil" className="w-6 h-4 rounded-sm object-cover shrink-0" />
                </div>
                {roles.length > 0 && (
                  <div className="flex flex-nowrap gap-1.5 mt-1.5">
                    {visibleRoles.map((role) => (
                      <span key={role} className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium shrink-0 whitespace-nowrap">
                        {role}
                      </span>
                    ))}
                    {extraCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium shrink-0">
                        +{extraCount}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onLogin}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 border border-white/20 dark:bg-zinc-900 dark:border-zinc-800 hover:bg-white/15 active:scale-[0.99] transition-all"
          >
            <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <User2 size={22} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white">{t('components.header.mobile.login_register')}</span>
          </motion.button>
        )}

        {/* Conta + Idioma (logado) ou apenas Idioma (visitante) */}
        <div>
          <p className="text-sm font-bold text-white px-1 mb-2">
            {user
              ? t('components.header.dropdown.section_account')
              : t('components.header.dropdown.section_language')}
          </p>
          <div className="rounded-2xl bg-white/10 border border-white/20 dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
            {user && contaItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors border-b border-white/10 dark:border-zinc-800"
              >
                {label}
              </Link>
            ))}

            {/* Idioma com submenu inline */}
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span>{t('components.header.dropdown.section_language')}</span>
              <div className="flex items-center gap-2">
                <img src={currentLang.flag} alt="" className="w-5 h-3.5 rounded-sm object-cover" />
                <ChevronDown size={14} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </div>
            </button>
            <AnimatePresence initial={false}>
              {langOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="overflow-hidden bg-black/15 border-t border-white/10 dark:border-zinc-800"
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => { switchLanguage(l.id); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 pl-8 pr-4 py-2.5 text-sm transition-colors cursor-pointer ${
                        lang === l.id
                          ? "text-white font-semibold"
                          : "text-white/70 hover:text-white"
                      } hover:bg-white/10`}
                    >
                      <img src={l.flag} alt="" className="w-5 h-3.5 rounded-sm object-cover shrink-0" />
                      <span>{l.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Usuário (logado) */}
        {user && (
          <div>
            <p className="text-sm font-bold text-white px-1 mb-2">
              {t('components.header.dropdown.section_user')}
            </p>
            <div className="rounded-2xl bg-white/10 border border-white/20 dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
              <button
                onClick={onSwitchAccount}
                className="w-full text-left px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border-b border-white/10 dark:border-zinc-800"
              >
                {t('components.header.dropdown.switch_account')}
              </button>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {t('components.header.dropdown.logout')}
              </button>
            </div>
          </div>
        )}

        {/* Menu (JOGAR + nav items) */}
        <div>
          <p className="text-sm font-bold text-white px-1 mb-2">
            {t('components.header.mobile.section_menu')}
          </p>
          <nav className="rounded-2xl bg-white/10 border border-white/20 dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-white/85 hover:text-white hover:bg-white/10 transition-colors border-b border-white/10 dark:border-zinc-800 last:border-none"
              >
                <span>{item.label}</span>
                <ChevronRight size={16} className="text-white/40" />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Header principal ────────────────────────────────────────────────────────
export default function Header() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [hidden, setHidden]               = useState(false);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [switchUser, setSwitchUser]       = useState(null);
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
    { id: "presentation", href: "/#apresentacao" },
    { id: "fairs",        href: "/#feiras"       },
    { id: "works",        href: "/#trabalhos"    },
    { id: "community",    href: "/#comunidade"   },
    { id: "team",         href: "/#equipe"       },
    { id: "more_pages",   href: "/paginas"       },
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

  const handleSwitchAccount = () => {
    setSwitchUser(user);
    setProfileMenuOpen(false);
    setMobileOpen(false);
    setIsModalOpen(true);
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
        className="h-[12dvh] lg:h-[13dvh] fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 text-black font-bold transition-colors dark:bg-zinc-800/95 dark:border-zinc-900 dark:text-white"
      >
        {/* Logo */}
        <Link href="/">
          <Image src={TextLogo} width={170} height={60} alt="Logo" />
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-x-8 list-none">
          <Link href="/#jogo" className="bg-[#1A3879] text-white px-10 py-3 rounded-full hover:opacity-90 transition-opacity cursor-pointer">
            {t('components.header.play')}
          </Link>

          {navItems.map((item) => (
            <li key={item.id} className="cursor-pointer hover:opacity-80 text-sm uppercase dark:text-zinc-300 dark:hover:text-white">
              <Link href={item.href}>{t(`components.header.menu.${item.id}`)}</Link>
            </li>
          ))}
        </nav>

        {/* ── Desktop actions ── */}
        <div className="hidden md:flex items-center gap-x-3">


          {/* Profile button + dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileClick}
              className="transition-opacity cursor-pointer hover:opacity-80 flex items-center justify-center"
              title={user ? t('components.header.dropdown.my_account') : t('components.header.actions.open_profile')}
            >
              {user && avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : user ? (
                <div className="w-12 h-12 rounded-full bg-[#1A3879] flex items-center justify-center text-white text-sm font-bold border-2 border-[#1A3879]/30">
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
                  onSwitchAccount={handleSwitchAccount}
                />
              )}
            </AnimatePresence>
          </div>

          <li className="list-none">
            <LanguageSelectHeader />
          </li>
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(true)}
          aria-label={t('components.header.mobile.section_menu')}
          aria-expanded={mobileOpen}
          aria-haspopup="dialog"
        >
          <span className="w-6 h-0.5 bg-black rounded-full dark:bg-white transition-colors" />
          <span className="w-6 h-0.5 bg-black rounded-full dark:bg-white transition-colors" />
          <span className="w-6 h-0.5 bg-black rounded-full dark:bg-white transition-colors" />
        </button>
      </motion.header>

      {/* ── Menu mobile ── */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            user={user}
            avatarSrc={avatarSrc}
            navItems={navItems.filter((item) => item.id !== "community")}
            onClose={() => setMobileOpen(false)}
            onLogout={handleLogout}
            onSwitchAccount={handleSwitchAccount}
            onLogin={() => { setMobileOpen(false); setIsModalOpen(true); }}
          />
        )}
      </AnimatePresence>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSwitchUser(null); }}
        switchUser={switchUser}
      />
    </>
  );
}
