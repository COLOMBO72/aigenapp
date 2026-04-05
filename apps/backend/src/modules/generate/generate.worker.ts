import { Worker, Job } from 'bullmq';
import { prisma } from '../../lib/prisma.js';
import { redisConnection } from '../../lib/redis.js';
import { generateImage } from '../../utils/generateImage.js';
import { uploadImageToStorage } from '../../utils/upload.js';
import { GenerateJobData } from './generate.types.js';
import dotenv from 'dotenv';

dotenv.config();

export function createWorker(): Worker {
  const worker = new Worker<GenerateJobData>(
    'image-generation',
    async (job: Job<GenerateJobData>) => {
      const { generationId, prompt, width, height, isPremium } = job.data;

      console.log(`🎨 Processing generation ${generationId} (${isPremium ? 'Premium' : 'Free'})`);

      await prisma.generation.update({
        where: { id: generationId },
        data: { status: 'PROCESSING' },
      });

      try {
        // Генерируем через fal.ai
        const { imageUrl: falImageUrl } = await generateImage({
          prompt,
          width,
          height,
          isPremium: isPremium || false,
        });

        // Скачиваем картинку и загружаем в Яндекс Storage
        const imageResponse = await fetch(falImageUrl);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        const base64Image = imageBuffer.toString('base64');
        const imageUrl = await uploadImageToStorage(base64Image, generationId);

        await prisma.generation.update({
          where: { id: generationId },
          data: { status: 'COMPLETED', imageUrl },
        });

        console.log(`✅ Generation ${generationId} completed`);
      } catch (error) {
        await prisma.generation.update({
          where: { id: generationId },
          data: {
            status: 'FAILED',
            errorMsg: error instanceof Error ? error.message : 'Unknown error',
          },
        });
        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: 2,
    }
  );

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err.message);
  });

  return worker;
}