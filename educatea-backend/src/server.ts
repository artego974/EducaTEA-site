import "reflect-metadata";
import "dotenv/config";
import { AppDataSource } from "./data-source";
import app from "./app";

const initDB = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};

export default async function handler(req: any, res: any) {
  try {
    await initDB();
  } catch (err) {
    console.error("Database connection error:", err);
    return res.status(500).json({ error: "Database unavailable" });
  }
  return app(req, res);
}
