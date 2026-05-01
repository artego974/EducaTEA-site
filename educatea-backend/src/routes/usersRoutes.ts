import { Router } from "express";
import { updateUser, getAccessibility, updateAccessibility } from "../controllers/usersController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.put("/:id", authMiddleware, updateUser);
router.get("/:id/accessibility", authMiddleware, getAccessibility);
router.put("/:id/accessibility", authMiddleware, updateAccessibility);

export default router;
