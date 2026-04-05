import { fal } from '../lib/fal.js';

interface GenerateOptions {
  prompt: string;
  width: number;
  height: number;
  isPremium: boolean;
}

interface GenerateResult {
  imageUrl: string;
}

// ─── Бесплатная модель — Flux.1 Schnell ───────────────────────────
async function generateFree(prompt: string, width: number, height: number): Promise<string> {
  const result = (await fal.subscribe('fal-ai/flux/schnell', {
    input: {
      prompt,
      image_size: {
        width,
        height,
      },
      num_inference_steps: 4, // Schnell быстрый — 4 шага достаточно
      num_images: 1,
      enable_safety_checker: true,
    },
  })) as any;

  return result.images[0].url;
}

// ─── Премиум модель — Flux.1 Dev ──────────────────────────────────
async function generatePremium(prompt: string, width: number, height: number): Promise<string> {
  const result = (await fal.subscribe('fal-ai/flux/dev', {
    input: {
      prompt,
      image_size: {
        width,
        height,
      },
      num_inference_steps: 28, // Dev лучше качество — больше шагов
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: true,
    },
  })) as any;

  return result.images[0].url;
}

// ─── Главная функция ──────────────────────────────────────────────
export async function generateImage(options: GenerateOptions): Promise<GenerateResult> {
  const { prompt, width, height, isPremium } = options;

  const imageUrl = isPremium
    ? await generatePremium(prompt, width, height)
    : await generateFree(prompt, width, height);

  return { imageUrl };
}
