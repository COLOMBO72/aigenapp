import { Worker, Job } from 'bullmq';
import { prisma } from '../../lib/prisma.js';
import { redisConnection } from '../../lib/redis.js';
import { uploadImageToStorage } from '../../utils/upload.js';
import { GenerateJobData, SDApiResponse } from './generate.types.js';
import dotenv from 'dotenv';

dotenv.config();

const SD_API_URL = process.env.SD_API_URL || 'http://localhost:7860';

async function callStableDiffusion(
  prompt: string,
  width: number,
  height: number
): Promise<string> {
  const response = await fetch(`${SD_API_URL}/sdapi/v1/txt2img`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      negative_prompt: 'blurry, bad quality, distorted, ugly',
      steps: 20,
      width,
      height,
      cfg_scale: 7,
      sampler_name: 'DPM++ 2M Karras',
    }),
  });

  if (!response.ok) {
    throw new Error(`SD API error: ${response.status}`);
  }

  const data = await response.json() as SDApiResponse;
  return data.images[0];
}

export function createWorker(): Worker {
  const worker = new Worker<GenerateJobData>(
    'image-generation',
    async (job: Job<GenerateJobData>) => {
      const { generationId, prompt, width, height } = job.data;

      console.log(`🎨 Processing generation ${generationId}`);

      await prisma.generation.update({
        where: { id: generationId },
        data: { status: 'PROCESSING' },
      });

      try {
        // Вызываем Stable Diffusion
        const base64Image = await callStableDiffusion(prompt, width, height);

        // Загружаем в Яндекс Object Storage
        const imageUrl = await uploadImageToStorage(base64Image, generationId);

        // Сохраняем URL в БД
        await prisma.generation.update({
          where: { id: generationId },
          data: { status: 'COMPLETED', imageUrl },
        });

        console.log(`✅ Generation ${generationId} completed — ${imageUrl}`);
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