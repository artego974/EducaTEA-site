import { Request, Response } from "express";
import { In, IsNull } from "typeorm";
import { AppDataSource } from "../data-source";
import { Comment, CommentSection } from "../models/Comment";
import { Like } from "../models/Like";
import { User } from "../models/User";

const commentRepo = () => AppDataSource.getRepository(Comment);
const likeRepo = () => AppDataSource.getRepository(Like);
const userRepo = () => AppDataSource.getRepository(User);

// Batch-enriches comments with likesCount, replyCount and likedByMe —
// 3 queries total regardless of how many comments are passed.
async function enrichComments(comments: Comment[], userId?: string) {
  if (comments.length === 0) return [];

  const ids = comments.map((c) => c.id);

  const [likeRows, replyRows, userLikes] = await Promise.all([
    likeRepo()
      .createQueryBuilder("l")
      .select("l.commentId", "commentId")
      .addSelect("COUNT(*)", "cnt")
      .where("l.commentId IN (:...ids)", { ids })
      .groupBy("l.commentId")
      .getRawMany<{ commentId: string; cnt: string }>(),

    commentRepo()
      .createQueryBuilder("c")
      .select("c.parentId", "parentId")
      .addSelect("COUNT(*)", "cnt")
      .where("c.parentId IN (:...ids)", { ids })
      .groupBy("c.parentId")
      .getRawMany<{ parentId: string; cnt: string }>(),

    userId
      ? likeRepo().find({ where: { userId, commentId: In(ids) }, select: ["commentId"] })
      : Promise.resolve([]),
  ]);

  const likesMap = new Map(likeRows.map((r) => [r.commentId, parseInt(r.cnt, 10)]));
  const replyMap = new Map(replyRows.map((r) => [r.parentId, parseInt(r.cnt, 10)]));
  const likedSet = new Set((userLikes as Like[]).map((l) => l.commentId));

  return comments.map((c) => ({
    ...c,
    likesCount: likesMap.get(c.id) ?? 0,
    replyCount: replyMap.get(c.id) ?? 0,
    likedByMe: likedSet.has(c.id),
  }));
}

export async function listComments(req: Request, res: Response): Promise<void> {
  const section = (req.query.section as CommentSection) || "forum";
  const comments = await commentRepo().find({
    where: { section, parentId: IsNull() },
    order: { createdAt: "DESC" },
  });
  const enriched = await enrichComments(comments, req.user?.id);
  res.json(enriched);
}

export async function getComment(req: Request, res: Response): Promise<void> {
  const comment = await commentRepo().findOneBy({ id: req.params.id });
  if (!comment) { res.status(404).json({ message: "Comentário não encontrado." }); return; }
  const [enriched] = await enrichComments([comment], req.user?.id);
  res.json(enriched);
}

export async function getReplies(req: Request, res: Response): Promise<void> {
  const replies = await commentRepo().find({
    where: { parentId: req.params.id },
    order: { createdAt: "ASC" },
  });
  const enriched = await enrichComments(replies, req.user?.id);
  res.json(enriched);
}

export async function createComment(req: Request, res: Response): Promise<void> {
  const { text, section, parentId, postImageUrl } = req.body;

  if (!text?.trim()) { res.status(400).json({ message: "Texto é obrigatório." }); return; }

  const user = await userRepo().findOneBy({ id: req.user!.id });
  if (!user) { res.status(404).json({ message: "Usuário não encontrado." }); return; }

  const comment = commentRepo().create({
    text: text.trim(),
    author: user.name,
    imageUrl: user.profilePicture,
    section: section || "forum",
    userId: user.id,
    parentId: parentId || undefined,
    postImageUrl: postImageUrl || undefined,
  });

  await commentRepo().save(comment);
  const [enriched] = await enrichComments([comment], user.id);
  res.status(201).json(enriched);
}

export async function updateComment(req: Request, res: Response): Promise<void> {
  const comment = await commentRepo().findOneBy({ id: req.params.id });
  if (!comment) { res.status(404).json({ message: "Comentário não encontrado." }); return; }

  if (comment.userId !== req.user!.id && req.user!.role !== "admin") {
    res.status(403).json({ message: "Sem permissão." }); return;
  }

  if (req.body.text !== undefined) {
    const trimmed = req.body.text.trim();
    if (!trimmed) { res.status(400).json({ message: "Texto não pode estar vazio." }); return; }
    comment.text = trimmed;
  }
  if (req.body.postImageUrl !== undefined) comment.postImageUrl = req.body.postImageUrl;

  await commentRepo().save(comment);
  const [enriched] = await enrichComments([comment], req.user!.id);
  res.json(enriched);
}

export async function deleteComment(req: Request, res: Response): Promise<void> {
  const comment = await commentRepo().findOneBy({ id: req.params.id });
  if (!comment) { res.status(404).json({ message: "Comentário não encontrado." }); return; }

  if (comment.userId !== req.user!.id && req.user!.role !== "admin") {
    res.status(403).json({ message: "Sem permissão." }); return;
  }

  await commentRepo().remove(comment);
  res.status(204).send();
}

export async function toggleLike(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.id;

  const comment = await commentRepo().findOneBy({ id });
  if (!comment) { res.status(404).json({ message: "Comentário não encontrado." }); return; }

  const existing = await likeRepo().findOneBy({ userId, commentId: id });
  if (existing) {
    await likeRepo().remove(existing);
  } else {
    await likeRepo().save(likeRepo().create({ userId, commentId: id }));
  }

  const likesCount = await likeRepo().count({ where: { commentId: id } });
  res.json({ liked: !existing, likesCount });
}

export async function myComments(req: Request, res: Response): Promise<void> {
  const comments = await commentRepo().find({
    where: { userId: req.user!.id, parentId: IsNull() },
    order: { createdAt: "DESC" },
  });
  const enriched = await enrichComments(comments, req.user!.id);
  res.json(enriched);
}
