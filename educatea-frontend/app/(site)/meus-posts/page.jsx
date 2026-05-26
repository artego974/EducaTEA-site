"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, X, Check, ImagePlus } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function EditModal({ post, onClose, onSave, onToast, getToken }) {
  const [text, setText] = useState(post.text);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    post.postImageUrl
      ? (post.postImageUrl.startsWith("/") ? post.postImageUrl : `/images/uploads/${post.postImageUrl}`)
      : null
  );
  const [saving, setSaving] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let postImageUrl = post.postImageUrl;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await fetch(`${API}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          postImageUrl = uploadData.url;
        }
      } else if (removeImage) {
        postImageUrl = null;
      }

      const res = await fetch(`${API}/api/comments/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ text, postImageUrl }),
      });
      if (res.ok) {
        const updated = await res.json();
        onSave(updated);
        onClose();
        onToast("Post atualizado com sucesso!", "success");
      } else {
        onToast("Erro ao salvar alterações.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b dark:border-zinc-700">
          <h3 className="font-bold text-lg dark:text-white">Editar Post</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 cursor-pointer"><X size={20} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full bg-gray-50 dark:bg-zinc-700 dark:text-white rounded-xl p-4 outline-none resize-none border border-transparent focus:border-[#1A3879]"
          />
          {imagePreview && !removeImage && (
            <div className="relative rounded-xl overflow-hidden border dark:border-zinc-600">
              <img src={imagePreview} className="w-full max-h-48 object-cover" />
              <button
                type="button"
                onClick={() => { setRemoveImage(true); setImagePreview(null); setImageFile(null); }}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-[#1A3879] text-sm font-medium cursor-pointer">
              <ImagePlus size={18} />
              {imagePreview && !removeImage ? "Trocar imagem" : "Adicionar imagem"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
            <div className="flex gap-2">
              <button onClick={onClose} className="text-sm text-gray-500 px-4 py-2 cursor-pointer">Cancelar</button>
              <button
                onClick={handleSave}
                disabled={saving || !text.trim()}
                className="flex items-center gap-1.5 bg-[#1A3879] text-white px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60 cursor-pointer"
              >
                <Check size={16} />
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function MeusPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { user, loading: authLoading, getToken } = useUser();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      showToast("Faça login para ver seus posts.", "warning");
      router.replace("/");
      return;
    }
    if (!user) return;

    fetch(`${API}/api/comments/mine`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [user, authLoading, showToast, router, getToken]);

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API}/api/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.status === 401) { showToast("Sessão expirada. Faça login novamente.", "error"); return; }
      if (!res.ok) throw new Error("Erro ao excluir.");
      setPosts((p) => p.filter((c) => c.id !== id));
      showToast("Post excluído.", "info");
    } catch {
      showToast("Não foi possível excluir o post.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveEdit = (updated) => {
    setPosts((p) => p.map((c) => (c.id === updated.id ? updated : c)));
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
            <h1 className="text-3xl font-bold text-[#1A3879] dark:text-white">Meus Posts</h1>
            <p className="text-gray-500 mt-1">{posts.length} {posts.length === 1 ? "publicação" : "publicações"}</p>
          </div>
          <button
            onClick={() => router.push("/criar-post")}
            className="bg-[#1A3879] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#152d63] transition-colors cursor-pointer"
          >
            + Novo Post
          </button>
        </div>

        {/* Perfil rápido */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 border border-gray-100 dark:border-zinc-700 flex items-center gap-4 mb-8 shadow-sm">
          <img src={`/images/avatars/${user.profilePicture || "avatar01.png"}`} className="w-14 h-14 rounded-full object-cover" />
          <div>
            <p className="font-bold text-lg dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {(user.tags || []).map((tag) => (
                <span key={tag} className="text-[11px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <p className="text-center text-gray-400 py-12">Carregando seus posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">Você ainda não publicou nada.</p>
            <button
              onClick={() => router.push("/criar-post")}
              className="bg-[#1A3879] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#152d63] transition-colors cursor-pointer"
            >
              Criar primeiro post
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
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${post.section === "comunidade" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                          {post.section === "comunidade" ? "Comunidade" : "Fórum"}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200">{post.text}</p>
                      {post.postImageUrl && (
                        <img
                          src={post.postImageUrl.startsWith("/") ? post.postImageUrl : `/images/uploads/${post.postImageUrl}`}
                          className="mt-3 rounded-xl max-h-48 object-cover w-full"
                        />
                      )}
                      <div className="flex gap-4 mt-3 text-xs text-gray-400">
                        <span>❤️ {post.likesCount || 0} curtidas</span>
                        <span>💬 {post.replyCount || 0} respostas</span>
                      </div>
                    </div>
                    {/* Ações */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setEditingPost(post); }}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-[#1A3879] transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-40 cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editingPost && (
          <EditModal
            post={editingPost}
            onClose={() => setEditingPost(null)}
            onSave={handleSaveEdit}
            onToast={showToast}
            getToken={getToken}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
