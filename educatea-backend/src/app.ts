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

// Configure CORS robustly so preflight (OPTIONS) responses include
// the Access-Control-Allow-Origin header expected by browsers.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://educatea-front-production.up.railway.app",
  "http://localhost:3000",
].filter(Boolean) as string[];

const corsOptions = {
  origin: (origin: any, callback: (err: any, allowed?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled with the same CORS options
app.options("*", cors(corsOptions));
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
