"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/context/ToastContext";
import CommentCard from "./ForumComments";
import PostDetailModal from "./PostDetailModal";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Forum() {
  const [comments, setComments] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const { t } = useLanguage();
  const { user, getToken } = useUser();
  const { showToast } = useToast();

  useEffect(() => {
    fetch(`${API}/api/comments`, {
      headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
    })
      .then((r) => r.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]));
  }, []);

  const visibleComments = comments.slice(0, 8);

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <>
    <motion.section
      id="comunidade"
      className="py-10 lg:py-15 flex flex-col items-center w-full dark:bg-zinc-800 dark:text-white"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.h1
        className="font-bold text-2xl lg:text-3xl mb-10"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {t('components.forum.title')}
      </motion.h1>

      <div className="w-full px-6">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {visibleComments.map((comment, index) => (
            <motion.div
              key={comment.id || index}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
              className="w-full"
            >
              <CommentCard
                {...comment}
                image={`/images/avatars/${comment.imageUrl || "avatar01.png"}`}
                onClick={() => setSelectedPost(comment)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="flex flex-col gap-6 items-center w-full mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <motion.a
          href="/comunidade"
          className="bg-[#0033FF] text-white px-8 py-2 rounded-full font-bold uppercase"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('components.forum.view_more')}
        </motion.a>
        <motion.span
          className="w-4/5 lg:w-3/5 h-px bg-black dark:bg-white block"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
    </motion.section>

    <AnimatePresence>
      {selectedPost && (
        <PostDetailModal
          comment={selectedPost}
          onClose={() => setSelectedPost(null)}
          currentUser={user}
          getToken={getToken}
          showToast={showToast}
        />
      )}
    </AnimatePresence>
    </>
  );
}
