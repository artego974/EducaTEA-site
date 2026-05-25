"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import {
  MessageCircle, Search, X,
  TrendingUp, Clock, MapPin, GraduationCap,
  SlidersHorizontal, Feather, Users, Bookmark,
  ThumbsUp, Share2,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function useNow() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function timeAgo(dateStr, now = Date.now()) {
  const diff = Math.floor((now - new Date(dateStr)) / 1000);
  if (diff < 0) return "agora";
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

// ─────────────────────────────────────────
// Post Card (X-style)
// ─────────────────────────────────────────
function PostCard({ post, onReplyClick, currentUser, getToken, showToast }) {
  const now = useNow();
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [liked, setLiked] = useState(post.likedByMe || false);
  const [saved, setSaved] = useState(post.savedByMe || false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) { showToast("Faça login para curtir.", "warning"); return; }
    const prev = { liked, likes };
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    const res = await fetch(`${API}/api/comments/${post.id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) {
      const data = await res.json();
      setLikes(data.likesCount);
      setLiked(data.liked);
    } else {
      setLiked(prev.liked);
      setLikes(prev.likes);
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!currentUser) { showToast("Faça login para salvar posts.", "warning"); return; }
    setSaved((v) => !v);
    const res = await fetch(`${API}/api/comments/${post.id}/save`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) {
      const data = await res.json();
      setSaved(data.saved);
      showToast(data.saved ? "Post salvo!" : "Post removido dos salvos.", "success");
    } else {
      setSaved((v) => !v);
    }
  };

  const handleReply = (e) => {
    e.stopPropagation();
    onReplyClick(post);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      const url = typeof window !== "undefined" ? `${window.location.origin}/comunidade` : "/comunidade";
      await navigator.clipboard.writeText(url);
      showToast("Link copiado!", "success");
    } catch {
      showToast("Não foi possível copiar.", "error");
    }
  };

  return (
    <article
      onClick={() => onReplyClick(post)}
      className="border-2 border-[#0033FF] rounded-xl mx-4 my-3 p-3 py-6 flex items-center gap-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 dark:text-white transition-colors"
    >
      <img
        src={`/images/avatars/${post.imageUrl || "avatar01.png"}`}
        alt={post.author}
        className="w-14 h-14 rounded-full object-cover flex-shrink-0"
      />

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <p className="text-[13px] leading-snug text-gray-800 dark:text-gray-100 line-clamp-3 whitespace-pre-wrap break-words">
          {post.text}
        </p>

        {post.postImageUrl && (
          <img
            src={post.postImageUrl.startsWith("/") ? post.postImageUrl : `/images/uploads/${post.postImageUrl}`}
            alt="Imagem do post"
            className="rounded-md w-full max-h-44 object-cover"
            onClick={(e) => e.stopPropagation()}
          />
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
            {post.author} · {timeAgo(post.createdAt, now)}
          </span>

          <div className="flex items-center gap-2.5 text-[11px] text-gray-500 dark:text-gray-400 flex-shrink-0">
            <button
              onClick={handleLike}
              className={`flex items-center gap-0.5 transition-colors cursor-pointer ${
                liked ? "text-red-500" : "hover:text-red-400"
              }`}
              title={liked ? "Descurtir" : "Curtir"}
            >
              <ThumbsUp className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} />
              {likes}
            </button>
            <button
              onClick={handleReply}
              className="flex items-center gap-0.5 hover:text-[#1A3879] dark:hover:text-blue-400 transition-colors cursor-pointer"
              title="Comentar"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {post.replyCount || 0}
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center transition-colors cursor-pointer ${
                saved ? "text-[#1A3879] dark:text-blue-400" : "hover:text-[#1A3879] dark:hover:text-blue-400"
              }`}
              title={saved ? "Remover dos salvos" : "Salvar post"}
            >
              <Bookmark className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleShare}
              className="flex items-center hover:text-[#1A3879] dark:hover:text-blue-400 transition-colors cursor-pointer"
              title="Compartilhar"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────
// Reply Modal (X-style thread)
// ─────────────────────────────────────────
function ReplyModal({ comment, onClose, currentUser, getToken, onReplyPosted }) {
  const now = useNow();
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [posting, setPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // { id, author } of the reply being responded to
  const inputRef = useRef(null);
  const isPostAuthor = currentUser?.id === comment.userId;

  useEffect(() => {
    fetch(`${API}/api/comments/${comment.id}/replies`, {
      headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
    })
      .then((r) => r.json())
      .then((data) => setReplies(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [comment.id]);

  useEffect(() => {
    if (currentUser) setTimeout(() => inputRef.current?.focus(), 300);
  }, [currentUser]);

  const handleReplyToComment = (reply) => {
    setReplyingTo({ id: reply.id, author: reply.author });
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newReply.trim() || !currentUser) return;
    setPosting(true);
    const parentId = replyingTo ? replyingTo.id : comment.id;
    const res = await fetch(`${API}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ text: newReply, section: comment.section, parentId }),
    });
    if (res.ok) {
      const created = await res.json();
      setReplies((p) => [...p, created]);
      setNewReply("");
      setReplyingTo(null);
      onReplyPosted?.(comment.id);
    }
    setPosting(false);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 dark:border-zinc-800"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b dark:border-zinc-800">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
          <span className="font-bold text-base dark:text-white">Thread</span>
        </div>

        {/* Original post */}
        <div className="px-4 pt-4 pb-0 flex gap-3">
          <div className="flex flex-col items-center">
            <img
              src={`/images/avatars/${comment.imageUrl || "avatar01.png"}`}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            {replies.length > 0 && (
              <div className="w-0.5 flex-1 bg-gray-200 dark:bg-zinc-700 mt-2 mb-0" style={{ minHeight: 24 }} />
            )}
          </div>
          <div className="flex-1 pb-4 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[15px] dark:text-white">{comment.author}</span>
              <span className="text-[13px] text-gray-400">· {timeAgo(comment.createdAt, now)}</span>
            </div>
            <p className="text-[15px] text-gray-800 dark:text-gray-200 mt-1 leading-relaxed whitespace-pre-wrap break-words">
              {comment.text}
            </p>
            {comment.postImageUrl && (
              <img
                src={comment.postImageUrl.startsWith("/") ? comment.postImageUrl : `/images/uploads/${comment.postImageUrl}`}
                className="mt-2 rounded-2xl max-h-52 object-cover w-full border border-gray-100 dark:border-zinc-700"
              />
            )}
            <p className="text-[13px] text-gray-400 mt-2">
              Respondendo a <span className="text-[#1A3879] dark:text-blue-400">@{comment.author}</span>
            </p>
          </div>
        </div>

        {/* Replies list */}
        <div className="flex-1 overflow-y-auto border-t dark:border-zinc-800">
          {replies.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">
              Sem respostas ainda. Seja o primeiro!
            </p>
          ) : (
            replies.map((r) => (
              <div key={r.id} className="flex gap-3 px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                <img
                  src={`/images/avatars/${r.imageUrl || "avatar01.png"}`}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[14px] dark:text-white">{r.author}</span>
                    <span className="text-[12px] text-gray-400">· {timeAgo(r.createdAt, now)}</span>
                  </div>
                  <p className="text-[14px] text-gray-800 dark:text-gray-200 mt-0.5 leading-relaxed break-words">
                    {r.text}
                  </p>
                  {/* Reply-to-comment button: only post author can respond */}
                  <div className="mt-1.5">
                    {isPostAuthor ? (
                      <button
                        onClick={() => handleReplyToComment(r)}
                        className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#1A3879] dark:hover:text-blue-400 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Responder
                      </button>
                    ) : (
                      <span className="relative group/tip flex items-center gap-1 text-[11px] text-gray-300 dark:text-zinc-600 cursor-not-allowed select-none w-fit">
                        <MessageCircle className="w-3 h-3" />
                        Responder
                        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-max max-w-[180px] rounded-lg bg-gray-800 dark:bg-zinc-700 text-white text-[11px] leading-snug px-2.5 py-1.5 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 whitespace-normal text-center shadow-lg z-10">
                          Apenas o autor do post pode responder
                          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800 dark:border-t-zinc-700" />
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reply input */}
        {currentUser ? (
          <form
            onSubmit={handlePost}
            className="px-4 py-3 border-t dark:border-zinc-800 flex flex-col gap-2"
          >
            {replyingTo && (
              <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-zinc-500 px-1">
                <span>Respondendo a <span className="font-semibold text-[#1A3879] dark:text-blue-400">@{replyingTo.author}</span></span>
                <button type="button" onClick={() => setReplyingTo(null)} className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <img
                src={`/images/avatars/${currentUser.profilePicture || "avatar01.png"}`}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />
              <input
                ref={inputRef}
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder={replyingTo ? `Respondendo a @${replyingTo.author}…` : "Comente neste post"}
                className="flex-1 bg-transparent dark:text-white text-[15px] outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={posting || !newReply.trim()}
                className="bg-[#1A3879] text-white text-sm font-bold px-4 py-1.5 rounded-full disabled:opacity-50 hover:bg-[#152d63] transition-colors cursor-pointer"
              >
                {posting ? "..." : "Enviar"}
              </button>
            </div>
          </form>
        ) : (
          <div className="px-4 py-3 border-t dark:border-zinc-800 text-center text-sm text-gray-400">
            <span className="text-[#1A3879] dark:text-blue-400 font-semibold cursor-pointer">
              Faça login
            </span>{" "}
            para comentar.
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────
function SkeletonPost() {
  return (
    <div className="flex gap-3 px-4 py-4 border-b border-gray-100 dark:border-zinc-800 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-700 flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded-full w-1/3" />
        <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded-full w-full" />
        <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded-full w-2/3" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Filter config
// ─────────────────────────────────────────
const FILTERS = [
  { id: "recent",     label: "Recentes",     icon: Clock           },
  { id: "highlights", label: "Em alta",      icon: TrendingUp      },
  { id: "senac",      label: "Senac",        icon: MapPin          },
  { id: "teachers",   label: "Professores",  icon: GraduationCap   },
  { id: "custom",     label: "Personalizar", icon: SlidersHorizontal },
];

function applyFilter(comments, filter, search) {
  // only top-level posts (no replies)
  let list = comments.filter((c) => !c.parentId);

  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(
      (c) =>
        c.text.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q)
    );
  }

  switch (filter) {
    case "recent":
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "highlights":
      list.sort(
        (a, b) =>
          b.likesCount + b.replyCount * 2 - (a.likesCount + a.replyCount * 2)
      );
      break;
    case "senac":
      list = list.filter(
        (c) =>
          c.author.toLowerCase().includes("senac") ||
          c.text.toLowerCase().includes("senac")
      );
      break;
    case "teachers":
      list = list.filter((c) =>
        ["professor", "aula", "ensino", "docente", "pedagog"].some((kw) =>
          c.text.toLowerCase().includes(kw)
        )
      );
      break;
    default:
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return list;
}

// ─────────────────────────────────────────
// Main page
// ─────────────────────────────────────────
export default function Comunidade() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("recent");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const { user, getToken } = useUser();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/comments?section=comunidade`, {
      headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
    })
      .then((r) => r.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, []);

  const topLevel = comments.filter((c) => !c.parentId);
  const filtered = applyFilter(comments, activeFilter, search);

  const totalLikes = topLevel.reduce((s, c) => s + (c.likesCount || 0), 0);
  const totalReplies = topLevel.reduce((s, c) => s + (c.replyCount || 0), 0);
  const uniqueAuthors = [...new Map(topLevel.map((c) => [c.author, c])).values()];

  const newPost = () => {
    if (user) router.push("/criar-post");
    else showToast("Faça login para criar um post.", "warning");
  };

  const handleReplyPosted = (commentId) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, replyCount: (c.replyCount || 0) + 1 } : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <div className="max-w-5xl mx-auto flex">

        {/* ═══════════════════════════════════════
            Feed column
        ════════════════════════════════════════ */}
        <main className="flex-1 border-x border-gray-100 dark:border-zinc-800 min-h-screen">

          {/* Sticky header */}
          <div className="sticky top-0 z-10 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800">

            {/* Title row */}
            <div className="flex items-center justify-between px-4 py-3 gap-3">
              <h1 className="text-xl font-extrabold dark:text-white tracking-tight">Comunidade</h1>

              <div className="flex items-center gap-2">
                {/* Mobile search toggle */}
                <button
                  onClick={() => setSearchOpen((v) => !v)}
                  className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-500 dark:text-gray-400"
                >
                  {searchOpen ? <X size={18} /> : <Search size={18} />}
                </button>

                <button
                  onClick={newPost}
                  className="flex items-center gap-1.5 bg-[#1A3879] text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-[#152d63] transition-colors cursor-pointer"
                >
                  <Feather size={14} />
                  <span className="hidden sm:inline">Postar</span>
                </button>
              </div>
            </div>

            {/* Mobile search bar */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden lg:hidden px-4 pb-3"
                >
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      autoFocus
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar na comunidade…"
                      className="w-full pl-9 pr-8 py-2.5 bg-gray-100 dark:bg-zinc-800 dark:text-white rounded-full text-sm outline-none placeholder:text-gray-400"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter tabs */}
            <div className="flex overflow-x-auto scrollbar-hide">
              {FILTERS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveFilter(id)}
                  className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0 cursor-pointer ${
                    activeFilter === id
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                  {activeFilter === id && (
                    <motion.div
                      layoutId="filter-underline"
                      className="absolute bottom-0 left-3 right-3 h-[3px] bg-[#1A3879] dark:bg-blue-400 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Feed ── */}
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonPost key={i} />)
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={28} className="text-gray-300 dark:text-zinc-600" />
              </div>
              <p className="text-xl font-bold dark:text-white mb-1">Nenhum post encontrado</p>
              <p className="text-gray-400 text-sm mb-6">
                {search
                  ? "Tente outros termos de busca."
                  : "Seja o primeiro a publicar aqui!"}
              </p>
              <button
                onClick={newPost}
                className="bg-[#1A3879] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#152d63] transition-colors cursor-pointer"
              >
                Criar post
              </button>
            </div>
          ) : (
            filtered.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onReplyClick={setSelectedComment}
                currentUser={user}
                getToken={getToken}
                showToast={showToast}
              />
            ))
          )}
        </main>

        {/* ═══════════════════════════════════════
            Right sidebar (desktop only)
        ════════════════════════════════════════ */}
        <aside className="hidden lg:flex flex-col gap-4 w-80 xl:w-[340px] px-5 pt-4 sticky top-0 self-start max-h-screen overflow-y-auto">

          {/* Search */}
          <div className="relative mt-2">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar na comunidade…"
              className="w-full pl-10 pr-9 py-2.5 bg-gray-100 dark:bg-zinc-800 dark:text-white rounded-full text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#1A3879]/25 transition-shadow"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-2xl p-5">
            <h3 className="font-bold text-[15px] dark:text-white mb-4">Sobre a Comunidade</h3>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Publicações</span>
                <span className="font-bold text-sm dark:text-white">{topLevel.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Curtidas</span>
                <span className="font-bold text-sm dark:text-white">{totalLikes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Respostas</span>
                <span className="font-bold text-sm dark:text-white">{totalReplies}</span>
              </div>
            </div>
            <button
              onClick={newPost}
              className="mt-5 w-full bg-[#1A3879] text-white py-2.5 rounded-full font-bold text-sm hover:bg-[#152d63] transition-colors cursor-pointer"
            >
              + Novo Post
            </button>
          </div>

          {/* Active members */}
          {uniqueAuthors.length > 0 && (
            <div className="bg-gray-50 dark:bg-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users size={15} className="text-[#1A3879] dark:text-blue-400" />
                <h3 className="font-bold text-[15px] dark:text-white">Membros ativos</h3>
              </div>
              <div className="space-y-3">
                {uniqueAuthors.slice(0, 6).map((c) => (
                  <div key={c.author} className="flex items-center gap-3">
                    <img
                      src={`/images/avatars/${c.imageUrl || "avatar01.png"}`}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <span className="text-sm font-medium dark:text-white truncate">{c.author}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meus posts + salvos (logged in) */}
          {user && (
            <div className="bg-gray-50 dark:bg-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={`/images/avatars/${user.profilePicture || "avatar01.png"}`}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <p className="text-sm font-bold dark:text-white">{user.name}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => router.push("/meus-posts")}
                  className="w-full text-left text-xs text-[#1A3879] dark:text-blue-400 font-medium hover:underline cursor-pointer"
                >
                  Ver meus posts →
                </button>
                <button
                  onClick={() => router.push("/meus-salvos")}
                  className="w-full text-left flex items-center gap-1 text-xs text-[#1A3879] dark:text-blue-400 font-medium hover:underline cursor-pointer"
                >
                  <Bookmark size={12} />
                  Posts salvos →
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Reply modal */}
      <AnimatePresence>
        {selectedComment && (
          <ReplyModal
            comment={selectedComment}
            onClose={() => setSelectedComment(null)}
            currentUser={user}
            getToken={getToken}
            onReplyPosted={handleReplyPosted}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
