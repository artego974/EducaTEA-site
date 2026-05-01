import { Router } from "express";
import { listNews, getNews, createNews, updateNews, deleteNews } from "../controllers/newsController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router();

router.get("/", listNews);
router.get("/:id", getNews);
router.post("/", authMiddleware, adminMiddleware, createNews);
router.put("/:id", authMiddleware, adminMiddleware, updateNews);
router.delete("/:id", authMiddleware, adminMiddleware, deleteNews);

export default router;
