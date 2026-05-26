"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
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
  replyCount = 0,
  comunidade = false,
  onClick,
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
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

  return (
    <article
      onClick={onClick}
      className={`
        border-2 border-[#0033FF] rounded-lg flex flex-col gap-2
        cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 dark:text-white transition-all
        ${comunidade ? "p-3 w-full text-sm" : "p-4 lg:py-5 2xl:w-[450px] text-xs 2xl:text-sm"}
      `}
    >
      <div className="flex items-center gap-3">
        <img
          src={image}
          alt={`Avatar de ${author}`}
          className={`${comunidade ? "w-10 h-10" : "w-12 h-12"} rounded-full object-cover flex-shrink-0`}
        />
        <span className="text-[11px] 2xl:text-xs text-gray-600 dark:text-gray-300 font-medium">{author}</span>
      </div>

      <p className={`${comunidade ? "text-[13px] line-clamp-3" : "text-[12.5px] 2xl:text-sm line-clamp-3"}`}>
        {text}
      </p>

      {postImageUrl && (
        <img
          src={postImageUrl.startsWith("/") ? postImageUrl : `/images/uploads/${postImageUrl}`}
          alt="Imagem do post"
          className="w-full rounded-md object-cover max-h-36"
          onClick={(e) => e.stopPropagation()}
        />
      )}

      <div className="flex items-center gap-4 mt-1 text-[11px] text-gray-500 dark:text-gray-400">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 transition-colors cursor-pointer ${liked ? "text-red-500" : "hover:text-red-400"}`}
          title={liked ? "Descurtir" : "Curtir"}
        >
          <Heart className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} />
          {likes}
        </button>
        {replyCount > 0 && (
          <span className="text-gray-400">{replyCount} {replyCount === 1 ? "resposta" : "respostas"}</span>
        )}
      </div>
    </article>
  );
}
