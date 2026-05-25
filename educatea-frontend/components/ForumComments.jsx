"use client";

import { useState } from "react";
import { ThumbsUp, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CommentCard({
  id,
  text,
  author,
  image,
  postImageUrl,
  likesCount: initialLikes = 0,
  likedByMe: initialLiked = false,
  savedByMe: initialSaved = false,
  replyCount = 0,
  onClick,
  onCommentClick,
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const { user, getToken } = useUser();
  const { showToast } = useToast();

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      showToast("Faça login para curtir.", "warning");
      return;
    }
    const prev = { liked, likes };
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    const res = await fetch(`${API}/api/comments/${id}/like`, {
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
    if (!user) {
      showToast("Faça login para salvar posts.", "warning");
      return;
    }
    const prev = saved;
    setSaved((v) => !v);
    const res = await fetch(`${API}/api/comments/${id}/save`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) {
      const data = await res.json();
      setSaved(data.saved);
    } else {
      setSaved(prev);
    }
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
      onClick={onClick}
      className="border-2 border-[#0033FF] rounded-lg flex items-center gap-3 p-3 py-5 w-full cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 dark:text-white transition-colors"
    >
      <img
        src={image}
        alt={`Avatar de ${author}`}
        className="size-13 rounded-full object-cover flex-shrink-0"
      />

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-[12.5px] leading-snug text-gray-800 dark:text-gray-100 line-clamp-2">
          {text}
        </p>

        {postImageUrl && (
          <img
            src={postImageUrl.startsWith("/") ? postImageUrl : `/images/uploads/${postImageUrl}`}
            alt="Imagem do post"
            className="w-full rounded-md object-cover max-h-28"
            onClick={(e) => e.stopPropagation()}
          />
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
            {author}
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
              onClick={(e) => {
                e.stopPropagation();
                (onCommentClick || onClick)?.();
              }}
              className="flex items-center gap-0.5 hover:text-[#1A3879] dark:hover:text-blue-400 transition-colors cursor-pointer"
              title="Comentar"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {replyCount}
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center transition-colors cursor-pointer ${
                saved ? "text-[#1A3879] dark:text-blue-400" : "hover:text-[#1A3879] dark:hover:text-blue-400"
              }`}
              title={saved ? "Remover dos salvos" : "Salvar"}
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
