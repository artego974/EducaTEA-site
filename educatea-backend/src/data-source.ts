import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User";
import { Comment } from "./models/Comment";
import { Like } from "./models/Like";
import { ChatbotSession } from "./models/ChatbotSession";
import { ChatbotMessage } from "./models/ChatbotMessage";
import { ChatbotFeedback } from "./models/ChatbotFeedback";
import { NewsArticle } from "./models/NewsArticle";
import { AccessibilitySettings } from "./models/AccessibilitySettings";
import { SavedPost } from "./models/SavedPost";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root",
  database: process.env.DB_NAME || "educatea",
  timezone: "Z",
  logging: process.env.NODE_ENV === "development",
  entities: [User, Comment, Like, ChatbotSession, ChatbotMessage, ChatbotFeedback, NewsArticle, AccessibilitySettings, SavedPost],
  migrations: [],
});
