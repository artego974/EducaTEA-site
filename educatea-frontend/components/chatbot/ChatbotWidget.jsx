"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ChatbotButton from "./ChatbotButton";
import ChatbotCard from "./ChatbotCard";
import ChatBotCardFeedback from "./ChatBotCardFeedback";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/chatbot/sessions`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => setSessionId(data.id))
      .catch(() => setSessionId(null));
  }, []);

  const handleCloseChat = () => {
    setOpen(false);
    setShowFeedback(true);
    if (sessionId) {
      fetch(`${API}/api/chatbot/sessions/${sessionId}/close`, { method: "POST" }).catch(() => {});
    }
  };

  const handleToggle = () => {
    if (open) {
      handleCloseChat();
    } else {
      setOpen(true);
      setShowFeedback(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-4 w-72">
      <div className="fixed bottom-22 right-4 sm:bottom-25 sm:right-6 z-50 flex flex-col items-end gap-3 max-w-[calc(100vw-2rem)] sm:max-w-none">
        <AnimatePresence>
          {open && <ChatbotCard onClose={handleCloseChat} sessionId={sessionId} />}
        </AnimatePresence>

        <AnimatePresence>
          {showFeedback && !open && (
            <ChatBotCardFeedback onClose={() => setShowFeedback(false)} sessionId={sessionId} />
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-6 right-6 z-30">
        <ChatbotButton onClick={handleToggle} isOpen={open} />
      </div>
    </div>
  );
}
