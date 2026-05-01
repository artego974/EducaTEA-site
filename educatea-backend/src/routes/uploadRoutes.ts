import { Router } from "express";
import { uploadMiddleware, uploadImage } from "../controllers/uploadController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) { res.status(400).json({ message: err.message }); return; }
    next();
  });
}, uploadImage);

export default router;
