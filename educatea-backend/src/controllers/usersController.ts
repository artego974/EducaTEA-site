import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { User } from "../models/User";
import { AccessibilitySettings } from "../models/AccessibilitySettings";

const userRepo = () => AppDataSource.getRepository(User);
const settingsRepo = () => AppDataSource.getRepository(AccessibilitySettings);

export async function updateUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (req.user!.id !== id && req.user!.role !== "admin") {
    res
      .status(403)
      .json({ message: "Sem permissão para editar este usuário." });
    return;
  }

  const user = await userRepo().findOneBy({ id });
  if (!user) {
    res.status(404).json({ message: "Usuário não encontrado." });
    return;
  }

  const { name, profilePicture, country, colorBackground, tags, password } =
    req.body;

  if (name) user.name = name;
  if (profilePicture) user.profilePicture = profilePicture;
  if (country) user.country = country;
  if (colorBackground) user.colorBackground = colorBackground;
  if (tags) user.tags = tags;
  if (password) user.password = await bcrypt.hash(password, 10);

  await userRepo().save(user);
  res.json({ ...user, password: undefined });
}

export async function getAccessibility(
  req: Request,
  res: Response,
): Promise<void> {
  const { id } = req.params;

  if (req.user!.id !== id && req.user!.role !== "admin") {
    res.status(403).json({ message: "Sem permissão." });
    return;
  }

  let settings = await settingsRepo().findOneBy({ userId: id });
  if (!settings) {
    settings = settingsRepo().create({ userId: id });
    await settingsRepo().save(settings);
  }

  res.json(settings);
}

export async function updateAccessibility(
  req: Request,
  res: Response,
): Promise<void> {
  const { id } = req.params;

  if (req.user!.id !== id && req.user!.role !== "admin") {
    res.status(403).json({ message: "Sem permissão." });
    return;
  }

  let settings = await settingsRepo().findOneBy({ userId: id });
  if (!settings) {
    settings = settingsRepo().create({ userId: id });
  }

  const allowed = [
    "altoContraste",
    "modoEscuro",
    "espacamentoTexto",
    "pararAnimacoes",
    "cursorGigante",
    "fonteLegivel",
    "destacarLinks",
    "daltonismo",
    "zoom",
    "leitorTexto",
    "mascaraLeitura",
    "lupa",
    "guiaLeitura",
    "tecladoVirtual",
  ];

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      (settings as unknown as Record<string, unknown>)[key] = req.body[key];
    }
  }

  await settingsRepo().save(settings);
  res.json(settings);
}
