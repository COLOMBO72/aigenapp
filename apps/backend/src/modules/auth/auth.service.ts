import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../utils/jwt.js';
import { RegisterRequest, LoginRequest, AuthResponse } from './auth.types.js';

// ─── Регистрация ───────────────────────────────────────────────────
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  // Проверяем что email не занят
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('Email already in use');
  }

  // Проверяем что username не занят
  const existingUsername = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (existingUsername) {
    throw new Error('Username already in use');
  }

  // Хешируем пароль (10 раундов — баланс безопасности и скорости)
  const passwordHash = await bcrypt.hash(data.password, 10);

  // Создаём пользователя
  const user = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      passwordHash,
    },
  });

  // Генерируем токены
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    plan: user.plan,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Сохраняем refresh токен в БД
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      plan: user.plan,
    },
  };
}

// ─── Вход ──────────────────────────────────────────────────────────
export async function login(data: LoginRequest): Promise<AuthResponse> {
  // Ищем пользователя
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    // Намеренно общая ошибка — не даём угадать существует ли email
    throw new Error('Invalid credentials');
  }

  // Проверяем пароль
  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Генерируем токены
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    plan: user.plan,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Сохраняем refresh токен
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      plan: user.plan,
    },
  };
}

// ─── Обновление токена ─────────────────────────────────────────────
export async function refresh(token: string): Promise<{ accessToken: string }> {
  // Проверяем токен в БД
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }

  // Верифицируем JWT
  verifyToken(token);

  // Генерируем новый access токен
  const accessToken = generateAccessToken({
    userId: storedToken.user.id,
    email: storedToken.user.email,
    plan: storedToken.user.plan,
  });

  return { accessToken };
}

// ─── Выход ─────────────────────────────────────────────────────────
export async function logout(token: string): Promise<void> {
  // Удаляем refresh токен из БД
  await prisma.refreshToken.deleteMany({
    where: { token },
  });
}
