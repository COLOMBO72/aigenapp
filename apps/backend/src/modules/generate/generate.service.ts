import { Queue } from 'bullmq';
import { prisma } from '../../lib/prisma.js';
import { redisConnection } from '../../lib/redis.js';
import { GenerateRequest, GenerateJobData } from './generate.types.js';
import { JwtPayload } from '../../utils/jwt.js';
import { PLAN_LIMITS } from '@ai-image-app/shared';

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
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

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

  const plan = dbUser.plan === 'FREE' ? 'free' : 'premium';
  const limit = PLAN_LIMITS[plan].generationsPerDay;

  if (limit !== Infinity && dbUser.generationsToday >= limit) {
    throw new Error(
      `Daily limit reached. Free plan allows ${limit} generations per day.`
    );
  }

  const maxResolution = PLAN_LIMITS[plan].maxResolution;
  const [maxWidth, maxHeight] = maxResolution.split('x').map(Number);

  const width = Math.min(data.width || 512, maxWidth);
  const height = Math.min(data.height || 512, maxHeight);

  const generation = await prisma.generation.create({
    data: {
      userId: dbUser.id,
      prompt: data.prompt,
      width,
      height,
      status: 'PENDING',
    },
  });

  await prisma.user.update({
    where: { id: dbUser.id },
    data: { generationsToday: { increment: 1 } },
  });

  await generateQueue.add('generate', {
    generationId: generation.id,
    userId: dbUser.id,
    prompt: data.prompt,
    width,
    height,
  }, { jobId: generation.id });

  return { generationId: generation.id };
}

export async function getGeneration(generationId: string, userId: string) {
  const generation = await prisma.generation.findFirst({
    where: { id: generationId, userId },
  });

  if (!generation) {
    throw new Error('Generation not found');
  }

  return generation;
}

export async function getUserGenerations(userId: string) {
  return prisma.generation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}