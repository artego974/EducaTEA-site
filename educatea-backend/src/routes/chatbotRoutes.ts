import { Router } from "express";
import { createSession, addMessage, closeSession, submitFeedback } from "../controllers/chatbotController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Sessões não exigem auth (usuários anônimos podem usar o chatbot)
router.post("/sessions", createSession);
router.post("/sessions/:id/messages", addMessage);
router.post("/sessions/:id/close", closeSession);
router.post("/feedback", submitFeedback);

export default router;
