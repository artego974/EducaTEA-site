import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { NewsArticle } from "../models/NewsArticle";

const newsRepo = () => AppDataSource.getRepository(NewsArticle);

export async function listNews(req: Request, res: Response): Promise<void> {
  const news = await newsRepo().find({
    where: { status: "published" },
    order: { publicDate: "DESC" },
    relations: ["author"],
  });
  res.json(news);
}

export async function getNews(req: Request, res: Response): Promise<void> {
  const article = await newsRepo().findOne({
    where: { id: req.params.id, status: "published" },
    relations: ["author"],
  });
  if (!article) {
    res.status(404).json({ message: "Artigo não encontrado." });
    return;
  }
  res.json(article);
}

export async function createNews(req: Request, res: Response): Promise<void> {
  const {
    title,
    subtitle,
    content,
    heroImage,
    featureImage,
    imageCaption,
    imageCredit,
    section,
    status,
    publicDate,
  } = req.body;

  if (!title || !content) {
    res.status(400).json({ message: "Título e conteúdo são obrigatórios." });
    return;
  }

  const article = newsRepo().create({
    title,
    subtitle,
    content,
    heroImage,
    featureImage,
    imageCaption,
    imageCredit,
    section,
    status: status || "draft",
    publicDate,
    authorId: req.user!.id,
  });

  await newsRepo().save(article);
  res.status(201).json(article);
}

export async function updateNews(req: Request, res: Response): Promise<void> {
  const article = await newsRepo().findOneBy({ id: req.params.id });
  if (!article) {
    res.status(404).json({ message: "Artigo não encontrado." });
    return;
  }

  const fields = [
    "title",
    "subtitle",
    "content",
    "heroImage",
    "featureImage",
    "imageCaption",
    "imageCredit",
    "section",
    "status",
    "publicDate",
  ];
  for (const f of fields) {
    if (req.body[f] !== undefined)
      (article as unknown as Record<string, unknown>)[f] = req.body[f];
  }

  await newsRepo().save(article);
  res.json(article);
}

export async function deleteNews(req: Request, res: Response): Promise<void> {
  const article = await newsRepo().findOneBy({ id: req.params.id });
  if (!article) {
    res.status(404).json({ message: "Artigo não encontrado." });
    return;
  }
  await newsRepo().remove(article);
  res.status(204).send();
}
