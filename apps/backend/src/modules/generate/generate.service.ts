import { Queue } from 'bullmq';
import { prisma } from '../../lib/prisma.js';
import { redisConnection } from '../../lib/redis.js';
import { GenerateRequest, GenerateJobData } from './generate.types.js';
import { JwtPayload } from '../../utils/jwt.js';
import { PLAN_LIMITS, PRICES } from '@ai-image-app/shared';

export const generateQueue = new Queue('image-generation', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

export async function createGeneration(
  user: JwtPayload,
  data: GenerateRequest
): Promise<{ generationId: string }> {

  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    include: { balance: true },
  });

  if (!dbUser) throw new Error('User not found');

  // ─── Сброс дневного лимита ────────────────────────────────────
  const today = new Date();
  const lastReset = new Date(dbUser.lastResetAt);
  const isNewDay =
    today.getDate() !== lastReset.getDate() ||
    today.getMonth() !== lastReset.getMonth() ||
    today.getFullYear() !== lastReset.getFullYear();

  if (isNewDay) {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { generationsToday: 0, lastResetAt: today },
    });
    dbUser.generationsToday = 0;
  }

  const isPremiumRequest = data.isPremium || false;

  if (isPremiumRequest) {
    // ─── Логика Premium генерации ─────────────────────────────
    if (dbUser.plan !== 'PREMIUM') {
      throw new Error('Premium subscription required');
    }

    if (dbUser.premiumCredits > 0) {
      // Списываем из кредитов подписки
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { premiumCredits: { decrement: 1 } },
      });
    } else {
      // Кредиты кончились — списываем с баланса
      const price = PRICES.pictures.perGeneration;
      const balance = dbUser.balance?.amount || 0;

      if (balance < price) {
        throw new Error(
          `Недостаточно средств на балансе. Нужно ${price}₽, доступно ${balance}₽`
        );
      }

      await prisma.balance.update({
        where: { userId: dbUser.id },
        data: { amount: { decrement: price } },
      });

      await prisma.transaction.create({
        data: {
          userId: dbUser.id,
          type: 'GENERATION',
          amount: price,
          description: 'Premium генерация изображения',
          status: 'SUCCEEDED',
        },
      });
    }
  } else {
    // ─── Логика Free генерации ────────────────────────────────
    const limit = PLAN_LIMITS[dbUser.plan === 'FREE' ? 'free' : 'premium'].generationsPerDay;

    if (limit !== Infinity && dbUser.generationsToday >= limit) {
      throw new Error(
        `Достигнут дневной лимит. Free тариф: ${limit} генераций в день.`
      );
    }

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { generationsToday: { increment: 1 } },
    });
  }

  // ─── Определяем разрешение ────────────────────────────────────
  const maxRes = isPremiumRequest ? 1024 : 512;
  const width = Math.min(data.width || 512, maxRes);
  const height = Math.min(data.height || 512, maxRes);

  // ─── Создаём запись в БД ──────────────────────────────────────
  const generation = await prisma.generation.create({
    data: {
      userId: dbUser.id,
      prompt: data.prompt,
      width,
      height,
      status: 'PENDING',
      isPremium: isPremiumRequest,
    },
  });

  // ─── Добавляем в очередь ──────────────────────────────────────
  await generateQueue.add('generate', {
    generationId: generation.id,
    userId: dbUser.id,
    prompt: data.prompt,
    width,
    height,
    isPremium: isPremiumRequest,
  }, { jobId: generation.id });

  return { generationId: generation.id };
}

export async function getGeneration(generationId: string, userId: string) {
  const generation = await prisma.generation.findFirst({
    where: { id: generationId, userId },
  });

  if (!generation) throw new Error('Generation not found');
  return generation;
}

export async function getUserGenerations(userId: string) {
  return prisma.generation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}