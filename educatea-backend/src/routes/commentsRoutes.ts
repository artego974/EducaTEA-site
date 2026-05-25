import { Router } from "express";
import {
  listComments, getComment, getReplies,
  createComment, updateComment, deleteComment,
  toggleLike, myComments,
} from "../controllers/commentsController";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", optionalAuthMiddleware, listComments);
router.get("/mine", authMiddleware, myComments);
router.get("/:id", optionalAuthMiddleware, getComment);
router.get("/:id/replies", optionalAuthMiddleware, getReplies);
router.post("/", authMiddleware, createComment);
router.put("/:id", authMiddleware, updateComment);
router.delete("/:id", authMiddleware, deleteComment);
router.post("/:id/like", authMiddleware, toggleLike);

export default router;
