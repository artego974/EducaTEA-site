import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../models/User";
import { AccessibilitySettings } from "../models/AccessibilitySettings";

const userRepo = () => AppDataSource.getRepository(User);
const settingsRepo = () => AppDataSource.getRepository(AccessibilitySettings);

function signToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions,
  );
}

export async function register(req: Request, res: Response): Promise<void> {
  const {
    name,
    email,
    password,
    profilePicture,
    country,
    colorBackground,
    role,
    tags,
  } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Nome, e-mail e senha são obrigatórios." });
    return;
  }

  const existing = await userRepo().findOneBy({ email });
  if (existing) {
    res.status(409).json({ message: "E-mail já cadastrado." });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = userRepo().create({
    name,
    email,
    password: hashed,
    profilePicture: profilePicture || "avatar01.png",
    country,
    colorBackground,
    role: role || "student",
    tags: tags || [],
  });

  await userRepo().save(user);

  // Cria configurações de acessibilidade padrão para o novo usuário
  const settings = settingsRepo().create({ userId: user.id });
  await settingsRepo().save(settings);

  const token = signToken(user);
  res.status(201).json({ token, user: { ...user, password: undefined } });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    return;
  }

  const user = await userRepo().findOne({
    where: { email },
    select: [
      "id",
      "name",
      "email",
      "password",
      "profilePicture",
      "country",
      "colorBackground",
      "role",
      "tags",
    ],
  });

  if (!user) {
    res.status(401).json({ message: "Credenciais inválidas." });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ message: "Credenciais inválidas." });
    return;
  }

  const token = signToken(user);
  res.json({ token, user: { ...user, password: undefined } });
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await userRepo().findOneBy({ id: req.user!.id });
  if (!user) {
    res.status(404).json({ message: "Usuário não encontrado." });
    return;
  }
  res.json(user);
}
