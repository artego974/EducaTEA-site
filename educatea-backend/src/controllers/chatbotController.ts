import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ChatbotSession } from "../models/ChatbotSession";
import { ChatbotMessage } from "../models/ChatbotMessage";
import { ChatbotFeedback, FeedbackRating } from "../models/ChatbotFeedback";

const sessionRepo = () => AppDataSource.getRepository(ChatbotSession);
const messageRepo = () => AppDataSource.getRepository(ChatbotMessage);
const feedbackRepo = () => AppDataSource.getRepository(ChatbotFeedback);

const RATING_VALUES: Record<FeedbackRating, number> = {
  Péssimo: 1,
  Ruim: 2,
  Regular: 3,
  Bom: 4,
  Excelente: 5,
};

export async function createSession(
  req: Request,
  res: Response,
): Promise<void> {
  const session = sessionRepo().create({
    userId: req.user?.id || undefined,
    status: "active",
  });
  await sessionRepo().save(session);
  res.status(201).json(session);
}

export async function addMessage(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { text, sender } = req.body;

  if (!text || !sender) {
    res
      .status(400)
      .json({ message: "Campos 'text' e 'sender' são obrigatórios." });
    return;
  }

  const session = await sessionRepo().findOneBy({ id });
  if (!session) {
    res.status(404).json({ message: "Sessão não encontrada." });
    return;
  }
  if (session.status === "closed") {
    res.status(400).json({ message: "Sessão já encerrada." });
    return;
  }

  const message = messageRepo().create({ sessionId: id, sender, text });
  await messageRepo().save(message);
  res.status(201).json(message);
}

export async function closeSession(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const session = await sessionRepo().findOneBy({ id });

  if (!session) {
    res.status(404).json({ message: "Sessão não encontrada." });
    return;
  }

  session.status = "closed";
  session.endedAt = new Date();
  await sessionRepo().save(session);
  res.json(session);
}

export async function submitFeedback(
  req: Request,
  res: Response,
): Promise<void> {
  const { sessionId, rating } = req.body;

  if (!sessionId || !rating) {
    res
      .status(400)
      .json({ message: "Campos 'sessionId' e 'rating' são obrigatórios." });
    return;
  }

  if (!RATING_VALUES[rating as FeedbackRating]) {
    res.status(400).json({ message: "Rating inválido." });
    return;
  }

  const feedback = feedbackRepo().create({
    sessionId,
    userId: req.user?.id || undefined,
    rating: rating as FeedbackRating,
    ratingValue: RATING_VALUES[rating as FeedbackRating],
  });

  await feedbackRepo().save(feedback);
  res.status(201).json(feedback);
}
