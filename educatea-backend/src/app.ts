import "reflect-metadata";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import usersRoutes from "./routes/usersRoutes";
import commentsRoutes from "./routes/commentsRoutes";
import chatbotRoutes from "./routes/chatbotRoutes";
import newsRoutes from "./routes/newsRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import savedPostsRoutes from "./routes/savedPostsRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors({ 
  origin: process.env.FRONTEND_URL || "https://educatea-front-production.up.railway.app",
  credentials: true 
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", savedPostsRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

export default app;
