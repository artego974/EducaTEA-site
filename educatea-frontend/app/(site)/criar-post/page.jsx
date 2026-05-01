"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import { ImagePlus, X, Send } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CriarPost() {
  const [text, setText] = useState("");
  const [section, setSection] = useState("comunidade");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { user, loading, getToken } = useUser();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      showToast("Faça login para criar um post.", "warning");
      router.replace("/");
    }
  }, [user, loading, showToast, router]);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) { showToast("Escreva algo antes de publicar.", "warning"); return; }

    setSubmitting(true);
    try {
      let postImageUrl = undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await fetch(`${API}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Erro ao enviar imagem. Verifique o formato e tamanho (máx. 5MB).");
        const uploadData = await uploadRes.json();
        postImageUrl = uploadData.url;
      }

      const res = await fetch(`${API}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ text, section, postImageUrl }),
      });

      if (res.status === 401) throw new Error("Sessão expirada. Faça login novamente.");
      if (!res.ok) throw new Error("Erro ao publicar post. Tente novamente.");

      showToast("Post publicado com sucesso! 🎉", "success");
      router.push(section === "forum" ? "/#comunidade" : "/comunidade");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A3879] dark:text-white">Criar Post</h1>
          <p className="text-gray-500 mt-1">Compartilhe sua experiência com a comunidade EducaTEA.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700 p-6 flex flex-col gap-6">
          {/* Autor */}
          <div className="flex items-center gap-3">
            <img
              src={`/images/avatars/${user.profilePicture || "avatar01.png"}`}
              className="w-12 h-12 rounded-full object-cover"
              alt="Avatar"
            />
            <div>
              <p className="font-semibold dark:text-white">{user.name}</p>
              <div className="flex gap-2 mt-1">
                {["comunidade", "forum"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSection(s)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                      section === s ? "bg-[#1A3879] text-white" : "bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {s === "comunidade" ? "Comunidade" : "Fórum"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Texto */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="O que você quer compartilhar?"
            rows={5}
            className="w-full bg-gray-50 dark:bg-zinc-700 dark:text-white rounded-xl p-4 outline-none text-gray-800 placeholder:text-gray-400 resize-none border border-transparent focus:border-[#1A3879] transition-colors"
          />

          {/* Preview da imagem */}
          {imagePreview && (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-600">
              <img src={imagePreview} alt="Preview" className="w-full max-h-72 object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-[#1A3879] font-medium text-sm cursor-pointer hover:opacity-80 transition">
              <ImagePlus size={20} />
              <span>Adicionar imagem</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className="flex items-center gap-2 bg-[#1A3879] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#152d63] transition-colors disabled:opacity-60 cursor-pointer"
              >
                <Send size={16} />
                {submitting ? "Publicando..." : "Publicar"}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
