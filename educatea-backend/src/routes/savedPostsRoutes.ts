import { Router } from "express";
import { toggleSave, mySavedPosts } from "../controllers/savedPostsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/comments/:id/save", authMiddleware, toggleSave);
router.get("/saved", authMiddleware, mySavedPosts);

export default router;
