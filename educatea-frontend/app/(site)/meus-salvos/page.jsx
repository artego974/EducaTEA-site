"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, MessageCircle, Heart } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function MeusSalvos() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading, getToken } = useUser();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      showToast("Faça login para ver seus posts salvos.", "warning");
      router.replace("/");
      return;
    }
    if (!user) return;

    fetch(`${API}/api/saved`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [user, authLoading, showToast, router, getToken]);

  const handleUnsave = async (postId) => {
    const res = await fetch(`${API}/api/comments/${postId}/save`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      showToast("Post removido dos salvos.", "success");
    }
  };

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1A3879] dark:text-white">Posts Salvos</h1>
            <p className="text-gray-500 mt-1">
              {posts.length} {posts.length === 1 ? "post salvo" : "posts salvos"}
            </p>
          </div>
          <button
            onClick={() => router.push("/comunidade")}
            className="bg-[#1A3879] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#152d63] transition-colors cursor-pointer"
          >
            Ir à Comunidade
          </button>
        </div>

        {/* Perfil rápido */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 border border-gray-100 dark:border-zinc-700 flex items-center gap-4 mb-8 shadow-sm">
          <img
            src={`/images/avatars/${user.profilePicture || "avatar01.png"}`}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <p className="font-bold text-lg dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <p className="text-center text-gray-400 py-12">Carregando posts salvos...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark size={28} className="text-gray-300 dark:text-zinc-600" />
            </div>
            <p className="text-gray-400 mb-4">Você ainda não salvou nenhum post.</p>
            <button
              onClick={() => router.push("/comunidade")}
              className="bg-[#1A3879] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#152d63] transition-colors cursor-pointer"
            >
              Explorar a Comunidade
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 flex-1 min-w-0">
                      <img
                        src={`/images/avatars/${post.imageUrl || "avatar01.png"}`}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-[15px] dark:text-white">{post.author}</span>
                          <span className="text-[11px] text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                          {post.text}
                        </p>
                        {post.postImageUrl && (
                          <img
                            src={post.postImageUrl.startsWith("/") ? post.postImageUrl : `/images/uploads/${post.postImageUrl}`}
                            className="mt-3 rounded-xl max-h-48 object-cover w-full"
                          />
                        )}
                        <div className="flex gap-4 mt-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Heart size={12} />
                            {post.likesCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle size={12} />
                            {post.replyCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Remover dos salvos */}
                    <button
                      onClick={() => handleUnsave(post.id)}
                      className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-700 text-[#1A3879] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer flex-shrink-0"
                      title="Remover dos salvos"
                    >
                      <Bookmark size={16} fill="currentColor" strokeWidth={0} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
