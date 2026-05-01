import { Request, Response } from "express";
import path from "path";
import multer from "multer";

const UPLOAD_DIR = path.join(__dirname, "../../../educatea-frontend/public/images/uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Apenas imagens são permitidas."));
  },
}).single("image");

export function uploadImage(req: Request, res: Response): void {
  if (!req.file) {
    res.status(400).json({ message: "Nenhum arquivo enviado." });
    return;
  }
  res.json({ filename: req.file.filename, url: `/images/uploads/${req.file.filename}` });
}
