"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageCircle, Bookmark, Share2, Send, CornerDownRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function ReplyCard({ reply, isPostAuthor, onReplyClick }) {
  const [likes, setLikes] = useState(reply.likesCount || 0);
  const [liked, setLiked] = useState(reply.likedByMe || false);

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 dark:border-zinc-800 last:border-0">
      <img
        src={`/images/avatars/${reply.imageUrl || "avatar01.png"}`}
        alt={reply.author}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-[14px] text-gray-900 dark:text-white">{reply.author}</span>
        <p className="text-[14px] text-gray-700 dark:text-gray-300 mt-0.5 leading-relaxed whitespace-pre-wrap break-words">
          {reply.text}
        </p>
        <div className="flex items-center gap-3 mt-2 text-gray-400">
          <button
            className={`flex items-center gap-1 text-[12px] transition-colors ${liked ? "text-red-500" : "hover:text-red-400"}`}
            onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }}
          >
            <Heart className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} />
            {likes > 0 && <span>{likes}</span>}
          </button>
          {isPostAuthor ? (
            <button
              onClick={() => onReplyClick(reply)}
              className="flex items-center gap-1 text-[12px] hover:text-[#1A3879] dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <CornerDownRight className="w-3.5 h-3.5" />
              Responder
            </button>
          ) : (
            <span className="relative group/tip flex items-center gap-1 text-[12px] text-gray-300 dark:text-zinc-600 cursor-not-allowed select-none">
              <CornerDownRight className="w-3.5 h-3.5" />
              Responder
              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-max max-w-[180px] rounded-lg bg-gray-800 dark:bg-zinc-700 text-white text-[11px] leading-snug px-2.5 py-1.5 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 whitespace-normal text-center shadow-lg z-10">
                Apenas o autor do post pode responder
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800 dark:border-t-zinc-700" />
              </span>
            </span>
          )}
          <button className="flex items-center gap-1 text-[12px] hover:text-[#1A3879] dark:hover:text-blue-400 transition-colors ml-auto">
            <Bookmark className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-1 text-[12px] hover:text-[#1A3879] dark:hover:text-blue-400 transition-colors">
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PostDetailModal({ comment, onClose, currentUser, getToken, showToast }) {
  const [likes, setLikes] = useState(comment.likesCount || 0);
  const [liked, setLiked] = useState(comment.likedByMe || false);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [posting, setPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // { id, author }
  const inputRef = useRef(null);
  const isPostAuthor = !!currentUser && currentUser.id === comment.userId;

  useEffect(() => {
    if (currentUser) setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  useEffect(() => {
    fetch(`${API}/api/comments/${comment.id}/replies`, {
      headers: getToken?.() ? { Authorization: `Bearer ${getToken()}` } : {},
    })
      .then((r) => r.json())
      .then((data) => setReplies(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [comment.id]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) { showToast?.("Faça login para curtir.", "warning"); return; }
    const prev = { liked, likes };
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    const res = await fetch(`${API}/api/comments/${comment.id}/like`, {
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

  const handleReplyToComment = (reply) => {
    if (reply.parentId !== comment.id) {
      showToast?.("Não é possível responder a uma resposta.", "error");
      return;
    }
    if (replies.some((r) => r.parentId === reply.id)) {
      showToast?.("Este comentário já possui uma resposta.", "error");
      return;
    }
    setReplyingTo({ id: reply.id, author: reply.author });
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newReply.trim() || !currentUser) return;
    const parentId = replyingTo ? replyingTo.id : comment.id;
    if (replies.some((r) => r.parentId === parentId)) {
      showToast?.("Este comentário já possui uma resposta.", "error");
      return;
    }
    setPosting(true);
    const res = await fetch(`${API}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ text: newReply, section: comment.section || "forum", parentId }),
    });
    if (res.ok) {
      const created = await res.json();
      setReplies((p) => [...p, created]);
      setNewReply("");
      setReplyingTo(null);
    }
    setPosting(false);
  };

  const username = `@${comment.author?.replace(/\s+/g, "").toLowerCase() || "usuario"}`;
  const tags = comment.tags || [];

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
        {/* Purple header */}
        <div className="relative bg-[#6B21A8] px-6 pt-8 pb-5 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          >
            <X size={16} className="text-white" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={`/images/avatars/${comment.imageUrl || "avatar01.png"}`}
              alt={comment.author}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-white/30 flex-shrink-0"
            />
            <div>
              <p className="text-white font-bold text-lg leading-tight">{username}</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-white border border-white/50 rounded-full px-2.5 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Post card */}
          <div className="px-5 pt-4 pb-2 border-b border-gray-100 dark:border-zinc-800">
            <div className="border-2 border-[#0033FF] rounded-xl p-4 flex gap-3">
              <img
                src={`/images/avatars/${comment.imageUrl || "avatar01.png"}`}
                alt={comment.author}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">{comment.author}</span>
                <p className="text-[14px] text-gray-800 dark:text-gray-200 mt-1 leading-relaxed whitespace-pre-wrap break-words">
                  {comment.text}
                </p>
                {comment.postImageUrl && (
                  <img
                    src={comment.postImageUrl.startsWith("/") ? comment.postImageUrl : `/images/uploads/${comment.postImageUrl}`}
                    alt="Imagem do post"
                    className="mt-3 rounded-xl w-full max-h-52 object-cover"
                  />
                )}
              </div>
            </div>

            {/* Actions bar */}
            <div className="flex items-center gap-1 mt-3 -ml-1 pb-1">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 text-[13px] font-medium px-2 py-1.5 rounded-full transition-colors group ${
                  liked ? "text-red-500" : "text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                }`}
              >
                <Heart className="w-[18px] h-[18px]" fill={liked ? "currentColor" : "none"} strokeWidth={liked ? 0 : 2} />
                {likes > 0 && <span>{likes}</span>}
              </button>

              <button
                onClick={() => inputRef.current?.focus()}
                className="flex items-center gap-1 text-[13px] font-medium text-gray-400 hover:text-[#1A3879] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1.5 rounded-full transition-colors"
              >
                <MessageCircle className="w-[18px] h-[18px]" />
                {(comment.replyCount || replies.length) > 0 && <span>{comment.replyCount || replies.length}</span>}
              </button>

              <div className="flex items-center gap-1 ml-auto">
                <button className="flex items-center gap-1 text-[13px] font-medium text-gray-400 hover:text-[#1A3879] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1.5 rounded-full transition-colors">
                  <Bookmark className="w-[18px] h-[18px]" />
                </button>
                <button className="flex items-center gap-1 text-[13px] font-medium text-gray-400 hover:text-[#1A3879] dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1.5 rounded-full transition-colors">
                  <Share2 className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Replies */}
          {replies.length > 0 && (() => {
            const directReplies = replies.filter((r) => r.parentId === comment.id);
            const nestedMap = {};
            replies.forEach((r) => {
              if (r.parentId !== comment.id) {
                if (!nestedMap[r.parentId]) nestedMap[r.parentId] = [];
                nestedMap[r.parentId].push(r);
              }
            });
            return (
              <div className="px-5 pt-3 pb-4">
                <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Respostas
                </p>
                {directReplies.map((reply) => (
                  <div key={reply.id}>
                    <ReplyCard reply={reply} isPostAuthor={isPostAuthor} onReplyClick={handleReplyToComment} />
                    {(nestedMap[reply.id] || []).map((nested) => (
                      <div key={nested.id} className="ml-4 pl-4 border-l-2 border-gray-200 dark:border-zinc-700">
                        <ReplyCard reply={nested} isPostAuthor={isPostAuthor} onReplyClick={handleReplyToComment} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })()}

          {replies.length === 0 && (
            <div className="px-5 py-6 text-center text-[13px] text-gray-400 dark:text-zinc-500">
              Nenhuma resposta ainda.
            </div>
          )}
        </div>

        {/* Reply input */}
        <div className="border-t border-gray-100 dark:border-zinc-800 px-4 py-3 flex-shrink-0">
          {!currentUser ? (
            <p className="text-center text-[13px] text-gray-400 dark:text-zinc-500">
              <a href="#" className="text-[#1A3879] dark:text-blue-400 font-medium">Faça login</a> para comentar.
            </p>
          ) : (
            <form onSubmit={handlePost} className="flex flex-col gap-1.5">
              {replyingTo && (
                <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-zinc-500 px-1">
                  <span>Respondendo a <span className="font-semibold text-[#1A3879] dark:text-blue-400">@{replyingTo.author}</span></span>
                  <button type="button" onClick={() => setReplyingTo(null)} className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <img
                  src={`/images/avatars/${currentUser.profilePicture || "avatar01.png"}`}
                  alt="Você"
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <input
                  ref={inputRef}
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder={replyingTo ? `Respondendo a @${replyingTo.author}…` : "Escreva um comentário…"}
                  className="flex-1 bg-gray-100 dark:bg-zinc-800 text-[14px] text-gray-800 dark:text-gray-200 placeholder-gray-400 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-[#1A3879]/30"
                />
                <button
                  type="submit"
                  disabled={!newReply.trim() || posting}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A3879] text-white disabled:opacity-40 transition-opacity cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
