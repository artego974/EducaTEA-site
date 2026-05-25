import { Request, Response } from "express";
import { IsNull } from "typeorm";
import { AppDataSource } from "../data-source";
import { Comment } from "../models/Comment";
import { SavedPost } from "../models/SavedPost";
import { enrichComments } from "./commentsController";

const commentRepo = () => AppDataSource.getRepository(Comment);
const savedRepo = () => AppDataSource.getRepository(SavedPost);

export async function toggleSave(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.id;

  const comment = await commentRepo().findOneBy({ id });
  if (!comment) { res.status(404).json({ message: "Comentário não encontrado." }); return; }

  const existing = await savedRepo().findOneBy({ userId, commentId: id });
  if (existing) {
    await savedRepo().remove(existing);
    res.json({ saved: false });
  } else {
    await savedRepo().save(savedRepo().create({ userId, commentId: id }));
    res.json({ saved: true });
  }
}

export async function mySavedPosts(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;

  const saved = await savedRepo().find({
    where: { userId },
    order: { createdAt: "DESC" },
  });

  if (saved.length === 0) { res.json([]); return; }

  const commentIds = saved.map((s) => s.commentId);
  const comments = await commentRepo()
    .createQueryBuilder("c")
    .where("c.id IN (:...ids)", { ids: commentIds })
    .andWhere("c.parentId IS NULL")
    .getMany();

  const enriched = await enrichComments(comments, userId);
  res.json(enriched);
}
